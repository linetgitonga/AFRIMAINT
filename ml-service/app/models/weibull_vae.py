"""
Weibull-VAE: conditional variational autoencoder for synthetic failure-trajectory
generation. Architecture ported verbatim from AfriSwarm_A141_Colab2.ipynb, "CELL 9 —
Weibull-VAE Architecture".

Per the implementation plan's Phase 4 honesty table: the notebook's own TSTR
(train-on-synthetic, test-on-real) evaluation found a 0.125 F1 gap against the
real-data classifier (its own bar was <=0.05), so this model is for
augmentation/visualization only — never presented as a standalone training substitute.
The conditional cold-start variant (CVAE) is NOT ported here: the notebook's own
ablation showed it performs worse than this unconditioned VAE (Frechet Distance
0.064 vs 0.031, TSTR F1 0.301 vs 0.806), so shipping it would contradict the
concept note's cold-start claim rather than support it.
"""

from pathlib import Path
from typing import Optional

import numpy as np
import torch
import torch.nn as nn


class WeibullVAE(nn.Module):
    """Verbatim port of the notebook's WeibullVAE nn.Module (CELL 9)."""

    def __init__(self, input_dim: int, latent_dim: int = 32, hidden: int = 256):
        super().__init__()
        self.latent_dim = latent_dim
        self.enc = nn.Sequential(
            nn.Linear(input_dim, hidden),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(hidden, hidden // 2),
            nn.ReLU(),
        )
        self.fc_mu = nn.Linear(hidden // 2, latent_dim)
        self.fc_logsd = nn.Linear(hidden // 2, latent_dim)
        self.dec = nn.Sequential(
            nn.Linear(latent_dim + 2, hidden // 2),
            nn.ReLU(),
            nn.Linear(hidden // 2, hidden),
            nn.ReLU(),
            nn.Linear(hidden, input_dim),
            nn.Sigmoid(),
        )

    def encode(self, x: torch.Tensor):
        h = self.enc(x)
        return self.fc_mu(h), self.fc_logsd(h)

    def reparameterise(self, mu: torch.Tensor, ls: torch.Tensor) -> torch.Tensor:
        return mu + torch.randn_like(mu) * torch.exp(0.5 * ls)

    def decode(self, z: torch.Tensor, beta: torch.Tensor, eta: torch.Tensor) -> torch.Tensor:
        return self.dec(torch.cat([z, beta.unsqueeze(1), eta.unsqueeze(1)], dim=1))

    def forward(self, x: torch.Tensor, beta: torch.Tensor, eta: torch.Tensor):
        mu, ls = self.encode(x)
        z = self.reparameterise(mu, ls)
        return self.decode(z, beta, eta), mu, ls


class WeibullVaeService:
    """
    Loads a checkpoint produced by the notebook's CELL 10 (torch.save({'state':
    ..., 'xmin':, 'xmax':, 'beta':, 'eta':}, ...)) and serves the decode-only
    synthesis path from CELL 11. Not loaded until a checkpoint file exists at the
    configured path — see ml-service/models/README.md for the handoff contract.
    """

    def __init__(self, input_dim: int, latent_dim: int = 32, hidden: int = 256):
        self.input_dim = input_dim
        self.latent_dim = latent_dim
        self.hidden = hidden
        self.model: Optional[WeibullVAE] = None
        self.xmin: Optional[torch.Tensor] = None
        self.xmax: Optional[torch.Tensor] = None
        self.beta: Optional[float] = None
        self.eta: Optional[float] = None

    @property
    def is_loaded(self) -> bool:
        return self.model is not None

    def load(self, checkpoint_path: Path) -> None:
        checkpoint = torch.load(checkpoint_path, map_location="cpu", weights_only=False)
        model = WeibullVAE(self.input_dim, latent_dim=self.latent_dim, hidden=self.hidden)
        model.load_state_dict(checkpoint["state"])
        model.eval()

        self.model = model
        self.xmin = torch.as_tensor(checkpoint["xmin"], dtype=torch.float32)
        self.xmax = torch.as_tensor(checkpoint["xmax"], dtype=torch.float32)
        self.beta = float(checkpoint["beta"])
        self.eta = float(checkpoint["eta"])

    def synthesize(self, n_samples: int) -> np.ndarray:
        if self.model is None or self.xmin is None or self.xmax is None:
            raise RuntimeError("WeibullVAE checkpoint not loaded")

        with torch.no_grad():
            z = torch.randn(n_samples, self.latent_dim)
            beta_t = torch.full((n_samples,), self.beta, dtype=torch.float32)
            eta_t = torch.full((n_samples,), self.eta, dtype=torch.float32)
            out = self.model.decode(z, beta_t, eta_t)
            out = out * (self.xmax - self.xmin + 1e-9) + self.xmin

        return out.cpu().numpy()
