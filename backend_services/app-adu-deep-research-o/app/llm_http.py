"""
Alternative LLM module using direct HTTP requests
Use this if the SDK has connection issues
"""

import os
import json
import requests
from typing import Any, Dict, List
from .config import get_settings

_settings = get_settings()

class HTTPOpenAIClient:
    def __init__(self, api_key: str, base_url: str = None):
        self.api_key = api_key
        self.base_url = base_url or "https://api.openai.com/v1"
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def responses_create(self, **kwargs):
        """Direct HTTP implementation of responses.create()"""
        
        # Prepare request data
        data = {
            "model": kwargs.get('model', 'gpt-4o-mini'),
            "input": kwargs.get('input', []),
        }
        
        # Add optional parameters
        if 'tools' in kwargs:
            data['tools'] = kwargs['tools']
        if 'response_format' in kwargs:
            data['response_format'] = kwargs['response_format']
        if 'temperature' in kwargs:
            data['temperature'] = kwargs['temperature']
        
        # Make HTTP request
        try:
            response = requests.post(
                f"{self.base_url}/responses",
                headers=self.headers,
                json=data,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                return MockResponse(result)
            else:
                # Fallback to chat completions if responses endpoint fails
                return self._fallback_to_chat(kwargs)
                
        except Exception as e:
            print(f"Responses API error: {e}, falling back to chat completions")
            return self._fallback_to_chat(kwargs)
    
    def _fallback_to_chat(self, kwargs):
        """Fallback to chat completions API"""
        data = {
            "model": kwargs.get('model', 'gpt-4o-mini'),
            "messages": kwargs.get('input', []),
        }
        
        # Handle response format for JSON
        response_format = kwargs.get('response_format', {})
        if response_format.get('type') == 'json_schema':
            data['response_format'] = {"type": "json_object"}
            # Add schema instruction to the last message
            schema = response_format.get('json_schema', {}).get('schema', {})
            if data['messages']:
                data['messages'][-1]['content'] += f"\n\nReturn a JSON object matching this schema: {json.dumps(schema)}"
        
        # Add tools if present (as functions)
        if 'tools' in kwargs:
            function_tools = []
            for tool in kwargs['tools']:
                if tool.get('type') == 'web_search_preview':
                    # Note: web_search won't actually work without special access
                    # You'd need to use an external service like Tavily here
                    pass
                else:
                    function_tools.append(tool)
            if function_tools:
                data['tools'] = function_tools
                data['tool_choice'] = 'auto'
        
        response = requests.post(
            f"{self.base_url}/chat/completions",
            headers=self.headers,
            json=data,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            # Convert chat completion to responses format
            return self._convert_chat_to_responses(result)
        else:
            raise Exception(f"API error: {response.status_code} - {response.text}")
    
    def _convert_chat_to_responses(self, chat_result):
        """Convert chat completion result to responses format"""
        content = chat_result['choices'][0]['message']['content']
        
        # Create responses-like structure
        mock_result = {
            'output': [{
                'content': [{
                    'text': content,
                    'type': 'output_text'
                }]
            }]
        }
        
        return MockResponse(mock_result)


class MockResponse:
    """Mock response object to match expected interface"""
    def __init__(self, result):
        self.raw_result = result
        self.output = self._parse_output(result)
        self.output_text = self._extract_text(result)
    
    def _parse_output(self, result):
        """Parse the output structure"""
        if 'output' in result:
            # Real responses API format
            output_items = []
            for item in result.get('output', []):
                content_items = []
                for content in item.get('content', []):
                    content_obj = MockContent(
                        text=content.get('text', ''),
                        content_type=content.get('type', 'output_text')
                    )
                    content_items.append(content_obj)
                output_items.append(MockOutputItem(content_items))
            return output_items
        else:
            # Fallback format
            return [MockOutputItem([MockContent(self.output_text)])]
    
    def _extract_text(self, result):
        """Extract text from result"""
        if 'output' in result:
            # Real responses API
            for item in result.get('output', []):
                for content in item.get('content', []):
                    if content.get('type') == 'output_text':
                        return content.get('text', '')
        elif 'choices' in result:
            # Chat completion fallback
            return result['choices'][0]['message']['content']
        return ''


class MockOutputItem:
    def __init__(self, content):
        self.content = content


class MockContent:
    def __init__(self, text='', content_type='output_text'):
        self.text = text
        self.type = content_type
        # Try to parse as JSON if it looks like JSON
        if text and text.strip().startswith('{'):
            try:
                self.data = json.loads(text)
            except:
                self.data = {}
        else:
            self.data = {}


# Create global client instance
_client = HTTPOpenAIClient(
    api_key=_settings.openai_api_key,
    base_url=_settings.openai_base_url
)

def responses_create(**kwargs):
    """Main function to call - uses HTTP client"""
    return _client.responses_create(**kwargs)