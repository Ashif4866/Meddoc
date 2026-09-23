from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from app.services.anomaly_detector import detect_anomalies
from app.services.forecaster import generate_forecast
from app.services.syndrome_correlator import calculate_medicine_correlations
from app.services.shortage_risk import assess_shortage_risks

app = FastAPI(
    title="PharmaPulse AI Analytics Service",
    description="Microservice for pharmacy anomaly detection, time-series forecasting, and syndromic co-surge intelligence.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DemandRecordInput(BaseModel):
    id: Optional[str] = None
    pharmacyId: Optional[str] = None
    pharmacyName: Optional[str] = None
    medicineId: Optional[str] = None
    medicineName: Optional[str] = None
    date: str
    quantitySold: float
    historicalAverage: Optional[float] = 0.0


class AnomalyDetectionRequest(BaseModel):
    records: List[DemandRecordInput]
    contamination: Optional[float] = 0.05


class ForecastRequest(BaseModel):
    records: List[DemandRecordInput]
    daysAhead: Optional[int] = 14
    confidenceLevel: Optional[float] = 0.95


class CorrelationRequest(BaseModel):
    records: List[DemandRecordInput]


class InventoryRiskInput(BaseModel):
    pharmacyId: Optional[str] = None
    pharmacyName: Optional[str] = None
    medicineId: Optional[str] = None
    medicineName: Optional[str] = None
    currentStock: int
    reorderLevel: int
    dailyAverageDemand: float
    predictedDailyDemand: Optional[float] = None


class ShortageRiskRequest(BaseModel):
    inventories: List[InventoryRiskInput]
    leadTimeDays: Optional[int] = 3


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "PharmaPulse AI Analytics Engine",
        "version": "1.0.0",
        "algorithms": [
            "Isolation Forest Anomaly Detection",
            "Rolling Z-Score Thresholding",
            "Holt-Winters Exponential Smoothing Forecaster",
            "Syndromic Pearson/Spearman Co-surge Matrix",
            "Inventory Burn & Days-of-Supply (DoS) Risk Model"
        ]
    }


@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": "ok"}


@app.post("/analyze/anomalies")
def run_anomaly_detection(payload: AnomalyDetectionRequest):
    try:
        raw_data = [r.dict() for r in payload.records]
        anomalies = detect_anomalies(raw_data, contamination=payload.contamination)
        return {
            "success": True,
            "totalAnalyzed": len(raw_data),
            "anomaliesDetected": sum(1 for a in anomalies if a.get("isAnomaly")),
            "results": anomalies
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze/forecast")
def run_forecasting(payload: ForecastRequest):
    try:
        raw_data = [r.dict() for r in payload.records]
        forecast = generate_forecast(
            historical_data=raw_data,
            days_ahead=payload.daysAhead,
            confidence_level=payload.confidenceLevel
        )
        return {
            "success": True,
            "daysAhead": payload.daysAhead,
            "confidenceLevel": payload.confidenceLevel,
            "forecast": forecast
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze/correlations")
def run_correlations(payload: CorrelationRequest):
    try:
        raw_data = [r.dict() for r in payload.records]
        correlations = calculate_medicine_correlations(raw_data)
        return {
            "success": True,
            "correlations": correlations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze/shortages")
def run_shortage_assessment(payload: ShortageRiskRequest):
    try:
        raw_data = [i.dict() for i in payload.inventories]
        risk_report = assess_shortage_risks(raw_data, lead_time_days=payload.leadTimeDays)
        return {
            "success": True,
            "evaluatedCount": len(raw_data),
            "shortageRisks": risk_report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
