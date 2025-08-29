from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from .schemas import AnalyzeRequest, AnalyzeResult
from .agents.searcher import search_everything
from .agents.orchestrator import run as orchestrate

app = FastAPI(title="ADU Deep Research API", version="0.1.0")

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/analyze", response_model=AnalyzeResult)
async def analyze(req: AnalyzeRequest):
    try:
        search = search_everything(req.address, req.user_overrides or {})
        result = orchestrate(req.address, req.targets.model_dump(), search)
        return JSONResponse(result.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
