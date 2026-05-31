from __future__ import annotations

import io
import logging
from pathlib import Path
from typing import Any

import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image, UnidentifiedImageError

try:
    from tensorflow.keras.models import load_model
except Exception:  # pragma: no cover - import error is handled at runtime
    load_model = None


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cropsense")

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "cropsense_mobilenetv2.keras"
CLASS_NAMES_PATH = BASE_DIR / "model" / "class_names.txt"
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
IMAGE_SIZE = (224, 224)


TREATMENT_SUGGESTIONS = {
    "bacterial blight": (
        "Remove infected plant debris, avoid excessive nitrogen, improve field drainage, "
        "and apply a recommended bactericide only if advised by local agronomists."
    ),
    "blast": (
        "Use resistant varieties, maintain balanced fertilization, avoid dense planting, "
        "and apply a fungicide program when conditions favor blast outbreaks."
    ),
    "brown spot": (
        "Improve soil fertility, ensure adequate potassium and silica, use clean seed, "
        "and consider a fungicide if disease pressure is high."
    ),
    "tungro": (
        "Rogue infected plants quickly, control rice green leafhopper vectors, use resistant "
        "varieties, and avoid planting in heavily affected fields."
    ),
}


def normalize_label(label: str) -> str:
    return " ".join(label.replace("_", " ").replace("-", " ").split()).strip().lower()


def prettify_label(label: str) -> str:
    normalized = normalize_label(label)
    known = {
        "bacterialblight": "Bacterial blight",
        "brownspot": "Brown Spot",
        "blast": "Blast",
        "tungro": "Tungro",
    }
    return known.get(normalized.replace(" ", ""), normalized.title())


def load_class_names(path: Path) -> list[str]:
    if not path.exists():
        raise FileNotFoundError(f"Class names file not found: {path}")

    class_names = [line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    if not class_names:
        raise ValueError(f"Class names file is empty: {path}")
    return class_names


def load_prediction_model(path: Path):
    if load_model is None:
        raise RuntimeError("TensorFlow is not installed or could not be imported.")
    if not path.exists():
        raise FileNotFoundError(f"Model file not found: {path}")
    return load_model(path)


def build_treatment(label: str) -> str:
    normalized = normalize_label(label)
    lookup_key = normalized.replace(" ", "")
    return TREATMENT_SUGGESTIONS.get(
        normalized,
        {
            "bacterialblight": TREATMENT_SUGGESTIONS["bacterial blight"],
            "brownspot": TREATMENT_SUGGESTIONS["brown spot"],
            "blast": TREATMENT_SUGGESTIONS["blast"],
            "tungro": TREATMENT_SUGGESTIONS["tungro"],
        }.get(
            lookup_key,
            "Consult a local plant pathologist or agronomist for a field-specific treatment plan.",
        ),
    )


def prepare_image(image_bytes: bytes) -> np.ndarray:
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.") from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Unable to process the uploaded image.") from exc

    image = image.resize(IMAGE_SIZE)
    array = np.asarray(image, dtype=np.float32) / 255.0
    return np.expand_dims(array, axis=0)


def try_load_assets() -> dict[str, Any]:
    assets: dict[str, Any] = {"model": None, "class_names": [], "load_error": None}
    try:
        assets["class_names"] = load_class_names(CLASS_NAMES_PATH)
        assets["model"] = load_prediction_model(MODEL_PATH)
        logger.info("Loaded model and %d class names.", len(assets["class_names"]))
    except Exception as exc:
        assets["load_error"] = str(exc)
        logger.exception("Failed to load ML assets")
    return assets


app = FastAPI(title="CropSense ML API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

assets = try_load_assets()


@app.get("/")
def healthcheck() -> dict[str, Any]:
    class_names = assets["class_names"]
    return {
        "status": "ready" if assets["model"] is not None and not assets["load_error"] else "degraded",
        "message": "CropSense ML API is running.",
        "model_loaded": assets["model"] is not None,
        "class_names": [prettify_label(name) for name in class_names],
        "load_error": assets["load_error"],
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> JSONResponse:
    if assets["load_error"]:
        raise HTTPException(status_code=503, detail=f"Model assets unavailable: {assets['load_error']}")
    if assets["model"] is None or not assets["class_names"]:
        raise HTTPException(status_code=503, detail="Prediction service is unavailable.")

    if not file.content_type or file.content_type.lower() not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Please upload a valid JPG, PNG, or WEBP image.")

    try:
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Uploaded image is empty.")

        prepared = prepare_image(image_bytes)
        raw_predictions = assets["model"].predict(prepared, verbose=0)
        probabilities = np.array(raw_predictions[0], dtype=np.float32)
        probabilities = probabilities / probabilities.sum() if probabilities.sum() else probabilities

        class_names = assets["class_names"]
        if probabilities.shape[0] != len(class_names):
            raise RuntimeError(
                f"Model output size {probabilities.shape[0]} does not match {len(class_names)} class names."
            )

        top_index = int(np.argmax(probabilities))
        top_class = prettify_label(class_names[top_index])
        confidence = float(probabilities[top_index])

        probability_breakdown = [
            {
                "class_name": prettify_label(class_name),
                "raw_class_name": class_name,
                "probability": float(probability),
            }
            for class_name, probability in zip(class_names, probabilities, strict=True)
        ]

        return JSONResponse(
            content={
                "prediction": top_class,
                "confidence": confidence,
                "treatment_suggestion": build_treatment(top_class),
                "probabilities": probability_breakdown,
            }
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc


@app.exception_handler(HTTPException)
def http_exception_handler(_: Any, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})