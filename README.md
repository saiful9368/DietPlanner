# 🌿 AyurDiet Pro

**An AI-Powered Ayurvedic Diet Management System**

> Bridging 5,000 years of Ayurvedic wisdom with modern nutritional science.

AyurDiet Pro is a full-stack web application that automates Ayurvedic diet prescription for practitioners. It predicts a patient's Dosha (body constitution) using a machine learning model trained on 1,200 Prakriti records, generates a personalised diet chart from a database of 1,717 Ayurvedic-tagged Indian foods, and performs complete nutritional analysis against ICMR RDA standards — all in one platform.

---

## 📸 Demo

> Patient Assessment → Dosha Prediction → Diet Chart → Nutrient Analysis



---

## ✨ Features

- **29-Question Prakriti Assessment** — Standardised form covering physical characteristics, skin & hair, facial features, digestion, and lifestyle
- **AI Dosha Prediction** — Random Forest Classifier predicts one of 6 Dosha types with confidence scores for all classes
- **Personalised Diet Chart** — Auto-generates Breakfast, Lunch & Dinner from 1,717 Indian foods filtered by Dosha suitability
- **Ayurvedic Food Tags** — Every food card shows Rasa (taste), Virya (potency), calories, and protein
- **ICMR Nutrient Analysis** — Calculates 9 nutrients (calories, protein, carbs, fat, fiber, calcium, iron, vitamin C, folate) and compares against RDA
- **Recharts Visualisation** — Interactive bar charts for nutrient breakdown
- **Swagger API Docs** — All 3 endpoints documented at `/docs`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         React.js Frontend           │
│   (Vite + TailwindCSS + Recharts)   │
│           Port: 5173                │
└────────────────┬────────────────────┘
                 │ HTTP REST (Axios)
┌────────────────▼────────────────────┐
│         FastAPI Backend             │
│   POST /predict-dosha               │
│   POST /generate-diet               │
│   POST /analyse-nutrients           │
│           Port: 8888                │
└──────┬──────────────┬───────────────┘
       │              │
┌──────▼──────┐ ┌─────▼──────────────┐
│  ML Models  │ │    CSV Data Layer  │
│  (.pkl)     │ │  master_food_db    │
│  RF + SMOTE │ │  master_recipes    │
└─────────────┘ └────────────────────┘
```

---

## 🗂️ Project Structure

```
DietPlanner/
├── backend/
│   ├── main.py                    # FastAPI app, CORS, router registration
│   ├── models/
│   │   └── schemas.py             # Pydantic request/response models
│   ├── routers/
│   │   ├── dosha.py               # POST /predict-dosha
│   │   ├── diet.py                # POST /generate-diet
│   │   └── nutrition.py           # POST /analyse-nutrients
│   └── services/
│       ├── dosha_predictor.py     # Loads pkl, runs RF model
│       ├── diet_chart.py          # Filters food DB by Dosha flags
│       └── nutrient_analyser.py   # Scales nutrients, compares RDA
├── data/
│   ├── master_food_db.csv         # 1,717 foods with Ayurvedic tags
│   ├── master_recipes.csv         # 3,886 Indian recipes
│   ├── dosha_model.pkl            # Trained Random Forest model
│   ├── dosha_encoder.pkl          # Label encoder for Dosha classes
│   └── dosha_feature_encoder.pkl  # OrdinalEncoder for 29 features
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Routes: / /assessment /diet-chart /nutrients
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Assessment.jsx     # 29-question form, 5 sections
│   │   │   ├── DietChart.jsx      # Meal cards with Rasa/Virya tags
│   │   │   └── NutrientReport.jsx # RDA bars + Recharts chart
│   │   └── components/
│   │       ├── DoshaCard.jsx
│   │       ├── FoodCard.jsx
│   │       └── NutrientBar.jsx
│   ├── vite.config.js             # Proxy: /api → localhost:8888
│   └── package.json
└── requirements.txt
```

---

## 🧠 Machine Learning

| Property | Value |
|---|---|
| Algorithm | Random Forest Classifier |
| Trees | 200 (n_estimators=200) |
| Max Depth | 15 |
| Input Features | 29 categorical Prakriti features |
| Output Classes | 6 (Vata, Pitta, Kapha, Vata+Pitta, Pitta+Kapha, Vata+Kapha) |
| Class Balancing | SMOTE (Synthetic Minority Oversampling Technique) |
| Encoding | OrdinalEncoder for all categorical inputs |
| Train/Test Split | 80/20 stratified |
| Test Accuracy | 100% |

**Top 5 Predictive Features:**

| Rank | Feature | Importance |
|---|---|---|
| 1 | Teeth and Gums | 0.091 |
| 2 | Body Weight | 0.085 |
| 3 | Eyes | 0.072 |
| 4 | Bone Structure | 0.064 |
| 5 | Complexion | 0.063 |

---

## 📊 Datasets

| Dataset | Records | Purpose |
|---|---|---|
| INDB 2024 (ICMR) | 1,014 | Indian food nutrition — 82 nutrient columns per 100g |
| Ayurvedic Herb DB | 704 | Rasa, Guna, Virya, Vipaka, Dosha effect tags |
| Indian Recipe Dataset | 5,938 | Indian recipes with ingredients and regional tags |
| Indian Food 101 | 255 | Traditional dishes with flavor profile and course type |
| Prakriti Dataset | 1,200 | 29 features + 6 Dosha class labels for ML training |

After cleaning and merging → **master_food_db.csv** (1,717 items, 96 columns)

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/saiful9368/DietPlanner.git
cd DietPlanner
```

### 2. Set up the backend

```bash
# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Run the backend

```bash
uvicorn backend.main:app --reload --port 8888
```

Backend will be live at: `http://localhost:8888`  
Swagger docs at: `http://localhost:8888/docs`

### 4. Set up and run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be live at: `http://localhost:5173`

> **Note:** Start the backend before the frontend. The Vite proxy is configured to forward API calls to port 8888 automatically.

---

## 🔌 API Reference

### `POST /predict-dosha`

Predicts Dosha from 29 patient features.

**Request body:**
```json
{
  "body_size": "Medium",
  "body_weight": "Medium",
  "height": "Medium",
  "bone_structure": "Medium",
  "complexion": "Fair",
  "general_feel_of_skin": "Soft",
  "texture_of_skin": "Oily",
  "hair_color": "Black",
  "appearance_of_hair": "Straight",
  "shape_of_face": "Oval",
  "eyes": "Medium",
  "eyelashes": "Moderate",
  "blinking_of_eyes": "Moderate",
  "cheeks": "Flat",
  "nose": "Medium",
  "teeth_and_gums": "Medium",
  "lips": "Medium",
  "nails": "Pink",
  "appetite": "Good",
  "liking_tastes": "Sweet",
  "metabolism_type": "Moderate",
  "climate_preference": "Moderate",
  "stress_levels": "Moderate",
  "sleep_patterns": "Sound",
  "dietary_habits": "Mixed",
  "physical_activity_level": "Moderate",
  "water_intake": "Moderate",
  "digestion_quality": "Good",
  "skin_sensitivity": "Moderate"
}
```

**Response:**
```json
{
  "dosha": "Vata+Pitta",
  "confidence": {
    "Vata": 0.072,
    "Pitta": 0.226,
    "Kapha": 0.041,
    "Vata+Pitta": 0.471,
    "Pitta+Kapha": 0.118,
    "Vata+Kapha": 0.072
  }
}
```

---

### `POST /generate-diet`

Generates a personalised meal plan for the predicted Dosha.

**Request body:**
```json
{
  "dosha": "Vata+Pitta",
  "is_vegetarian": true,
  "meals_per_day": 3
}
```

**Response:**
```json
{
  "breakfast": [
    {
      "name": "Poha",
      "rasa": "Madhura",
      "virya": "Sheeta",
      "energy_kcal": 130.0,
      "protein_g": 2.5,
      "carbs_g": 27.0,
      "fat_g": 1.2,
      "category": "breakfast"
    }
  ],
  "lunch": [...],
  "dinner": [...],
  "snacks": []
}
```

---

### `POST /analyse-nutrients`

Analyses the nutritional content of a meal against ICMR RDA.

**Request body:**
```json
{
  "items": [
    { "food_name": "Poha", "quantity_grams": 100 },
    { "food_name": "Dal", "quantity_grams": 150 }
  ],
  "profile": "adult_male"
}
```

**Response:**
```json
{
  "total_calories": 320.5,
  "total_protein": 14.2,
  "total_carbs": 58.0,
  "total_fat": 4.1,
  "total_fiber": 6.3,
  "total_calcium": 85.0,
  "total_iron": 3.2,
  "total_vitc": 8.5,
  "total_folate": 42.0,
  "rda_comparison": {
    "calories": 13.4,
    "protein": 23.7
  },
  "per_item": [...]
}
```

**Supported profiles:** `adult_male`, `adult_female`

---

## 🌿 Ayurvedic Logic

The diet chart is generated using classical Ayurvedic Rasa-to-Dosha rules encoded as binary flags in the food database:

| Rasa (Taste) | Vata | Pitta | Kapha |
|---|---|---|---|
| Madhura (Sweet) | Pacifies ✓ | Pacifies ✓ | Aggravates ✗ |
| Amla (Sour) | Pacifies ✓ | Aggravates ✗ | Aggravates ✗ |
| Lavana (Salty) | Pacifies ✓ | Aggravates ✗ | Aggravates ✗ |
| Katu (Pungent) | Aggravates ✗ | Aggravates ✗ | Pacifies ✓ |
| Tikta (Bitter) | Aggravates ✗ | Pacifies ✓ | Pacifies ✓ |
| Kashaya (Astringent) | Aggravates ✗ | Pacifies ✓ | Pacifies ✓ |

For dual Doshas (e.g. Vata+Pitta), an AND filter is applied — only foods that pacify **both** Doshas are included.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 19, TailwindCSS 4, React Router DOM 7, Recharts 3, Axios |
| Backend | FastAPI, Uvicorn, Pydantic |
| ML | scikit-learn (Random Forest), imbalanced-learn (SMOTE), joblib |
| Data | pandas, numpy, CSV files |
| Build Tool | Vite 7 |

---

## 📁 Data Files Note

The `data/` directory contains:
- `master_food_db.csv` — merged INDB + Ayurvedic herb database (1,717 foods)
- `master_recipes.csv` — cleaned Indian recipe dataset (3,886 recipes)
- `*.pkl` files — trained ML model and encoders

These files are already included in the repository and do not need to be regenerated. If you want to retrain the model or rebuild the food database, the Google Colab notebooks are available separately.

---

## 👨‍💻 Author

**Saiful Rahman**  
B.Tech Computer Science and Engineering  
Lovely Professional University, Punjab  
Registration No: 12217543



---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> *"Let food be thy medicine and medicine be thy food."* — Hippocrates  
> *"Ahara (diet) is the root of all life."* — Charaka Samhita
