import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
import joblib
import os

def main():
    print("=== Training Pipeline Starting ===")
    
    # Paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "cardio_train.csv")
    model_path = os.path.join(base_dir, "model.joblib")
    scaler_path = os.path.join(base_dir, "scaler.joblib")
    
    # 1. Load Data
    print(f"Loading dataset from: {data_path}")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")
        
    df = pd.read_csv(data_path, sep=";")
    print(f"Loaded {df.shape[0]} rows and {df.shape[1]} columns.")
    
    # 2. Preprocessing & Cleaning
    print("Cleaning dataset...")
    # Drop id column (uninformative feature)
    df_clean = df.drop(columns=["id"], errors="ignore")
    
    # Filter physiologically unrealistic outlier ranges for a robust model
    # Systolic blood pressure (ap_hi) must be between 80 and 220 mmHg
    df_clean = df_clean[(df_clean["ap_hi"] >= 80) & (df_clean["ap_hi"] <= 220)]
    # Diastolic blood pressure (ap_lo) must be between 40 and 140 mmHg
    df_clean = df_clean[(df_clean["ap_lo"] >= 40) & (df_clean["ap_lo"] <= 140)]
    # Height must be between 100 and 220 cm
    df_clean = df_clean[(df_clean["height"] >= 100) & (df_clean["height"] <= 220)]
    # Weight must be between 30 and 200 kg
    df_clean = df_clean[(df_clean["weight"] >= 30) & (df_clean["weight"] <= 200)]
    
    # Convert age from days to years
    df_clean["age"] = df_clean["age"] / 365.25
    
    print(f"Dataset shape after filtering outliers: {df_clean.shape[0]} rows.")
    
    # 3. Features & Target splitting
    X = df_clean.drop(columns=["cardio"])
    y = df_clean["cardio"]
    
    # 4. Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 5. Fit & Transform Scaling
    print("Fitting and applying StandardScaler...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # 6. Model Training (Gradient Boosting)
    print("Training Gradient Boosting Classifier...")
    model = GradientBoostingClassifier(
        n_estimators=100, 
        learning_rate=0.1, 
        max_depth=4, 
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    train_acc = model.score(X_train_scaled, y_train)
    test_acc = model.score(X_test_scaled, y_test)
    print(f"Training Accuracy: {train_acc:.4f}")
    print(f"Testing Accuracy:  {test_acc:.4f}")
    
    # 7. Save Model & Scaler
    print(f"Saving model to {model_path}...")
    joblib.dump(model, model_path)
    
    print(f"Saving scaler to {scaler_path}...")
    joblib.dump(scaler, scaler_path)
    
    print("=== Training Pipeline Completed Successfully ===")

if __name__ == "__main__":
    main()
