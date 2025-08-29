# ADU Deep Research System - Technical Notes

## API Status (2025-08-29)

### ✅ Confirmed Working
- **API Key**: Valid and working
- **Responses API**: EXISTS and WORKS via direct HTTP
- **Endpoint**: `https://api.openai.com/v1/responses`
- **Models Available**: 
  - gpt-4o-mini ✅
  - gpt-4o ✅
  - gpt-3.5-turbo ✅

### ⚠️ Known Issues

1. **Python SDK Connection Problem**
   - OpenAI SDK v1.97.0 has `client.responses.create()` method
   - But encounters "Connection error" when called
   - Direct HTTP requests work fine
   - Issue appears to be conda/environment related

2. **Model Names**
   - gpt-5: Not available (returns 400)
   - gpt-5-nano: Listed in models but returns 400 when used
   - gpt-4o-mini-search-preview: May not exist

### 🔧 Solutions

#### Option 1: Use Direct HTTP (Recommended for POC)
```python
import requests

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

data = {
    "model": "gpt-4o-mini",
    "input": [{"role": "user", "content": "Your query"}],
    "tools": [{"type": "web_search_preview"}]
}

response = requests.post(
    'https://api.openai.com/v1/responses',
    headers=headers,
    json=data
)
```

#### Option 2: Fix SDK Environment
```bash
# Create clean virtual environment
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Option 3: Modify llm.py for HTTP fallback
Replace the SDK call with direct HTTP when connection errors occur.

## Testing Results

### Cost Calculation Module ✅
- Works correctly
- 750 sqft detached ADU: ~$243,450
- Includes risk factors (hillside, wildfire, etc.)

### Finance Module ✅
- ROI calculation: ~6.9%
- Payback period: ~14.5 years
- Monthly rent estimation: $2,100

### Searcher Agent ⚠️
- Code structure correct
- Needs working Responses API connection
- web_search tool requires special access or alternative (Tavily, Serper)

### Orchestrator Agent ⚠️
- Function calling structure correct
- Works with mock data
- Needs Responses API for full functionality

## Next Steps for POC

1. **Immediate Solution**: Modify llm.py to use direct HTTP requests
2. **Environment Fix**: Create fresh venv without conda interference
3. **Web Search Alternative**: Consider Tavily or Serper API for web search
4. **Model Configuration**: Use gpt-4o and gpt-4o-mini instead of gpt-5

## Environment Variables (.env)
```bash
OPENAI_API_KEY=your_key_here
ORCHESTRATOR_MODEL=gpt-4o      # Use instead of gpt-5
SEARCH_MODEL=gpt-4o-mini       # Use instead of search-preview variant
```