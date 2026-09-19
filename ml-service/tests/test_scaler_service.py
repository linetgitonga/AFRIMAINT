"""
Regression test for the exact bug found while empirically fitting the scaler:
build_single_reading_frame() originally used bracketed-unit column names
("Air temperature [K]") that don't match what ucimlrepo actually returns
("Air temperature"), which reindex() in transform_reading() would silently
zero-fill instead of erroring on. This asserts a live reading's real values
survive the transform rather than collapsing to the fitted per-column means
(which is what a zero-filled-then-scaled column looks like).
"""

from pathlib import Path

import numpy as np
import pytest

from app.models.scaler_service import ScalerService

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"


@pytest.fixture
def loaded_scaler() -> ScalerService:
    service = ScalerService()
    scaler_path = MODELS_DIR / "ai4i_scaler.pkl"
    columns_path = MODELS_DIR / "ai4i_feature_columns.json"
    if not scaler_path.exists() or not columns_path.exists():
        pytest.skip("Run scripts/fit_scaler.py first")
    service.load(scaler_path, columns_path)
    return service


def test_feature_columns_have_no_bracketed_units(loaded_scaler: ScalerService):
    # Locks in the exact bug found: ucimlrepo's real columns are "Air
    # temperature", not "Air temperature [K]".
    assert "Air temperature" in loaded_scaler.feature_columns
    assert "Air temperature [K]" not in loaded_scaler.feature_columns


def test_transform_reading_produces_correct_shape(loaded_scaler: ScalerService):
    features = loaded_scaler.transform_reading(
        air_temperature=298.1,
        process_temperature=308.6,
        rotational_speed=1551,
        torque=42.8,
        tool_wear=0,
        machine_type="M",
    )
    assert features.shape == (len(loaded_scaler.feature_columns),)


def test_transform_reading_one_hot_is_correct_and_exclusive(loaded_scaler: ScalerService):
    cols = loaded_scaler.feature_columns
    idx_h, idx_l, idx_m = cols.index("Type_H"), cols.index("Type_L"), cols.index("Type_M")

    features = loaded_scaler.transform_reading(
        air_temperature=298.1,
        process_temperature=308.6,
        rotational_speed=1551,
        torque=42.8,
        tool_wear=0,
        machine_type="M",
    )
    assert features[idx_m] == 1
    assert features[idx_h] == 0
    assert features[idx_l] == 0


def test_transform_reading_two_different_readings_are_not_identical(loaded_scaler: ScalerService):
    """The bug under test: with the wrong column names, every reading reindexes
    to all-zero raw values before scaling, so any two different readings would
    produce IDENTICAL output (both collapsing to -mean/std). Two readings with
    very different sensor values must produce different feature vectors."""
    low_wear = loaded_scaler.transform_reading(
        air_temperature=298, process_temperature=308, rotational_speed=1400, torque=30, tool_wear=5, machine_type="L"
    )
    high_wear = loaded_scaler.transform_reading(
        air_temperature=303,
        process_temperature=313,
        rotational_speed=1800,
        torque=60,
        tool_wear=220,
        machine_type="H",
    )
    assert not np.allclose(low_wear, high_wear)

    tool_wear_idx = loaded_scaler.feature_columns.index("Tool wear")
    # Higher raw tool_wear must scale to a higher standardized value than lower.
    assert high_wear[tool_wear_idx] > low_wear[tool_wear_idx]
