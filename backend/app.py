from flask import Flask, request, jsonify, send_from_directory
import os
import numpy as np
import pandas as pd
import joblib

app = Flask(__name__, static_folder="static", static_url_path="")

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
            print("Model and Scaler loaded successfully.")
        except Exception as e:
            print(f"Error loading model/scaler: {e}")
    else:
        print("Warning: model.joblib or scaler.joblib not found. Please run train.py first.")

# Serve frontend index page
@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

# Serves static assets (CSS, JS, etc.)
@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# Prediction API Endpoint
@app.route("/predict", methods=["POST"])
def predict():
    global model, scaler
    if model is None or scaler is None:
        # Attempt to load resources if not loaded yet
        load_resources()
        if model is None or scaler is None:
            return jsonify({"error": "Model files are not initialized on the server. Contact administrator."}), 500
            
    try:
        data = request.get_json(force=True)
        
        # Required columns (matching training feature names)
        # Features are: ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active']
        features = [
            "age", "gender", "height", "weight", "ap_hi", "ap_lo", 
            "cholesterol", "gluc", "smoke", "alco", "active"
        ]
        
        # Validate that all required fields are present in request
        missing_fields = [f for f in features if f not in data]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
            
        # Parse inputs
        try:
            age = float(data["age"])               # Expected in years (e.g. 45)
            gender = int(data["gender"])           # 1: Female, 2: Male
            height = float(data["height"])         # cm
            weight = float(data["weight"])         # kg
            ap_hi = int(data["ap_hi"])             # Systolic blood pressure (mmHg)
            ap_lo = int(data["ap_lo"])             # Diastolic blood pressure (mmHg)
            cholesterol = int(data["cholesterol"]) # 1: Normal, 2: Above Normal, 3: Well Above Normal
            gluc = int(data["gluc"])               # 1: Normal, 2: Above Normal, 3: Well Above Normal
            smoke = int(data["smoke"])             # 0: No, 1: Yes
            alco = int(data["alco"])               # 0: No, 1: Yes
            active = int(data["active"])           # 0: Inactive, 1: Active
        except ValueError as val_err:
            return jsonify({"error": f"Invalid numerical value: {str(val_err)}"}), 400

        # Basic input validation
        if age <= 0 or age > 120:
            return jsonify({"error": "Age must be between 1 and 120 years."}), 400
        if height < 50 or height > 250:
            return jsonify({"error": "Height must be between 50 and 250 cm."}), 400
        if weight < 10 or weight > 300:
            return jsonify({"error": "Weight must be between 10 and 300 kg."}), 400
        if ap_hi < 50 or ap_hi > 300 or ap_lo < 30 or ap_lo > 200:
            return jsonify({"error": "Blood pressure values are outside valid clinical ranges."}), 400
        if ap_hi <= ap_lo:
            return jsonify({"error": "Systolic blood pressure must be higher than diastolic blood pressure."}), 400
        if gender not in [1, 2]:
            return jsonify({"error": "Gender must be 1 (Female) or 2 (Male)."}), 400
        if cholesterol not in [1, 2, 3] or gluc not in [1, 2, 3]:
            return jsonify({"error": "Cholesterol and Glucose must be 1 (Normal), 2 (Above Normal), or 3 (Well Above Normal)."}), 400
        if smoke not in [0, 1] or alco not in [0, 1] or active not in [0, 1]:
            return jsonify({"error": "Lifestyle variables (smoke, alcohol, activity) must be 0 or 1."}), 400

        # Construct input DataFrame with correct column names for scikit-learn
        input_data = pd.DataFrame([{
            "age": age,
            "gender": gender,
            "height": height,
            "weight": weight,
            "ap_hi": ap_hi,
            "ap_lo": ap_lo,
            "cholesterol": cholesterol,
            "gluc": gluc,
            "smoke": smoke,
            "alco": alco,
            "active": active
        }])
        
        # Scale inputs using fitted StandardScaler
        input_scaled = scaler.transform(input_data)
        
        # Run predictions
        prediction = model.predict(input_scaled)[0]
        probabilities = model.predict_proba(input_scaled)[0]
        
        # Risk probability of cardiovascular disease (class 1)
        risk_probability = probabilities[1]
        
        # Compute BMI for clinical advice
        height_m = height / 100.0
        bmi = weight / (height_m ** 2)
        
        # Risk analysis categories
        if risk_probability < 0.35:
            risk_level = "Low"
        elif risk_probability < 0.65:
            risk_level = "Moderate"
        else:
            risk_level = "High"
            
        return jsonify({
            "risk_label": int(prediction),
            "risk_percentage": round(float(risk_probability * 100), 1),
            "risk_level": risk_level,
            "bmi": round(float(bmi), 1),
            "inputs": {
                "age": age,
                "gender": "Male" if gender == 2 else "Female",
                "height": height,
                "weight": weight,
                "ap_hi": ap_hi,
                "ap_lo": ap_lo,
                "cholesterol": cholesterol,
                "gluc": gluc,
                "smoke": smoke,
                "alco": alco,
                "active": active
            }
        })
        
    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

# Pre-load resources on startup
load_resources()

if __name__ == "__main__":
    # Standard local port is 5000, but using 7860 is compatible with Hugging Face Spaces
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
