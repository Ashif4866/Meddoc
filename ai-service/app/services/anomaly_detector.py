import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional

try:
    from sklearn.ensemble import IsolationForest
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


def detect_anomalies(data: List[Dict[str, Any]], contamination: float = 0.05) -> List[Dict[str, Any]]:
    """
    Detects demand anomalies across time series demand records.
    Calculates rolling statistics, Z-score, Isolation Forest score, and categorizes severity.
    """
    if not data or len(data) < 3:
        return []

    df = pd.DataFrame(data)
    # Ensure numeric columns
    df['quantitySold'] = pd.to_numeric(df.get('quantitySold', 0), errors='coerce').fillna(0)
    df['historicalAverage'] = pd.to_numeric(df.get('historicalAverage', df['quantitySold'].mean()), errors='coerce').fillna(df['quantitySold'].mean())

    # Rolling 7-day or dynamic mean and std
    window = min(7, len(df))
    rolling_mean = df['quantitySold'].rolling(window=window, min_periods=1).mean()
    rolling_std = df['quantitySold'].rolling(window=window, min_periods=1).std().fillna(1.0)
    rolling_std = np.where(rolling_std == 0, 1.0, rolling_std)

    # Z-scores
    z_scores = (df['quantitySold'] - rolling_mean) / rolling_std

    # Percentage over baseline
    pct_increase = np.where(
        df['historicalAverage'] > 0,
        ((df['quantitySold'] - df['historicalAverage']) / df['historicalAverage']) * 100.0,
        0.0
    )

    # Isolation Forest
    iso_scores = np.zeros(len(df))
    if SKLEARN_AVAILABLE and len(df) >= 6:
        try:
            features = np.column_stack([
                df['quantitySold'].values,
                z_scores.values,
                pct_increase
            ])
            clf = IsolationForest(contamination=contamination, random_state=42)
            clf.fit(features)
            # Decision function: lower means more anomalous
            raw_scores = clf.decision_function(features)
            # Normalize to 0 (normal) to 1 (highly anomalous)
            min_s, max_s = raw_scores.min(), raw_scores.max()
            if max_s > min_s:
                iso_scores = 1.0 - ((raw_scores - min_s) / (max_s - min_s))
            else:
                iso_scores = np.zeros(len(df))
        except Exception:
            iso_scores = np.clip(np.abs(z_scores) / 4.0, 0, 1)
    else:
        iso_scores = np.clip(np.abs(z_scores) / 4.0, 0, 1)

    results = []
    for i, row in df.iterrows():
        z = float(z_scores.iloc[i])
        pct = float(pct_increase[i])
        iso = float(iso_scores[i])
        sold = int(row['quantitySold'])
        hist = float(row['historicalAverage'])

        # Combined anomaly score (0.0 to 1.0)
        anomaly_score = float(np.clip(0.5 * iso + 0.5 * (min(max(z, 0), 4) / 4.0), 0.0, 1.0))

        # Determine severity strictly based on statistical thresholds
        if pct >= 120 and (z >= 2.5 or anomaly_score >= 0.75):
            severity = "CRITICAL"
        elif pct >= 60 and (z >= 1.8 or anomaly_score >= 0.55):
            severity = "HIGH"
        elif pct >= 30 and (z >= 1.2 or anomaly_score >= 0.35):
            severity = "WARNING"
        else:
            severity = "NORMAL"

        # Generate scientific, non-diagnostic analytical explanation
        med_name = row.get('medicineName', 'Medicine')
        pharm_name = row.get('pharmacyName', 'Reporting Pharmacy')
        date_str = str(row.get('date', ''))[:10]

        if severity == "CRITICAL":
            explanation = (
                f"Elevated demand activity detected: {med_name} sales reached {sold} units "
                f"(+{pct:.1f}% above 30-day baseline of {hist:.1f}). Statistical Z-score is {z:.2f} "
                f"with an AI anomaly confidence of {anomaly_score * 100:.1f}%. "
                f"Unusual demand pattern requires verification with local health monitoring."
            )
        elif severity == "HIGH":
            explanation = (
                f"Potential signal detected: {med_name} demand increased by +{pct:.1f}% "
                f"({sold} units vs historical average of {hist:.1f}). Z-score: {z:.2f}. "
                f"Elevated consumption pattern identified for supply chain review."
            )
        elif severity == "WARNING":
            explanation = (
                f"Mild demand surge observed: {med_name} registered {sold} units "
                f"(+{pct:.1f}% above expected baseline). Demand variation slightly exceeding typical bounds."
            )
        else:
            explanation = f"Demand within normal baseline limits ({sold} units, {pct:+.1f}% vs baseline)."

        results.append({
            "id": row.get("id"),
            "medicineId": row.get("medicineId"),
            "medicineName": med_name,
            "pharmacyId": row.get("pharmacyId"),
            "pharmacyName": pharm_name,
            "date": date_str,
            "quantitySold": sold,
            "historicalAverage": round(hist, 1),
            "percentageIncrease": round(pct, 1),
            "zScore": round(z, 2),
            "anomalyScore": round(anomaly_score, 3),
            "severity": severity,
            "isAnomaly": severity in ["WARNING", "HIGH", "CRITICAL"],
            "explanation": explanation
        })

    return results
