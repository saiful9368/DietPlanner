from fastapi import APIRouter
from backend.models.schemas import PrakritiInput, DoshaResult
from backend.services.dosha_predictor import predict_dosha

router = APIRouter()


@router.post("/predict-dosha", response_model=DoshaResult)
def predict(data: PrakritiInput):
    result = predict_dosha(data.model_dump())
    return result
