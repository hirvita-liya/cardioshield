from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import numpy as np
import pandas as pd
import joblib

app = FastAPI(title="CardioShield AI - FastAPI Backend")

# Define the absolute directory paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.joblib")

# Global variables for model and scaler
model = None
scaler = None

def load_resources():
    global model, scaler
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            scaler = joblib.load(SCALER_PATH)
            print("Model and Scaler loaded successfully in FastAPI.")
        except Exception as e:
            print(f"Error loading model/scaler: {e}")
    else:
        print("Warning: model.joblib or scaler.joblib not found.")

# Load model and scaler on app startup
load_resources()

# Pydantic schema for inputs
class PredictionInput(BaseModel):
    age: float
    gender: int
    height: float
    weight: float
    ap_hi: int
    ap_lo: int
    cholesterol: int
    gluc: int
    smoke: int
    alco: int
    active: int

# Prediction Endpoint
@app.post("/predict")
def predict(data: PredictionInput):
    global model, scaler
    if model is None or scaler is None:
        load_resources()
        if model is None or scaler is None:
            return JSONResponse(
                status_code=500,
                content={"error": "Model files are not initialized on the server. Contact administrator."}
            )

    try:
        # Clinical validations (exact parity with Flask version)
        if data.age <= 0 or data.age > 120:
            return JSONResponse(status_code=400, content={"error": "Age must be between 1 and 120 years."})
        if data.height < 50 or data.height > 250:
            return JSONResponse(status_code=400, content={"error": "Height must be between 50 and 250 cm."})
        if data.weight < 10 or data.weight > 300:
            return JSONResponse(status_code=400, content={"error": "Weight must be between 10 and 300 kg."})
        if data.ap_hi < 50 or data.ap_hi > 300 or data.ap_lo < 30 or data.ap_lo > 200:
            return JSONResponse(status_code=400, content={"error": "Blood pressure values are outside valid clinical ranges."})
        if data.ap_hi <= data.ap_lo:
            return JSONResponse(status_code=400, content={"error": "Systolic blood pressure must be higher than diastolic blood pressure."})
        if data.gender not in [1, 2]:
            return JSONResponse(status_code=400, content={"error": "Gender must be 1 (Female) or 2 (Male)."})
        if data.cholesterol not in [1, 2, 3] or data.gluc not in [1, 2, 3]:
            return JSONResponse(status_code=400, content={"error": "Cholesterol and Glucose must be 1 (Normal), 2 (Above Normal), or 3 (Well Above Normal)."})
        if data.smoke not in [0, 1] or data.alco not in [0, 1] or data.active not in [0, 1]:
            return JSONResponse(status_code=400, content={"error": "Lifestyle variables (smoke, alcohol, activity) must be 0 or 1."})

        # Construct input DataFrame with correct column names for scikit-learn
        input_data = pd.DataFrame([{
            "age": data.age,
            "gender": data.gender,
            "height": data.height,
            "weight": data.weight,
            "ap_hi": data.ap_hi,
            "ap_lo": data.ap_lo,
            "cholesterol": data.cholesterol,
            "gluc": data.gluc,
            "smoke": data.smoke,
            "alco": data.alco,
            "active": data.active
        }])

        # Scale inputs using fitted StandardScaler
        input_scaled = scaler.transform(input_data)

        # Run predictions
        prediction = model.predict(input_scaled)[0]
        probabilities = model.predict_proba(input_scaled)[0]

        # Risk probability of cardiovascular disease (class 1)
        risk_probability = probabilities[1]

        # Compute BMI for clinical advice
        height_m = data.height / 100.0
        bmi = data.weight / (height_m ** 2)

        # Risk analysis categories
        if risk_probability < 0.35:
            risk_level = "Low"
        elif risk_probability < 0.65:
            risk_level = "Moderate"
        else:
            risk_level = "High"

        return {
            "risk_label": int(prediction),
            "risk_percentage": round(float(risk_probability * 100), 1),
            "risk_level": risk_level,
            "bmi": round(float(bmi), 1),
            "inputs": {
                "age": data.age,
                "gender": "Male" if data.gender == 2 else "Female",
                "height": data.height,
                "weight": data.weight,
                "ap_hi": data.ap_hi,
                "ap_lo": data.ap_lo,
                "cholesterol": data.cholesterol,
                "gluc": data.gluc,
                "smoke": data.smoke,
                "alco": data.alco,
                "active": data.active
            }
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Internal Server Error: {str(e)}"})

# Serves static assets (CSS, JS, etc.)
static_assets_path = os.path.join(BASE_DIR, "static", "assets")
if os.path.exists(static_assets_path):
    app.mount("/assets", StaticFiles(directory=static_assets_path), name="assets")

# Serve frontend index page
@app.get("/")
def serve_index():
    index_path = os.path.join(BASE_DIR, "static", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="Index file not found")

# Serve other root static files
@app.get("/favicon.svg")
def serve_favicon():
    favicon_path = os.path.join(BASE_DIR, "static", "favicon.svg")
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path)
    raise HTTPException(status_code=404, detail="Favicon not found")

@app.get("/icons.svg")
def serve_icons():
    icons_path = os.path.join(BASE_DIR, "static", "icons.svg")
    if os.path.exists(icons_path):
        return FileResponse(icons_path)
    raise HTTPException(status_code=404, detail="Icons file not found")

# SPA Fallback for client-side routing
@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    file_path = os.path.join(BASE_DIR, "static", full_path)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    index_path = os.path.join(BASE_DIR, "static", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="Index file not found")

