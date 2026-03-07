from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import dosha, diet, nutrition

app = FastAPI(title="AyurDiet Pro API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dosha.router, tags=["Dosha"])
app.include_router(diet.router, tags=["Diet"])
app.include_router(nutrition.router, tags=["Nutrition"])


@app.get("/")
def root():
    return {"message": "AyurDiet Pro API is running"}
