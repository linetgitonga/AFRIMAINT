"""Artifact paths — all relative to ml-service/models/, overridable via env vars
so Docker/production deployments can mount artifacts wherever is convenient."""

import os
from pathlib import Path

MODELS_DIR = Path(os.environ.get("MODELS_DIR", Path(__file__).resolve().parent.parent / "models"))

XGB_CLASSIFIER_PATH = MODELS_DIR / os.environ.get("XGB_CLASSIFIER_FILENAME", "ai4i_xgb.pkl")
WEIBULL_VAE_PATH = MODELS_DIR / os.environ.get("WEIBULL_VAE_FILENAME", "vae_ai4i.pt")
SCALER_PATH = MODELS_DIR / os.environ.get("SCALER_FILENAME", "ai4i_scaler.pkl")
FEATURE_COLUMNS_PATH = MODELS_DIR / os.environ.get("FEATURE_COLUMNS_FILENAME", "ai4i_feature_columns.json")
