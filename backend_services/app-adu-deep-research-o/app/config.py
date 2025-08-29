from pydantic import BaseModel
from functools import lru_cache
from typing import Union, Optional
import os

class Settings(BaseModel):
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_base_url: Optional[str] = os.getenv("OPENAI_BASE_URL") or None
    orchestrator_model: str = os.getenv("ORCHESTRATOR_MODEL", "gpt-5")
    search_model: str = os.getenv("SEARCH_MODEL", "gpt-4o-mini-search-preview")

@lru_cache
def get_settings() -> Settings:
    return Settings()
