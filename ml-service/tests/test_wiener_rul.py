"""
Unit tests for the ported Wiener RUL module. These verify the port is faithful
to the notebook's own cell 19-23 behavior and outputs, not against an external
artifact — this module needs none.
"""

import numpy as np
import pytest

from app.models.wiener_rul import (
    D_THRESHOLD,
    HI_THRESHOLD,
    MachineState,
    bayesian_update_mu,
    degradation_index,
    derive_wiener_params,
    fpt_cdf,
    rul_quantiles,
)


def test_derive_wiener_params_matches_notebook_weibull_fit():
    # beta=1.974, eta=187.70 are the notebook's own fitted Weibull params (cell 8).
    params = derive_wiener_params(beta_w=1.974, eta_w=187.70)

    assert params.beta_w == 1.974
    assert params.eta_w == 187.70
    assert params.mu_prior > 0
    assert params.sigma > 0
    assert params.d_threshold == D_THRESHOLD
    assert params.hi_threshold == HI_THRESHOLD
    # tau_prior_sq = (0.5 * mu_prior) ** 2, per cell 19 Step D.
    assert params.tau_prior_sq == pytest.approx((0.5 * params.mu_prior) ** 2)


def test_degradation_index_composite():
    # d = tool_wear/eta_w + hi/hi_threshold, per cell 19.
    d = degradation_index(tool_wear=93.85, hi=0.425, eta_w=187.70)
    expected = 93.85 / 187.70 + 0.425 / 0.85
    assert d == pytest.approx(expected)


def test_fpt_cdf_at_threshold_is_certain_failure():
    params = derive_wiener_params()
    t = np.array([1.0, 10.0, 100.0])
    cdf = fpt_cdf(t, x_current=D_THRESHOLD, mu=params.mu_prior, sigma=params.sigma, d=D_THRESHOLD)
    assert np.allclose(cdf, 1.0)


def test_fpt_cdf_beyond_threshold_is_certain_failure():
    params = derive_wiener_params()
    t = np.array([1.0, 10.0])
    cdf = fpt_cdf(t, x_current=D_THRESHOLD + 0.5, mu=params.mu_prior, sigma=params.sigma, d=D_THRESHOLD)
    assert np.allclose(cdf, 1.0)


def test_fpt_cdf_is_monotonically_nondecreasing_in_t():
    params = derive_wiener_params()
    t = np.linspace(0.1, 500, 200)
    cdf = fpt_cdf(t, x_current=0.5, mu=params.mu_prior, sigma=params.sigma, d=D_THRESHOLD)
    assert np.all(np.diff(cdf) >= -1e-9)


def test_rul_quantiles_ordering():
    params = derive_wiener_params()
    q = rul_quantiles(x_current=0.5, mu=params.mu_prior, sigma=params.sigma, d=D_THRESHOLD)
    # Pessimistic (p10) should require less time-to-failure than optimistic (p90).
    assert q[0.10] <= q[0.50] <= q[0.90]


def test_rul_quantiles_at_or_past_threshold_is_zero():
    params = derive_wiener_params()
    q = rul_quantiles(x_current=D_THRESHOLD, mu=params.mu_prior, sigma=params.sigma, d=D_THRESHOLD)
    assert all(v == 0.0 for v in q.values())


def test_bayesian_update_mu_moves_toward_data():
    params = derive_wiener_params()
    # Observations consistent with a much higher drift than the prior.
    delta_hi = np.array([0.05])
    delta_wear = np.array([5.0])
    mu_post, tau_sq_post = bayesian_update_mu(
        params.mu_prior, params.tau_prior_sq, delta_hi, delta_wear, params.sigma_sq
    )
    assert tau_sq_post < params.tau_prior_sq  # posterior should be more certain than prior
    assert mu_post > 0


def test_machine_state_converges_toward_true_drift():
    """Reproduces the notebook's own Bayesian-update demo (cell 23): a machine
    degrading at a known true drift should have its posterior mu converge toward
    that true value as more sequential readings arrive."""
    params = derive_wiener_params()
    mu_true = params.mu_prior * 1.3
    rng = np.random.default_rng(42)

    state = MachineState(machine_id="demo", params=params, mu=params.mu_prior * 0.8)
    current_d = 0.3
    current_wear = 60.0
    state.update(current_d, current_wear)

    initial_gap = abs(state.mu - mu_true)

    for _ in range(60):
        wear_step = 5
        delta_d_true = max(0.0, mu_true * wear_step + params.sigma * np.sqrt(wear_step) * rng.standard_normal())
        current_d = min(current_d + delta_d_true, D_THRESHOLD)
        current_wear += wear_step
        state.update(current_d, current_wear)
        if current_d >= D_THRESHOLD:
            break

    final_gap = abs(state.mu - mu_true)
    assert final_gap < initial_gap
    assert state.n_updates >= 5


def test_machine_state_regime_labels():
    params = derive_wiener_params()
    state = MachineState(machine_id="m1", params=params)

    state.update(0.1, 10.0)
    pred = state.predict()
    assert pred["regime"] == "prior-dominated"
    assert pred["n_updates"] == 0  # first reading never triggers a Bayesian update

    for i in range(1, 6):
        state.update(0.1 + i * 0.05, 10.0 + i * 5)
    pred = state.predict()
    assert pred["n_updates"] == 5
    assert pred["regime"] == "data-informed"
