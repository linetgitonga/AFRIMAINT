"""
Wiener-process Remaining Useful Life (RUL) estimator.

Ported directly from AfriSwarm_A141_Colab2.ipynb, "Phase 4: Wiener Process RUL
Estimator" (notebook cells 19-24). This is pure math over Weibull-derived
parameters — unlike the XGBoost classifier and Weibull-VAE, it needs no trained
artifact file, so it's fully implemented and testable here rather than deferred.

Known limitation carried over from the notebook: AI4I 2020 is a single-snapshot
dataset (one reading per machine), so every machine starts in the "prior-dominated"
regime. In production, MachineState.update() should be called with each new
sensor reading so the regime shifts to data-informed / machine-specific over time.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

import numpy as np
from scipy.special import gamma as _gamma
from scipy.stats import norm as _norm

# Weibull shape/scale fitted in the notebook (Phase 2) on AI4I 2020 tool-wear-at-failure.
# These are population-level defaults — refit per real pilot machine type once
# real failure history exists (see the implementation plan's Phase 4 honesty table).
DEFAULT_BETA_W = 1.974
DEFAULT_ETA_W = 187.70

# HI failure threshold from the notebook's Phase 3 Health Indicator.
HI_THRESHOLD = 0.85
# Composite degradation threshold: d=1 (full wear) + d=1 (full HI).
D_THRESHOLD = 2.0


@dataclass(frozen=True)
class WienerParams:
    """Wiener process parameters derived from a Weibull fit, per notebook cell 19."""

    beta_w: float
    eta_w: float
    mu_prior: float
    sigma: float
    sigma_sq: float
    tau_prior_sq: float
    d_threshold: float = D_THRESHOLD
    hi_threshold: float = HI_THRESHOLD


def derive_wiener_params(beta_w: float = DEFAULT_BETA_W, eta_w: float = DEFAULT_ETA_W) -> WienerParams:
    """Derive Wiener drift/diffusion from Weibull moments (notebook cell 19, Steps A-D)."""
    e_t_weibull = eta_w * _gamma(1.0 + 1.0 / beta_w)
    var_t_weibull = eta_w**2 * (_gamma(1.0 + 2.0 / beta_w) - _gamma(1.0 + 1.0 / beta_w) ** 2)

    mu_prior = D_THRESHOLD / e_t_weibull
    sigma_sq = var_t_weibull * mu_prior**3 / D_THRESHOLD
    sigma = float(np.sqrt(sigma_sq))
    tau_prior_sq = (0.5 * mu_prior) ** 2

    return WienerParams(
        beta_w=beta_w,
        eta_w=eta_w,
        mu_prior=mu_prior,
        sigma=sigma,
        sigma_sq=sigma_sq,
        tau_prior_sq=tau_prior_sq,
    )


def degradation_index(tool_wear: float, hi: float, eta_w: float, hi_threshold: float = HI_THRESHOLD) -> float:
    """Composite degradation signal: normalized wear + normalized HI (notebook cell 19)."""
    return float(np.asarray(tool_wear, dtype=float) / eta_w + np.asarray(hi, dtype=float) / hi_threshold)


def fpt_cdf(
    t: np.ndarray,
    x_current: float,
    mu: float,
    sigma: float,
    d: float = D_THRESHOLD,
) -> np.ndarray:
    """
    First-passage-time CDF: P(failure occurs within t more wear-minutes |
    current composite degradation index = x_current). Ported verbatim from
    notebook cell 20.
    """
    gap = d - x_current
    if gap <= 0:
        return np.ones_like(t, dtype=float)
    if mu <= 0:
        return np.zeros_like(t, dtype=float)

    t = np.maximum(t, 1e-9)
    sqrt_t = np.sqrt(t)

    term1 = _norm.cdf((mu * t - gap) / (sigma * sqrt_t))
    exp_factor = np.exp(np.clip(2.0 * mu * gap / (sigma**2), -500, 500))
    term2 = exp_factor * _norm.cdf(-(mu * t + gap) / (sigma * sqrt_t))

    return np.clip(term1 + term2, 0.0, 1.0)


def rul_quantiles(
    x_current: float,
    mu: float,
    sigma: float,
    d: float = D_THRESHOLD,
    quantiles: Tuple[float, ...] = (0.10, 0.50, 0.90),
    t_max: float = 500.0,
    n_points: int = 1000,
) -> Dict[float, float]:
    """
    Compute RUL quantiles by numerically inverting the FPT CDF. Ported verbatim
    from notebook cell 20. Returns {quantile: wear_minutes_to_failure}.
    """
    if x_current >= d:
        return {q: 0.0 for q in quantiles}

    t_grid = np.linspace(0.1, t_max, n_points)
    cdf = fpt_cdf(t_grid, x_current, mu, sigma, d)

    result: Dict[float, float] = {}
    for q in quantiles:
        idx = np.searchsorted(cdf, q)
        if idx >= len(t_grid):
            result[q] = float(t_max)
        elif idx == 0:
            result[q] = float(t_grid[0])
        else:
            t_lo, t_hi = t_grid[idx - 1], t_grid[idx]
            c_lo, c_hi = cdf[idx - 1], cdf[idx]
            if c_hi > c_lo:
                frac = (q - c_lo) / (c_hi - c_lo)
                result[q] = float(t_lo + frac * (t_hi - t_lo))
            else:
                result[q] = float(t_lo)
    return result


def bayesian_update_mu(
    mu_prior: float,
    tau_sq_prior: float,
    delta_hi_observations: np.ndarray,
    delta_wear_observations: np.ndarray,
    sigma_sq: float,
) -> Tuple[float, float]:
    """Conjugate Normal-Normal Bayesian update of machine-specific drift (notebook cell 20)."""
    prior_precision = 1.0 / tau_sq_prior
    data_precision = np.sum(delta_wear_observations) / sigma_sq
    data_sufficient_stat = np.sum(delta_hi_observations) / sigma_sq

    posterior_precision = prior_precision + data_precision
    mu_posterior = (mu_prior * prior_precision + data_sufficient_stat) / posterior_precision
    tau_sq_posterior = 1.0 / posterior_precision

    mu_posterior = max(mu_posterior, 1e-10)
    return mu_posterior, tau_sq_posterior


@dataclass
class MachineState:
    """
    Maintains the running Bayesian state for a single machine. Ported verbatim
    from notebook cell 21, parameterized by WienerParams instead of module-level
    globals so multiple machine types/priors can be served concurrently.
    """

    machine_id: str
    params: WienerParams
    mu: float = field(default=None)  # type: ignore[assignment]
    tau_sq: float = field(default=None)  # type: ignore[assignment]
    hi_history: List[float] = field(default_factory=list)
    wear_history: List[float] = field(default_factory=list)
    n_updates: int = 0

    def __post_init__(self) -> None:
        if self.mu is None:
            self.mu = self.params.mu_prior
        if self.tau_sq is None:
            self.tau_sq = self.params.tau_prior_sq

    def update(self, new_hi: float, new_wear: float) -> None:
        """Ingest a new (composite HI, tool wear) reading and update the drift posterior."""
        self.hi_history.append(new_hi)
        self.wear_history.append(new_wear)

        if len(self.hi_history) < 2:
            return

        delta_hi = np.array([self.hi_history[-1] - self.hi_history[-2]])
        delta_wear = np.array([self.wear_history[-1] - self.wear_history[-2]])

        if delta_wear[0] <= 0 or delta_hi[0] < 0:
            return

        self.mu, self.tau_sq = bayesian_update_mu(
            self.mu, self.tau_sq, delta_hi, delta_wear, self.params.sigma_sq
        )
        self.n_updates += 1

    def predict(self, quantiles: Tuple[float, ...] = (0.10, 0.50, 0.90)) -> Dict[str, object]:
        """Compute the current RUL distribution and supporting diagnostics."""
        current_hi = self.hi_history[-1] if self.hi_history else 0.0
        q_dict = rul_quantiles(current_hi, self.mu, self.params.sigma, self.params.d_threshold, quantiles)

        if self.n_updates < 5:
            regime = "prior-dominated"
        elif self.n_updates < 20:
            regime = "data-informed"
        else:
            regime = "machine-specific"

        return {
            "machine_id": self.machine_id,
            "current_hi": current_hi,
            "mu_posterior": self.mu,
            "tau_posterior": float(np.sqrt(self.tau_sq)),
            "n_updates": self.n_updates,
            "regime": regime,
            **{f"rul_p{int(q * 100)}": q_dict[q] for q in quantiles},
        }
