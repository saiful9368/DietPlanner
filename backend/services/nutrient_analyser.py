import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

_food_db = pd.read_csv(DATA_DIR / "master_food_db.csv")
_food_db = _food_db.loc[:, ~_food_db.columns.duplicated()]

# Build a lookup by lowercase name
_food_db["_lookup_name"] = _food_db["name"].str.lower().str.strip()

NUTRIENT_COLS = {
    "energy_kcal": "energy_kcal",
    "protein_g": "protein_g",
    "carbs_g": "carbs_g",
    "fat_g": "fat_g",
    "fiber_g": "fiber_g",
    "calcium_mg": "calcium_mg",
    "iron_mg": "iron_mg",
    "vitc_mg": "vitc_mg",
    "folate_ug": "folate_ug",
}

# Ensure numeric
for col in NUTRIENT_COLS.values():
    _food_db[col] = pd.to_numeric(_food_db[col], errors="coerce").fillna(0)

RDA = {
    "adult_male": {
        "energy_kcal": 2400,
        "protein_g": 60,
        "carbs_g": 330,
        "fat_g": 80,
        "fiber_g": 40,
        "calcium_mg": 1000,
        "iron_mg": 17,
        "vitc_mg": 40,
        "folate_ug": 200,
    },
    "adult_female": {
        "energy_kcal": 1900,
        "protein_g": 55,
        "carbs_g": 260,
        "fat_g": 60,
        "fiber_g": 40,
        "calcium_mg": 1000,
        "iron_mg": 21,
        "vitc_mg": 40,
        "folate_ug": 200,
    },
}


def _find_food(name: str) -> pd.Series | None:
    lookup = name.lower().strip()
    match = _food_db[_food_db["_lookup_name"] == lookup]
    if not match.empty:
        return match.iloc[0]
    # Partial match fallback
    match = _food_db[_food_db["_lookup_name"].str.contains(lookup, na=False)]
    if not match.empty:
        return match.iloc[0]
    return None


def analyse_nutrients(items: list[dict], profile: str = "adult_male") -> dict:
    """Analyse nutrients for a list of food items with quantities."""
    rda = RDA.get(profile, RDA["adult_male"])

    totals = {k: 0.0 for k in NUTRIENT_COLS}
    per_item = []

    for item in items:
        food = _find_food(item["food_name"])
        qty = item["quantity_grams"]

        if food is None:
            per_item.append({
                "food_name": item["food_name"],
                "quantity_grams": qty,
                "found": False,
                "nutrients": {},
            })
            continue

        scale = qty / 100.0
        item_nutrients = {}
        for key, col in NUTRIENT_COLS.items():
            val = round(float(food[col]) * scale, 2)
            item_nutrients[key] = val
            totals[key] += val

        per_item.append({
            "food_name": item["food_name"],
            "quantity_grams": qty,
            "found": True,
            "nutrients": item_nutrients,
        })

    # Round totals
    for k in totals:
        totals[k] = round(totals[k], 2)

    # RDA comparison as percentages
    rda_comparison = {}
    for k in NUTRIENT_COLS:
        if rda.get(k, 0) > 0:
            rda_comparison[k] = round((totals[k] / rda[k]) * 100, 1)
        else:
            rda_comparison[k] = 0.0

    return {
        "total_calories": totals["energy_kcal"],
        "total_protein": totals["protein_g"],
        "total_carbs": totals["carbs_g"],
        "total_fat": totals["fat_g"],
        "total_fiber": totals["fiber_g"],
        "total_calcium": totals["calcium_mg"],
        "total_iron": totals["iron_mg"],
        "total_vitc": totals["vitc_mg"],
        "total_folate": totals["folate_ug"],
        "rda_comparison": rda_comparison,
        "per_item": per_item,
    }
