from .prompts import SEARCH_SYSTEM
from ..llm import responses_create
from ..config import get_settings
from ..schemas import SearchBundle, Citation
import json

S = get_settings()

def search_everything(address: str, user_overrides: dict) -> SearchBundle:
    # Use Responses API + web_search tool to fetch latest rules/fees with citations
    response = responses_create(
        model=S.search_model,
        input=[
            {"role": "system", "content": SEARCH_SYSTEM},
            {"role": "user", "content": json.dumps({"address": address, "user_overrides": user_overrides})},
        ],
        tools=[{"type": "web_search_preview"}],
        response_format={
            "type":"json_schema",
            "json_schema": {
                "name":"search_bundle_schema",
                "schema": {
                    "type":"object",
                    "additionalProperties": False,
                    "properties": {
                        "jurisdiction":{"type":"object"},
                        "zoning":{"type":"object"},
                        "rules":{"type":"object"},
                        "risks":{"type":"object"},
                        "fees":{"type":"object"},
                        "citations":{
                            "type":"array",
                            "items":{
                                "type":"object",
                                "properties":{
                                    "title":{"type":["string","null"]},
                                    "url":{"type":"string"},
                                    "snippet":{"type":["string","null"]}
                                },
                                "required":["url"],
                                "additionalProperties": False
                            }
                        }
                    },
                    "required": ["jurisdiction","zoning","rules","risks","fees","citations"]
                },
                "strict": True
            }
        }
    )

    # The Responses API returns output items; we grab the final JSON
    try:
        content = response.output[0].content[0].text  # JSON string
        data = json.loads(content)
    except Exception:
        # Fallback if returned as object
        data = getattr(response.output[0].content[0], "data", {}) or {}

    citations = [Citation(**c) for c in data.get("citations", [])]
    return SearchBundle(
        jurisdiction=data.get("jurisdiction", {}),
        zoning=data.get("zoning", {}),
        rules=data.get("rules", {}),
        risks=data.get("risks", {}),
        fees=data.get("fees", {}),
        citations=citations,
    )
