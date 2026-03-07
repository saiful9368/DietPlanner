from fastapi import APIRouter
from backend.models.schemas import NutrientRequest, NutrientTotals
from backend.services.nutrient_analyser import analyse_nutrients

router = APIRouter()


@router.post("/analyse-nutrients", response_model=NutrientTotals)
def analyse(data: NutrientRequest):
    items = [{"food_name": i.food_name, "quantity_grams": i.quantity_grams} for i in data.items]
    result = analyse_nutrients(items, data.profile)
    return result
