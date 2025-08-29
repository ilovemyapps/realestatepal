import json
from ..llm import responses_create
from ..config import get_settings
from ..schemas import SearchBundle, AnalyzeResult, CostBreakdown, FinanceResult
from ..tools.costs import compute_costs, CostInputs
from ..tools.finance import estimate_rent, compute_finance
from .prompts import ORCH_SYSTEM

S = get_settings()

def build_tools():
    # Expose local python functions as "function" tools for the model to call if needed
    return [
        {
            "type": "function",
            "function": {
                "name": "compute_costs",
                "description": "Compute ADU capex breakdown from inputs",
                "parameters": {
                    "type":"object",
                    "properties":{
                        "adu_type":{"type":"string"},
                        "size_sqft":{"type":"integer"},
                        "hillside":{"type":"boolean"},
                        "vhfhsz":{"type":"boolean"},
                        "historic":{"type":"boolean"},
                        "sprinklers_required":{"type":"boolean"},
                        "separate_meter":{"type":"boolean"}
                    },
                    "required":["adu_type","size_sqft"],
                    "additionalProperties": False
                }
            }
        },
        {
            "type":"function",
            "function":{
                "name":"compute_finance",
                "description":"Compute ROI based on capex_total and rent estimate",
                "parameters": {
                    "type":"object",
                    "properties":{
                        "capex_total":{"type":"number"},
                        "rent_monthly":{"type":"number"}
                    },
                    "required":["capex_total","rent_monthly"],
                    "additionalProperties": False
                }
            }
        }
    ]

def run(address: str, targets: dict, search: SearchBundle) -> AnalyzeResult:
    # Prepare defaults for cost inputs from search risks/rules
    risk = search.risks or {}
    rules = search.rules or {}

    cost_inputs = CostInputs(
        adu_type = targets.get("adu_type") or "detached",
        size_sqft = int(targets.get("size_sqft") or 750),
        hillside = bool(risk.get("hillside", False)),
        vhfhsz = bool(risk.get("wildfire_vhfhsz", False)),
        historic = bool(risk.get("historic_district", False)),
        sprinklers_required = bool(rules.get("sprinklers_required", False)),
        separate_meter = bool(rules.get("separate_meter_suggested", False)),
    )
    costs_dict = compute_costs(cost_inputs)
    rent = estimate_rent(zipcode=search.jurisdiction.get("zipcode"), size_sqft=cost_inputs.size_sqft)
    finance_dict = compute_finance(costs_dict["total_cost"], rent)

    # Ask the model to synthesize a user-facing Markdown plan
    r = responses_create(
        model=S.orchestrator_model,
        input=[
            {"role":"system","content": ORCH_SYSTEM},
            {"role":"user","content": json.dumps({
                "address": address,
                "targets": targets,
                "search": search.model_dump(),
                "costs": costs_dict,
                "finance": finance_dict
            })}
        ],
        response_format={"type":"text"} # Markdown
    )
    # Extract text
    try:
        plan_md = r.output_text
    except Exception:
        plan_md = r.output[0].content[0].text

    return AnalyzeResult(
        search=search,
        costs=CostBreakdown(**costs_dict),
        finance=FinanceResult(**finance_dict),
        plan_md=plan_md
    )
