# Testing Instructions for ADU Deep Research System

## Quick Start

1. **Install Jupyter if needed:**
```bash
pip install jupyter notebook
```

2. **Set environment variables:**
```bash
export OPENAI_API_KEY="your-api-key-here"
export ORCHESTRATOR_MODEL="gpt-4o"  # Use gpt-4o instead of gpt-5 for now
export SEARCH_MODEL="gpt-4o-mini"    # Use gpt-4o-mini for testing
```

3. **Start Jupyter Notebook:**
```bash
cd backend_services/app-adu-deep-research-o
jupyter notebook test_adu_system.ipynb
```

4. **Run cells in order:**
   - First run cells 1-5 (no API needed) to test basic functionality
   - Then run cells 6-8 (requires API) to test AI agents
   - Finally run cells 9-10 for edge cases and mock testing

## Test Sections

### Without API Key (Sections 1-5, 9-10):
- ✅ Environment setup check
- ✅ Module import verification  
- ✅ Cost calculation testing
- ✅ Finance calculation testing
- ✅ Mock data testing

### With API Key (Sections 6-8):
- 🔑 Searcher agent (real web search)
- 🔑 Orchestrator agent (GPT-5 planning)
- 🔑 End-to-end API flow

## Common Issues & Solutions

### Issue: Import errors
**Solution:** Make sure you're in the correct directory:
```bash
cd backend_services/app-adu-deep-research-o
```

### Issue: API key not found
**Solution:** Set the environment variable before starting Jupyter:
```bash
export OPENAI_API_KEY="sk-..."
jupyter notebook
```

### Issue: Model not available (gpt-5)
**Solution:** Use gpt-4o as fallback:
```bash
export ORCHESTRATOR_MODEL="gpt-4o"
```

### Issue: Responses API not available
**Solution:** The `responses.create()` API might not be available yet. You can modify `llm.py` to use standard chat completion:
```python
# In app/llm.py, replace responses_create with:
def responses_create(**kwargs):
    # Fallback to chat completion
    return _client.chat.completions.create(
        model=kwargs.get('model', 'gpt-4o'),
        messages=kwargs.get('input', []),
        tools=kwargs.get('tools', None),
        response_format=kwargs.get('response_format', None)
    )
```

## Expected Results

### Cost Module Test:
- Basic ADU (750 sqft): ~$200,000-250,000
- With risks (hillside, etc): ~$250,000-350,000

### Finance Module Test:
- Monthly rent: ~$2,100
- ROI: 3-5%
- Payback: 15-25 years

### Searcher Agent Test:
- Should return jurisdiction, zoning, rules, risks, fees
- Should include citations with URLs

### Orchestrator Agent Test:
- Should generate a markdown plan
- Should call cost/finance tools
- Should produce actionable recommendations