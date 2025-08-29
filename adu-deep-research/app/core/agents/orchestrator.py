import asyncio
from typing import Dict, Any
from app.services.openai_service import OpenAIService
from app.config import settings

class OrchestratorAgent:
    """GPT-5统筹Agent - 协调整个分析流程"""
    
    def __init__(self):
        self.openai = OpenAIService(model=settings.GPT5_MODEL)
        self.search_agent = OpenAIService(model=settings.GPT4O_MINI_MODEL)
        
    async def analyze(self, request) -> Dict[str, Any]:
        """执行ADU可行性分析"""
        
        # Step 1: 制定分析计划
        plan = await self._create_plan(request)
        
        # Step 2: 执行搜索获取最新法规
        search_results = await self._search_regulations(request.address)
        
        # Step 3: 分析可行性
        analysis = await self._analyze_feasibility(request, search_results)
        
        # Step 4: 计算成本
        costs = await self._calculate_costs(request, analysis)
        
        # Step 5: 生成建议
        recommendations = await self._generate_recommendations(
            request, analysis, costs, search_results
        )
        
        return {
            "analysis_id": "adu_" + str(hash(request.address))[:8],
            "feasibility_score": analysis.get("score", 75.0),
            "total_cost": costs.get("total", 250000),
            "recommendations": recommendations,
            "search_results": search_results,
            "detailed_analysis": analysis,
            "cost_breakdown": costs
        }
    
    async def _create_plan(self, request) -> Dict[str, Any]:
        """制定分析计划"""
        prompt = f"""
        为以下ADU项目制定分析计划：
        地址: {request.address}
        地块: {request.lot_size_sqft}平方英尺
        预算: ${request.budget}
        
        需要考虑的要点：
        1. 管辖权和zoning
        2. 加州ADU法规（AB 68, SB 13）
        3. 成本估算
        4. 风险因素
        """
        
        response = await self.openai.create_completion(prompt)
        return {"plan": response}
    
    async def _search_regulations(self, address: str) -> Dict[str, Any]:
        """搜索最新法规"""
        prompt = f"Search for current ADU regulations in {address} California 2025"
        response = await self.search_agent.search_with_web(prompt)
        return {"regulations": response}
    
    async def _analyze_feasibility(self, request, search_results) -> Dict[str, Any]:
        """分析可行性"""
        return {
            "score": 85.0,
            "factors": {
                "zoning": "允许ADU",
                "lot_size": "足够",
                "setbacks": "符合要求"
            }
        }
    
    async def _calculate_costs(self, request, analysis) -> Dict[str, Any]:
        """计算成本"""
        base_cost = 200 * request.lot_size_sqft * 0.15  # 简化计算
        return {
            "construction": base_cost,
            "permits": base_cost * 0.15,
            "total": base_cost * 1.25
        }
    
    async def _generate_recommendations(self, request, analysis, costs, search) -> Dict:
        """生成建议"""
        return {
            "feasible": True,
            "recommended_type": request.adu_type_preference,
            "estimated_timeline": "6-9个月",
            "key_steps": [
                "确认zoning允许",
                "提交设计方案",
                "申请建筑许可",
                "开始施工"
            ],
            "risks": ["施工延期", "成本超支"],
            "opportunities": ["租金收入", "房产增值"]
        }
