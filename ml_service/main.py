from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="ResourcePilot Core ML Gateway Engine")

# Load compiled analytical parameters safely
static_model = joblib.load("static_anomaly_model.pkl")
timeseries_model = joblib.load("timeseries_predictive_model.pkl")

# Pydantic schemas for data validation
class StaticAssetInput(BaseModel):
    cost: float
    maintenance_count: int
    damaged_in_audit: int
    is_laptop: int

class TelemetryInput(BaseModel):
    assetCategory: str
    department: str
    location: str
    status: str
    dailyUsageHours: float
    bookingCount: int
    allocationActive: int
    conditionScore: float
    daysSinceMaintenance: int
    maintenanceRequests: int
    maintenanceEvent: int
    maintenancePriority: str = "NONE"
    issueType: str = "NONE"
    failureRisk: float

@app.post("/predict-static-anomaly")
def predict_anomaly(data: StaticAssetInput):
    input_df = pd.DataFrame([data.model_dump()])
    prediction = int(static_model.predict(input_df)[0])
    return {"intervention_required": bool(prediction == 1)}

@app.post("/predict-timeseries-failure")
def predict_time_failure(data: TelemetryInput):
    input_df = pd.DataFrame([data.model_dump()])
    prob = timeseries_model.predict_proba(input_df)[0][1]
    return {"failure_probability": round(float(prob), 4), "critical_alert": bool(prob >= 0.5)}