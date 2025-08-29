from typing import Any, Dict, List
from openai import OpenAI
from .config import get_settings

_settings = get_settings()

_client = OpenAI(api_key=_settings.openai_api_key, base_url=_settings.openai_base_url)

def responses_create(**kwargs):
    return _client.responses.create(**kwargs)
