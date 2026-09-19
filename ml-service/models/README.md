# Model artifacts

This service loads trained artifacts from this folder at startup. It starts and
serves `/health` and `/rul` fine without any of them — `/predict` and
`/synthesize` return `503` until the relevant files exist.

## Already present (generated, not trained)

- `ai4i_scaler.pkl`, `ai4i_feature_columns.json` — produced by
  `scripts/fit_scaler.py` against the public AI4I 2020 dataset, replicating the
  notebook's exact feature-engineering + `StandardScaler` fit (notebook cell 11).
  These don't depend on the trained classifier/VAE, so they're generated and
  committed here rather than waiting on a handoff.

## Needed from you (trained in the notebook)

### `ai4i_xgb.pkl`

From notebook **CELL 7**, exactly as it already saves:

```python
joblib.dump({'pipeline': pipe_ai4i, 'threshold': best_thresh_ai4i},
            f'{BASE}/models/phase1/ai4i_xgb.pkl')
```

Copy that file here as `ai4i_xgb.pkl`. No changes needed — the notebook already
saves the right shape (`{'pipeline', 'threshold'}`).

### `vae_ai4i.pt`

From notebook **CELL 10**, exactly as it already saves the best checkpoint:

```python
torch.save({'state': vae_ai.state_dict(), 'xmin': xmin_ai, 'xmax': xmax_ai,
            'beta': ai4i_beta, 'eta': ai4i_eta}, CKPT_AI4I)
```

Copy that file here as `vae_ai4i.pt`. Also unchanged from what the notebook saves.

## Why the scaler isn't in `ai4i_xgb.pkl`

The notebook fits `StandardScaler` in cell 11 but only saves the SMOTE+XGBoost
pipeline in cell 13 — the scaler itself is never persisted there. Scoring a new
raw sensor reading requires the *same* fitted scaler the training data used, so
this service ships its own copy (`ai4i_scaler.pkl`), fit identically against the
same public dataset — see `scripts/fit_scaler.py`.
