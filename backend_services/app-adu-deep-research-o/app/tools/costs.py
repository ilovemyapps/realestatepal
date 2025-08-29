from typing import Dict
from pydantic import BaseModel, Field

# --- simple baseline constants; replace with real price book later ---
BASE_SOFT = {
    "design": (7000, 15000),
    "permits": (3000, 11000),
    "structural_report": (3000, 7000),
    "title24_energy": (300, 600),
}
BASE_INFRA = {
    "electric_panel_200A": (4000, 8500),
    "separate_meter": (3000, 5000),
    "water_meter": (2000, 5000),
}
BASE_HARD_PER_SQFT = (200, 350)  # default new-build range
CONVERSION_DISCOUNT = 0.75       # garage conversion multiplier

class CostInputs(BaseModel):
    adu_type: str = Field(description="detached|attached|conversion|JADU")
    size_sqft: int = 750
    hillside: bool = False
    vhfhsz: bool = False
    historic: bool = False
    sprinklers_required: bool = False
    separate_meter: bool = False

def midpoint(lo: float, hi: float) -> float:
    return (lo + hi)/2.0

def compute_costs(inp: CostInputs) -> Dict[str, float]:
    # hard costs
    low, high = BASE_HARD_PER_SQFT
    if inp.adu_type in {"conversion","JADU"}:
        low *= CONVERSION_DISCOUNT
        high *= CONVERSION_DISCOUNT
    hard = midpoint(low, high) * max(inp.size_sqft, 350)

    # risk bumps
    risk_costs = {}
    if inp.hillside:
        risk_costs["hillside_engineering"] = 12000
    if inp.vhfhsz:
        risk_costs["wildfire_hardening"] = 8000
    if inp.historic:
        risk_costs["historic_review"] = 6000
    if inp.sprinklers_required:
        risk_costs["sprinklers"] = 9000

    # soft costs
    soft_costs = {k: midpoint(*v) for k,v in BASE_SOFT.items()}

    # infra
    infra = {}
    if inp.separate_meter:
        infra["separate_meter"] = midpoint(*BASE_INFRA["separate_meter"])
    infra["electric_panel_200A"] = midpoint(*BASE_INFRA["electric_panel_200A"])
    infra["water_meter"] = midpoint(*BASE_INFRA["water_meter"])

    total = hard + sum(soft_costs.values()) + sum(risk_costs.values()) + sum(infra.values())
    return {
        "hard_costs": round(hard, 2),
        "soft_costs": {k: round(v,2) for k,v in soft_costs.items()},
        "risk_costs": {k: round(v,2) for k,v in risk_costs.items()},
        "infra_costs": {k: round(v,2) for k,v in infra.items()},
        "total_cost": round(total, 2),
    }
