import pandas as pd
import random
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

# Load and prepare food database
_food_db = pd.read_csv(DATA_DIR / "master_food_db.csv")

# Handle duplicate column names - pandas auto-suffixes them
# Keep only the first occurrence of duplicate columns
_food_db = _food_db.loc[:, ~_food_db.columns.duplicated()]

# Clean the rasa column: normalize list-style strings like "['Madhura', 'Tikta']"
def _clean_rasa(val):
    if pd.isna(val) or val == "":
        return "Unknown"
    val = str(val).strip()
    if val.startswith("["):
        # Parse list-style string
        items = val.strip("[]").replace("'", "").replace('"', "").split(",")
        return items[0].strip() if items else "Unknown"
    return val

_food_db["rasa"] = _food_db["rasa"].apply(_clean_rasa)
_food_db["virya"] = _food_db["virya"].fillna("Unknown").astype(str)
_food_db["energy_kcal"] = pd.to_numeric(_food_db["energy_kcal"], errors="coerce").fillna(0)
_food_db["protein_g"] = pd.to_numeric(_food_db["protein_g"], errors="coerce").fillna(0)
_food_db["carbs_g"] = pd.to_numeric(_food_db["carbs_g"], errors="coerce").fillna(0)
_food_db["fat_g"] = pd.to_numeric(_food_db["fat_g"], errors="coerce").fillna(0)

# Keyword-based meal categorization
BREAKFAST_KEYWORDS = [
    "milk", "curd", "yogurt", "dahi", "poha", "upma", "idli", "dosa",
    "paratha", "bread", "toast", "oat", "cereal", "muesli", "porridge",
    "egg", "banana", "apple", "fruit", "juice", "tea", "coffee",
    "sprout", "chilla", "pancake", "smoothie", "lassi", "buttermilk",
    "khichdi", "daliya", "ragi", "cornflakes", "honey",
]
SNACK_KEYWORDS = [
    "biscuit", "cookie", "cake", "sweet", "ladoo", "barfi", "halwa",
    "nut", "almond", "cashew", "walnut", "peanut", "pistachio",
    "dried", "raisin", "date", "fig", "chips", "namkeen", "bhujia",
    "chikki", "makhana", "fox nut", "roasted", "murmura",
    "fruit", "papaya", "mango", "guava", "orange", "pomegranate",
]
LUNCH_DINNER_KEYWORDS = [
    "rice", "roti", "chapati", "naan", "dal", "lentil", "rajma",
    "chole", "paneer", "chicken", "mutton", "fish", "egg", "prawn",
    "sabzi", "curry", "vegetable", "potato", "cauliflower", "spinach",
    "palak", "bhindi", "gobi", "beans", "peas", "carrot", "brinjal",
    "tomato", "onion", "wheat", "atta", "bajra", "jowar", "maize",
    "sambhar", "rasam", "curd rice", "biryani", "pulao", "khichdi",
]


def _categorize_food(name: str) -> str:
    name_lower = name.lower()
    scores = {"breakfast": 0, "lunch_dinner": 0, "snack": 0}
    for kw in BREAKFAST_KEYWORDS:
        if kw in name_lower:
            scores["breakfast"] += 1
    for kw in SNACK_KEYWORDS:
        if kw in name_lower:
            scores["snack"] += 1
    for kw in LUNCH_DINNER_KEYWORDS:
        if kw in name_lower:
            scores["lunch_dinner"] += 1
    best = max(scores, key=scores.get)
    if scores[best] == 0:
        return "lunch_dinner"  # default
    return best


_food_db["meal_category"] = _food_db["name"].apply(_categorize_food)

# Dosha column mapping
DOSHA_COLS = {
    "Vata": "good_for_vata",
    "Pitta": "good_for_pitta",
    "Kapha": "good_for_kapha",
}


def _get_dosha_filter_cols(dosha: str) -> list[str]:
    """Return the filter columns for a dosha string (handles dual doshas)."""
    parts = [d.strip() for d in dosha.split("+")]
    cols = []
    for part in parts:
        col = DOSHA_COLS.get(part)
        if col:
            cols.append(col)
    return cols


def _select_items(pool: pd.DataFrame, n: int) -> list[dict]:
    """Select n random items from pool, return as dicts."""
    if pool.empty:
        return []
    selected = pool.sample(n=min(n, len(pool)))
    items = []
    for _, row in selected.iterrows():
        items.append({
            "name": str(row["name"]),
            "rasa": str(row["rasa"]),
            "virya": str(row["virya"]),
            "energy_kcal": round(float(row["energy_kcal"]), 1),
            "protein_g": round(float(row["protein_g"]), 1),
            "carbs_g": round(float(row["carbs_g"]), 1),
            "fat_g": round(float(row["fat_g"]), 1),
            "category": str(row["meal_category"]),
        })
    return items


def generate_diet(dosha: str, is_vegetarian: bool = True, meals_per_day: int = 3) -> dict:
    """Generate a dosha-appropriate meal plan."""
    filter_cols = _get_dosha_filter_cols(dosha)

    if not filter_cols:
        # Fallback: no filtering if dosha not recognized
        filtered = _food_db.copy()
    else:
        mask = _food_db[filter_cols[0]] == 1
        for col in filter_cols[1:]:
            mask = mask & (_food_db[col] == 1)
        filtered = _food_db[mask].copy()

    # If too few results, fall back to all foods
    if len(filtered) < 10:
        filtered = _food_db.copy()

    breakfast_pool = filtered[filtered["meal_category"] == "breakfast"]
    lunch_pool = filtered[filtered["meal_category"] == "lunch_dinner"]
    snack_pool = filtered[filtered["meal_category"] == "snack"]

    # If pools are too small, supplement from general pool
    if len(breakfast_pool) < 3:
        breakfast_pool = filtered.head(20)
    if len(lunch_pool) < 3:
        lunch_pool = filtered.head(20)
    if len(snack_pool) < 3:
        snack_pool = filtered.head(10)

    result = {
        "breakfast": _select_items(breakfast_pool, 4),
        "lunch": _select_items(lunch_pool, 5),
        "dinner": _select_items(lunch_pool, 5),
        "snacks": [],
    }

    if meals_per_day > 3:
        result["snacks"] = _select_items(snack_pool, 3)

    return result
