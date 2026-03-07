from fastapi import APIRouter
from backend.models.schemas import DietRequest, MealPlan
from backend.services.diet_chart import generate_diet

router = APIRouter()


@router.post("/generate-diet", response_model=MealPlan)
def generate(data: DietRequest):
    result = generate_diet(data.dosha, data.is_vegetarian, data.meals_per_day)
    return result
