from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache

class Settings(BaseSettings):
    # 基本配置
    PROJECT_NAME: str = "ADU Deep Research System"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    
    # OpenAI配置
    OPENAI_API_KEY: str
    GPT5_MODEL: str = "gpt-5"
    GPT4O_MINI_MODEL: str = "gpt-4o-mini-search-preview"
    
    # 请求配置
    MAX_TOKENS: int = 4000
    TEMPERATURE: float = 0.7
    SEARCH_TEMPERATURE: float = 0.3
    REQUEST_TIMEOUT: int = 60
    MAX_RETRIES: int = 3
    
    # ADU配置
    MAX_ADU_SIZE_SQFT: int = 1200
    MIN_ADU_SIZE_SQFT: int = 150
    DEFAULT_SETBACK_FEET: int = 4
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
