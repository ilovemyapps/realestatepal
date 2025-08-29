from typing import Dict, Optional

def estimate_rent(zipcode: Optional[str], size_sqft: int) -> float:
    # Minimal heuristic: later replace with Zillow/FMR
    base = 2100.0
    if size_sqft >= 800:
        base += 200
    elif size_sqft <= 450:
        base -= 200
    return base

def compute_finance(capex_total: float, rent_monthly: float) -> Dict[str, float]:
    # Simple NOI model with 30% op-ex, 5% vacancy
    gross = rent_monthly * 12
    noi = gross * (1 - 0.30) * (1 - 0.05)
    roi = (noi / capex_total) * 100 if capex_total else 0.0
    payback = capex_total / noi if noi else 0.0
    return {
        "est_rent_monthly": round(rent_monthly, 2),
        "capex_total": round(capex_total, 2),
        "annual_net_income": round(noi, 2),
        "roi_pct": round(roi, 2),
        "payback_years": round(payback, 2),
    }
