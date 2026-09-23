from typing import List, Dict, Any


def assess_shortage_risks(
    inventories: List[Dict[str, Any]],
    lead_time_days: int = 3
) -> List[Dict[str, Any]]:
    """
    Evaluates inventory runway, Days of Supply (DoS), burn rate, and predicts stockout likelihood.
    """
    results = []

    for item in inventories:
        stock = float(item.get('currentStock', 0))
        daily_demand = float(item.get('dailyAverageDemand', 1.0))
        reorder_level = float(item.get('reorderLevel', 50))
        predicted_daily = float(item.get('predictedDailyDemand', daily_demand))

        effective_burn_rate = max(0.1, predicted_daily)
        days_of_supply = round(stock / effective_burn_rate, 1)

        # Risk scoring
        if stock <= 0:
            risk_level = "STOCKOUT"
            shortage_probability = 1.0
            urgency = "IMMEDIATE"
        elif days_of_supply <= lead_time_days:
            risk_level = "CRITICAL_SHORTAGE"
            shortage_probability = 0.92
            urgency = "HIGH"
        elif days_of_supply <= lead_time_days * 2 or stock <= reorder_level:
            risk_level = "ELEVATED_RISK"
            shortage_probability = 0.65
            urgency = "MEDIUM"
        else:
            risk_level = "ADEQUATE"
            shortage_probability = 0.10
            urgency = "LOW"

        # Recommended replenishment quantity
        target_buffer_days = 14
        suggested_reorder = max(0, int((target_buffer_days * effective_burn_rate) - stock + reorder_level))

        results.append({
            "pharmacyId": item.get('pharmacyId'),
            "pharmacyName": item.get('pharmacyName'),
            "medicineId": item.get('medicineId'),
            "medicineName": item.get('medicineName'),
            "currentStock": int(stock),
            "reorderLevel": int(reorder_level),
            "dailyDemand": round(daily_demand, 1),
            "predictedDailyDemand": round(predicted_daily, 1),
            "daysOfSupply": days_of_supply,
            "riskLevel": risk_level,
            "shortageProbability": shortage_probability,
            "urgency": urgency,
            "suggestedReorderQuantity": suggested_reorder,
            "recommendation": (
                f"Days of supply remaining: {days_of_supply}d. "
                f"Recommended reorder quantity: {suggested_reorder} units to prevent stockout under forecasted surge."
            )
        })

    results.sort(key=lambda x: x['daysOfSupply'])
    return results
