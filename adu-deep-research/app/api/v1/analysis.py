from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.core.agents.orchestrator import OrchestratorAgent

router = APIRouter()

class AnalysisRequest(BaseModel):
    address: str
    lot_size_sqft: int
    existing_structure_sqft: int
    adu_type_preference: str = "detached"
    budget: float
    
class AnalysisResponse(BaseModel):
    analysis_id: str
    feasibility_score: float
    total_estimated_cost: float
    recommendations: Dict[str, Any]
    
@router.post("/full", response_model=AnalysisResponse)
async def full_analysis(request: AnalysisRequest):
    """执行完整的ADU可行性分析"""
    try:
        orchestrator = OrchestratorAgent()
        result = await orchestrator.analyze(request)
        
        return AnalysisResponse(
            analysis_id=result["analysis_id"],
            feasibility_score=result["feasibility_score"],
            total_estimated_cost=result["total_cost"],
            recommendations=result["recommendations"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quick")
async def quick_analysis(address: str):
    """快速ADU可行性检查"""
    return {
        "address": address,
        "feasible": True,
        "estimated_cost_range": "$200,000 - $350,000",
        "next_steps": ["运行完整分析获取详细信息"]
    }
