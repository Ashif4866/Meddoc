import numpy as np
import pandas as pd
from typing import List, Dict, Any


def calculate_medicine_correlations(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Computes cross-medicine correlation matrix across pharmacies to detect syndromic co-surges
    (e.g., ORS + Paracetamol co-occurrence indicating potential seasonal gastroenteritis clusters).
    """
    if not records:
        return []

    df = pd.DataFrame(records)
    if 'medicineName' not in df.columns or 'quantitySold' not in df.columns or 'date' not in df.columns:
        return []

    # Pivot: dates as rows, medicine names as columns
    pivot = df.pivot_table(index='date', columns='medicineName', values='quantitySold', aggfunc='sum').fillna(0)

    if pivot.shape[1] < 2:
        return []

    corr_matrix = pivot.corr(method='pearson')
    pairs = []

    cols = list(corr_matrix.columns)
    for i in range(len(cols)):
        for j in range(i + 1, len(cols)):
            m1, m2 = cols[i], cols[j]
            coeff = float(corr_matrix.loc[m1, m2])
            if np.isnan(coeff):
                coeff = 0.0

            if coeff >= 0.40:
                signal_type = "STRONG_SYNDROMIC_CLUSTER" if coeff >= 0.70 else "MODERATE_CO_SURGE"
                pairs.append({
                    "medicineA": m1,
                    "medicineB": m2,
                    "correlation": round(coeff, 3),
                    "signalType": signal_type,
                    "interpretation": (
                        f"Co-surge detected between {m1} and {m2} (r = {coeff:.2f}). "
                        f"Synchronous demand pattern indicates potential cluster activity across reporting nodes."
                    )
                })

    pairs.sort(key=lambda x: x['correlation'], reverse=True)
    return pairs
