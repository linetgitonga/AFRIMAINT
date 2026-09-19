"""
AfriMaint ML service. Serves the notebook's trained models (once artifacts are
placed under ml-service/models/ — see models/README.md) plus the fully self-
contained Wiener-process RUL estimator, which needs no trained artifact and no
optional dependency.

Endpoints degrade gracefully: /health reports what's loaded, and /predict or
/synthesize return 503 rather than crashing — both for a missing artifact file
*and* for torch not being installed at all (it's only needed for the VAE; /rul
and /health must keep working without it, so that import is deferred to
lifespan startup instead of module load, and guarded).
"""

from contextlib import asynccontextmanager
from typing import TYPE_CHECKING, Optional

from fastapi import FastAPI, HTTPException

from app import config
from app.models.scaler_service import ScalerService
from app.models.wiener_rul import MachineState, degradation_index, derive_wiener_params
from app.models.xgb_classifier import XgbClassifierService
from app.schemas import (
    HealthResponse,
    PredictRequest,
    PredictResponse,
    RulRequest,
    RulResponse,
    SynthesizeRequest,
    SynthesizeResponse,
)

if TYPE_CHECKING:
    from app.models.weibull_vae import WeibullVaeService

xgb_service = XgbClassifierService()
scaler_service = ScalerService()
vae_service: Optional["WeibullVaeService"] = None
vae_import_error: Optional[str] = None

WIENER_PARAMS = derive_wiener_params()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    global vae_service, vae_import_error

    if config.SCALER_PATH.exists() and config.FEATURE_COLUMNS_PATH.exists():
        scaler_service.load(config.SCALER_PATH, config.FEATURE_COLUMNS_PATH)

    if config.XGB_CLASSIFIER_PATH.exists():
        xgb_service.load(config.XGB_CLASSIFIER_PATH)

    if config.WEIBULL_VAE_PATH.exists() and scaler_service.feature_columns:
        try:
            from app.models.weibull_vae import WeibullVaeService

            vae_service = WeibullVaeService(input_dim=len(scaler_service.feature_columns))
            vae_service.load(config.WEIBULL_VAE_PATH)
        except ImportError as exc:
            # torch not installed — /rul and /predict still work fine without it.
            vae_import_error = str(exc)

    yield


app = FastAPI(title="AfriMaint ML Service", lifespan=lifespan)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        xgb_classifier_loaded=xgb_service.is_loaded,
        weibull_vae_loaded=vae_service is not None and vae_service.is_loaded,
        scaler_loaded=scaler_service.is_loaded,
    )


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest) -> PredictResponse:
    if not scaler_service.is_loaded:
        raise HTTPException(503, "Feature scaler not loaded — run scripts/fit_scaler.py first")
    if not xgb_service.is_loaded:
        raise HTTPException(
            503, "XGBoost classifier artifact not found at ml-service/models/ai4i_xgb.pkl — see models/README.md"
        )

    reading = request.reading
    features = scaler_service.transform_reading(
        air_temperature=reading.air_temperature,
        process_temperature=reading.process_temperature,
        rotational_speed=reading.rotational_speed,
        torque=reading.torque,
        tool_wear=reading.tool_wear,
        machine_type=reading.machine_type,
    )
    proba = xgb_service.predict_proba(features.reshape(1, -1))[0]

    return PredictResponse(
        machine_id=request.machine_id,
        failure_probability=float(proba),
        threshold=xgb_service.threshold or 0.5,
    )


@app.post("/rul", response_model=RulResponse)
def rul(request: RulRequest) -> RulResponse:
    state = MachineState(machine_id=request.machine_id, params=WIENER_PARAMS)

    # Replay history so the Bayesian posterior reflects prior readings, then the
    # current one — each call is stateless server-side, the caller supplies history.
    for point in request.history:
        d_idx = degradation_index(point.tool_wear, point.health_indicator, WIENER_PARAMS.eta_w)
        state.update(new_hi=d_idx, new_wear=point.tool_wear)

    current_d = degradation_index(request.tool_wear, request.health_indicator, WIENER_PARAMS.eta_w)
    state.update(new_hi=current_d, new_wear=request.tool_wear)

    prediction = state.predict()

    return RulResponse(
        machine_id=request.machine_id,
        current_degradation_index=prediction["current_hi"],
        mu_posterior=prediction["mu_posterior"],
        tau_posterior=prediction["tau_posterior"],
        n_updates=prediction["n_updates"],
        regime=prediction["regime"],
        rul_p10_wear_minutes=prediction["rul_p10"],
        rul_p50_wear_minutes=prediction["rul_p50"],
        rul_p90_wear_minutes=prediction["rul_p90"],
    )


@app.post("/synthesize", response_model=SynthesizeResponse)
def synthesize(request: SynthesizeRequest) -> SynthesizeResponse:
    if vae_import_error:
        raise HTTPException(503, f"torch is not installed — cannot serve the VAE ({vae_import_error})")
    if vae_service is None or not vae_service.is_loaded:
        raise HTTPException(
            503, "Weibull-VAE artifact not found at ml-service/models/vae_ai4i.pt — see models/README.md"
        )

    samples = vae_service.synthesize(request.n_samples)

    return SynthesizeResponse(
        n_samples=request.n_samples,
        samples=samples.tolist(),
        feature_columns=scaler_service.feature_columns or [],
    )
