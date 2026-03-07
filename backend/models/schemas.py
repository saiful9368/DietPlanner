from pydantic import BaseModel
from typing import Optional


class PrakritiInput(BaseModel):
    body_size: str
    body_weight: str
    height: str
    bone_structure: str
    complexion: str
    general_feel_of_skin: str
    texture_of_skin: str
    hair_color: str
    appearance_of_hair: str
    shape_of_face: str
    eyes: str
    eyelashes: str
    blinking_of_eyes: str
    cheeks: str
    nose: str
    teeth_and_gums: str
    lips: str
    nails: str
    appetite: str
    liking_tastes: str
    metabolism_type: str
    climate_preference: str
    stress_levels: str
    sleep_patterns: str
    dietary_habits: str
    physical_activity_level: str
    water_intake: str
    digestion_quality: str
    skin_sensitivity: str


class DoshaResult(BaseModel):
    dosha: str
    confidence: dict


class DietRequest(BaseModel):
    dosha: str
    is_vegetarian: bool = True
    meals_per_day: int = 3


class FoodItem(BaseModel):
    name: str
    rasa: str
    virya: str
    energy_kcal: float
    protein_g: float
    carbs_g: float
    fat_g: float
    category: str


class MealPlan(BaseModel):
    breakfast: list[FoodItem]
    lunch: list[FoodItem]
    dinner: list[FoodItem]
    snacks: list[FoodItem] = []


class NutrientItem(BaseModel):
    food_name: str
    quantity_grams: float


class NutrientRequest(BaseModel):
    items: list[NutrientItem]
    profile: str = "adult_male"


class NutrientTotals(BaseModel):
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    total_fiber: float
    total_calcium: float
    total_iron: float
    total_vitc: float
    total_folate: float
    rda_comparison: dict
    per_item: list[dict]
