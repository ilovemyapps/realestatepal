from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class AnalyzeTargets(BaseModel):
    adu_type: Optional[str] = Field(None, description="detached|attached|conversion|JADU")
    size_sqft: Optional[int] = None

class AnalyzeRequest(BaseModel):
    address: str
    user_overrides: Dict[str, Any] = Field(default_factory=dict)
    targets: AnalyzeTargets = Field(default_factory=AnalyzeTargets)

class Citation(BaseModel):
    title: Optional[str] = None
    url: str
    snippet: Optional[str] = None

class SearchBundle(BaseModel):
    jurisdiction: Dict[str, Any]
    zoning: Dict[str, Any]
    rules: Dict[str, Any]
    risks: Dict[str, Any]
    fees: Dict[str, Any]
    citations: List[Citation] = Field(default_factory=list)

class CostBreakdown(BaseModel):
    hard_costs: Dict[str, float]
    soft_costs: Dict[str, float]
    risk_costs: Dict[str, float]
    infra_costs: Dict[str, float]
    total_cost: float

class FinanceResult(BaseModel):
    est_rent_monthly: float
    capex_total: float
    annual_net_income: float
    roi_pct: float
    payback_years: float

class AnalyzeResult(BaseModel):
    search: SearchBundle
    costs: CostBreakdown
    finance: FinanceResult
    plan_md: str  # Markdown report for human reading
