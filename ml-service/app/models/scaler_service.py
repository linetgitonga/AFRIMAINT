"""
Wraps the fitted StandardScaler + exact feature-column contract produced by
ml-service/scripts/fit_scaler.py, so a single live sensor reading can be turned
into the same feature vector shape the XGBoost pipeline and VAE were trained on.

A single reading only has one machine_type, so one-hot encoding it directly
produces just one Type_* column — reindex() below fills in the other Type_*
columns as 0 so the output always matches the full fitted column list.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

import joblib
import numpy as np
import pandas as pd

from app.models.feature_engineering import build_single_reading_frame, engineer_features


class ScalerService:
    def __init__(self) -> None:
        self.scaler = None
        self.feature_columns: Optional[list[str]] = None
        self.scaled_columns: Optional[list[str]] = None

    @property
    def is_loaded(self) -> bool:
        return self.scaler is not None

    def load(self, scaler_path: Path, columns_path: Path) -> None:
        self.scaler = joblib.load(scaler_path)
        with open(columns_path, "r", encoding="utf-8") as f:
            contract = json.load(f)
        self.feature_columns = contract["feature_columns"]
        self.scaled_columns = contract["scaled_columns"]

    def transform_reading(
        self,
        air_temperature: float,
        process_temperature: float,
        rotational_speed: float,
        torque: float,
        tool_wear: float,
        machine_type: str,
    ) -> np.ndarray:
        if self.scaler is None or self.feature_columns is None or self.scaled_columns is None:
            raise RuntimeError("Scaler/feature-column artifact not loaded")

        raw = build_single_reading_frame(
            air_temperature, process_temperature, rotational_speed, torque, tool_wear, machine_type
        )
        engineered = engineer_features(raw)
        engineered = engineered.reindex(columns=self.feature_columns, fill_value=0)

        engineered[self.scaled_columns] = self.scaler.transform(engineered[self.scaled_columns])

        # engineered is always exactly one row (a single live reading) — return a
        # flat 1D feature vector; callers reshape to 2D for a model call themselves.
        return engineered.to_numpy(dtype=np.float32)[0]
