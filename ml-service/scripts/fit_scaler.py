"""
One-time script: downloads the public AI4I 2020 dataset (same source as the
notebook, ucimlrepo id=601), applies the exact feature-engineering transform
from app/models/feature_engineering.py, and fits+saves the StandardScaler +
feature-column contract that app/models/scaler_service.py loads at runtime.

This does NOT train the classifier or VAE — those stay in the notebook (see
ml-service/models/README.md for the handoff). Re-run this only if the notebook's
feature-engineering cell (CELL 6) changes.

Usage: python scripts/fit_scaler.py
Requires: pip install -r requirements.txt -r scripts/requirements-dev.txt
"""

import json
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from ucimlrepo import fetch_ucirepo

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app.models.feature_engineering import engineer_features  # noqa: E402

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"


def main() -> None:
    print("Downloading AI4I 2020 from UCI ML Repo (id=601)...")
    ai4i_repo = fetch_ucirepo(id=601)
    ai4i_df = pd.concat([ai4i_repo.data.features, ai4i_repo.data.targets], axis=1)
    print(f"Raw shape: {ai4i_df.shape}, columns: {list(ai4i_df.columns)}")

    target_candidates = [c for c in ai4i_df.columns if "machine failure" in c.lower() or c.lower() == "machine_failure"]
    if not target_candidates:
        target_candidates = [c for c in ai4i_df.columns if "failure" in c.lower() and ai4i_df[c].nunique() == 2]
    target_col = target_candidates[0]
    print(f"Target column: {target_col}")

    engineered = engineer_features(ai4i_df.drop(columns=[target_col]))
    print(f"Engineered shape: {engineered.shape}")
    print(f"Engineered columns: {list(engineered.columns)}")
    print(f"Dtypes:\n{engineered.dtypes}")

    num_cols = engineered.select_dtypes(include=np.number).columns.tolist()
    print(f"\nNumeric columns selected for scaling ({len(num_cols)}): {num_cols}")
    non_numeric = [c for c in engineered.columns if c not in num_cols]
    if non_numeric:
        print(f"Non-numeric columns left unscaled ({len(non_numeric)}): {non_numeric}")

    scaler = StandardScaler()
    scaler.fit(engineered[num_cols])

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(scaler, MODELS_DIR / "ai4i_scaler.pkl")

    contract = {
        "feature_columns": list(engineered.columns),
        "scaled_columns": num_cols,
    }
    with open(MODELS_DIR / "ai4i_feature_columns.json", "w", encoding="utf-8") as f:
        json.dump(contract, f, indent=2)

    print(f"\nSaved {MODELS_DIR / 'ai4i_scaler.pkl'}")
    print(f"Saved {MODELS_DIR / 'ai4i_feature_columns.json'}")


if __name__ == "__main__":
    main()
