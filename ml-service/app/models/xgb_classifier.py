"""
XGBoost + SMOTE failure classifier. Loads the artifact produced by the notebook's
"CELL 7 — Phase 1 Baseline: XGBoost" (joblib.dump({'pipeline': pipe_ai4i,
'threshold': best_thresh_ai4i}, ...)).

Note: SMOTE only resamples the *training* set inside the imblearn Pipeline — at
inference time pipeline.predict_proba() simply runs the fitted XGBClassifier step,
so loading and scoring with the saved pipeline directly is correct and matches
what the notebook itself reported (F1 = 0.8599 at threshold 0.93 on AI4I 2020).

Unpickling this artifact requires imbalanced-learn and xgboost to be importable
(joblib needs the same classes available to reconstruct the Pipeline object).
"""

from pathlib import Path
from typing import Optional

import joblib
import numpy as np


class XgbClassifierService:
    def __init__(self) -> None:
        self.pipeline = None
        self.threshold: Optional[float] = None

    @property
    def is_loaded(self) -> bool:
        return self.pipeline is not None

    def load(self, artifact_path: Path) -> None:
        artifact = joblib.load(artifact_path)
        self.pipeline = artifact["pipeline"]
        self.threshold = float(artifact["threshold"])

    def predict_proba(self, features: np.ndarray) -> np.ndarray:
        """features: 2D array, already engineered + scaled (see feature_engineering.py)."""
        if self.pipeline is None:
            raise RuntimeError("XGBoost classifier artifact not loaded")
        return self.pipeline.predict_proba(features)[:, 1]
