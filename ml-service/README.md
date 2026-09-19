# AfriMaint ML Service

FastAPI service serving the models trained in `AfriSwarm_A141_Colab2.ipynb`. Training
stays in the notebook (Colab) — this service only serves trained artifacts. See
`models/README.md` for exactly what to hand off and why.

## What works without any trained artifact

- `GET /health` — reports what's loaded.
- `POST /rul` — the Wiener-process RUL estimator. Pure math over the notebook's
  fitted Weibull parameters (`app/models/wiener_rul.py`), fully implemented and
  unit-tested (`tests/test_wiener_rul.py`) — no external file needed.

## What needs artifacts (see `models/README.md`)

- `POST /predict` — needs `models/ai4i_xgb.pkl` (from notebook CELL 7). Returns
  `503` until it's present.
- `POST /synthesize` — needs `models/vae_ai4i.pt` (from notebook CELL 10). Returns
  `503` until it's present.

The feature scaler both of these depend on (`models/ai4i_scaler.pkl` +
`models/ai4i_feature_columns.json`) is already generated — see below.

## Local setup

```bash
python -m venv venv
venv/Scripts/activate        # or: source venv/bin/activate on macOS/Linux
pip install -r requirements.txt

# One-time: fit the feature scaler against the public AI4I dataset (already run
# once and committed to models/, but re-run if feature_engineering.py changes).
pip install -r scripts/requirements-dev.txt
python scripts/fit_scaler.py

uvicorn app.main:app --reload
```

## Tests

```bash
pip install -r scripts/requirements-dev.txt
pytest
```
