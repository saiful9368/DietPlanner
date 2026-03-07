import joblib
import numpy as np
import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

model = joblib.load(DATA_DIR / "dosha_model.pkl")
label_encoder = joblib.load(DATA_DIR / "dosha_encoder.pkl")
feature_encoder = joblib.load(DATA_DIR / "dosha_feature_encoder.pkl")

FEATURE_COLS = [
    "Body Size", "Body Weight", "Height", "Bone Structure", "Complexion",
    "General feel of skin", "Texture of Skin", "Hair Color",
    "Appearance of Hair", "Shape of face", "Eyes", "Eyelashes",
    "Blinking of Eyes", "Cheeks", "Nose", "Teeth and gums", "Lips",
    "Nails", "Appetite", "Liking tastes", "Metabolism Type",
    "Climate Preference", "Stress Levels", "Sleep Patterns",
    "Dietary Habits", "Physical Activity Level", "Water Intake",
    "Digestion Quality", "Skin Sensitivity",
]

# Map frontend field names to training feature names
FIELD_MAP = {
    "body_size": "Body Size",
    "body_weight": "Body Weight",
    "height": "Height",
    "bone_structure": "Bone Structure",
    "complexion": "Complexion",
    "general_feel_of_skin": "General feel of skin",
    "texture_of_skin": "Texture of Skin",
    "hair_color": "Hair Color",
    "appearance_of_hair": "Appearance of Hair",
    "shape_of_face": "Shape of face",
    "eyes": "Eyes",
    "eyelashes": "Eyelashes",
    "blinking_of_eyes": "Blinking of Eyes",
    "cheeks": "Cheeks",
    "nose": "Nose",
    "teeth_and_gums": "Teeth and gums",
    "lips": "Lips",
    "nails": "Nails",
    "appetite": "Appetite",
    "liking_tastes": "Liking tastes",
    "metabolism_type": "Metabolism Type",
    "climate_preference": "Climate Preference",
    "stress_levels": "Stress Levels",
    "sleep_patterns": "Sleep Patterns",
    "dietary_habits": "Dietary Habits",
    "physical_activity_level": "Physical Activity Level",
    "water_intake": "Water Intake",
    "digestion_quality": "Digestion Quality",
    "skin_sensitivity": "Skin Sensitivity",
}


def predict_dosha(patient_dict: dict) -> dict:
    """Predict dosha from 29 patient features."""
    mapped = {FIELD_MAP[k]: v for k, v in patient_dict.items()}
    df = pd.DataFrame([mapped])
    encoded = feature_encoder.transform(df[FEATURE_COLS].astype(str))
    pred = model.predict(encoded)
    proba = model.predict_proba(encoded)[0]
    dosha = label_encoder.inverse_transform(pred)[0]
    confidence = dict(zip(label_encoder.classes_.tolist(), proba.round(3).tolist()))
    return {"dosha": dosha, "confidence": confidence}
