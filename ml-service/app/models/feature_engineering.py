"""
AI4I 2020 feature engineering, ported from AfriSwarm_A141_Colab2.ipynb "CELL 6 —
Feature Engineering: AI4I". This transform is deterministic and dataset-public, so
unlike the trained classifier/VAE it doesn't depend on an artifact the user needs
to hand over — it's fully implemented and fit here.

IMPORTANT: this must produce the exact same column set/order the notebook's
ai4i_processed.csv had when the XGBoost pipeline and VAE were trained, or their
predictions will be silently wrong. See ml-service/scripts/fit_scaler.py, which
runs this transform against the real AI4I dataset and was used to verify the
column list empirically rather than by inspection alone.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

RAW_COLUMNS_TO_DROP = ["UDI", "Product ID"]
SUB_FAULT_COLUMNS = ["TWF", "HDF", "PWF", "OSF", "RNF"]
TARGET_COLUMN_CANDIDATES = ["Machine failure"]


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Mirrors notebook cell 11 exactly: drop ID columns, one-hot encode Type,
    drop sub-fault flag columns, and add the five physics-informed interaction
    features. Does NOT scale — scaling is a separate, fitted step (see
    ml-service/models/ai4i_scaler.pkl once produced by fit_scaler.py).
    """
    df = df.copy()

    drop_cols = [c for c in df.columns if c in RAW_COLUMNS_TO_DROP or c.lower() in ("udi", "product id")]
    df = df.drop(columns=drop_cols, errors="ignore")

    type_cols = [c for c in df.columns if c.lower() == "type"]
    if type_cols:
        df = pd.get_dummies(df, columns=type_cols, drop_first=False)

    speed_col = next((c for c in df.columns if "rotational" in c.lower() or "speed" in c.lower()), None)
    torque_col = next((c for c in df.columns if "torque" in c.lower()), None)
    air_col = next((c for c in df.columns if "air" in c.lower() and "temp" in c.lower()), None)
    proc_col = next((c for c in df.columns if "process" in c.lower() and "temp" in c.lower()), None)
    wear_col = next((c for c in df.columns if "tool wear" in c.lower() or "tool_wear" in c.lower()), None)

    if speed_col and torque_col:
        df["power_W"] = df[torque_col] * df[speed_col] * (2 * np.pi / 60)
    if air_col and proc_col:
        df["temp_delta"] = df[proc_col] - df[air_col]
    if wear_col and torque_col:
        df["wear_torque"] = df[wear_col] * df[torque_col]
    if wear_col and speed_col:
        df["wear_speed"] = df[wear_col] * df[speed_col]
    if speed_col and torque_col and wear_col:
        df["power_x_wear"] = df["power_W"] * df[wear_col]

    sub_fault_present = [c for c in SUB_FAULT_COLUMNS if c in df.columns]
    df = df.drop(columns=sub_fault_present, errors="ignore")

    return df


def build_single_reading_frame(
    air_temperature: float,
    process_temperature: float,
    rotational_speed: float,
    torque: float,
    tool_wear: float,
    machine_type: str,
) -> pd.DataFrame:
    """
    Builds a one-row raw-column DataFrame for a live reading. Column names must
    exactly match what ucimlrepo.fetch_ucirepo(id=601) actually returns — verified
    empirically via scripts/fit_scaler.py, which is NOT "Air temperature [K]" as
    the AI4I documentation page shows the columns, but plain "Air temperature"
    (ucimlrepo strips the bracketed units). Getting this wrong doesn't raise an
    error — engineer_features()'s substring-based column detection still matches
    either way — but scaler_service.py's reindex() against the fitted
    feature_columns contract would then silently zero-fill every real sensor
    value, so mismatch here is far worse than a crash.
    """
    return pd.DataFrame(
        [
            {
                "Type": machine_type,
                "Air temperature": air_temperature,
                "Process temperature": process_temperature,
                "Rotational speed": rotational_speed,
                "Torque": torque,
                "Tool wear": tool_wear,
            }
        ]
    )
