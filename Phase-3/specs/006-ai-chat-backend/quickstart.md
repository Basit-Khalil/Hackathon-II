# Quickstart: AI Chat Backend for Todo AI Chatbot

## Prerequisites
- Python 3.9+
- Access to OpenAI API
- Access to Neon PostgreSQL database
- Existing MCP tools infrastructure deployed

## Setup Instructions

### 1. Clone and Navigate
```bash
cd backend/mcp_tools
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
Create a `.env` file with the following variables:
```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/todo_db
DEBUG=false
```

### 4. Run the Service
```bash
cd src
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Usage

### Chat Endpoint
Send a POST request to:
```
POST /api/{user_id}/chat
Content-Type: application/json

{
  "message": "Add a task to buy groceries"
}
```

### Expected Response
```json
{
  "conversation_id": 123,
  "response": "I've added a task to buy groceries.",
  "tool_calls": [
    {
      "tool_name": "add_task",
      "parameters": {
        "title": "buy groceries",
        "user_id": 1
      },
      "result": {
        "success": true,
        "task": {
          "id": 456,
          "title": "buy groceries",
          "completed": false
        }
      }
    }
  ]
}
```

## Testing

### Run Unit Tests
```bash
cd backend/mcp_tools
pytest tests/unit/
```

### Run Integration Tests
```bash
cd backend/mcp_tools
pytest tests/integration/
```

## Architecture Overview

The system follows a stateless design where:
1. Each request fetches conversation history from the database
2. The AI agent processes the user's message with access to MCP tools
3. Tool calls are executed through the MCP tools interface
4. The assistant's response is stored in the database
5. A structured response is returned to the client