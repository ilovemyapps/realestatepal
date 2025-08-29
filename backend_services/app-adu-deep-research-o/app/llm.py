from typing import Any, Dict, List
from openai import OpenAI
from .config import get_settings
import logging

logger = logging.getLogger(__name__)
_settings = get_settings()

_client = OpenAI(api_key=_settings.openai_api_key, base_url=_settings.openai_base_url)

def responses_create(**kwargs):
    """
    Create a response using OpenAI API with automatic fallback to HTTP implementation.
    
    This function first attempts to use the OpenAI SDK. If that fails (which is common
    due to SDK connection issues), it automatically falls back to the direct HTTP
    implementation in llm_http.py.
    
    Args:
        **kwargs: Arguments to pass to the responses.create() method
        
    Returns:
        Response object from either SDK or HTTP implementation
    """
    try:
        # First attempt: Use OpenAI SDK
        logger.debug("Attempting to use OpenAI SDK for responses.create()")
        return _client.responses.create(**kwargs)
    except Exception as sdk_error:
        # Fallback: Use direct HTTP implementation
        logger.warning(f"OpenAI SDK failed: {sdk_error}. Falling back to HTTP implementation.")
        try:
            from . import llm_http
            return llm_http.responses_create(**kwargs)
        except Exception as http_error:
            logger.error(f"Both SDK and HTTP implementations failed. SDK error: {sdk_error}, HTTP error: {http_error}")
            # Re-raise the original SDK error if both fail
            raise sdk_error
