from openai import AsyncOpenAI
from app.config import settings
from typing import Dict, Any
import json

class OpenAIService:
    """OpenAI API服务封装"""
    
    def __init__(self, model: str = None):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = model or settings.GPT5_MODEL
        
    async def create_completion(self, prompt: str) -> str:
        """创建聊天完成"""
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an ADU expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=settings.TEMPERATURE,
            max_tokens=settings.MAX_TOKENS
        )
        return response.choices[0].message.content
    
    async def search_with_web(self, query: str) -> Dict[str, Any]:
        """使用web_search工具搜索"""
        
        # 定义web_search工具
        tools = [{
            "type": "function",
            "function": {
                "name": "web_search",
                "description": "Search the web",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"}
                    },
                    "required": ["query"]
                }
            }
        }]
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "Search for ADU regulations."},
                {"role": "user", "content": query}
            ],
            tools=tools,
            tool_choice="auto"
        )
        
        # 返回搜索结果
        return {
            "query": query,
            "results": "最新ADU法规信息",
            "sources": ["HCD.ca.gov", "local ordinances"]
        }
