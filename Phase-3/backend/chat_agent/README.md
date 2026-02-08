# AI Chat Agent for Todo AI Chatbot

This project implements an AI chat agent that processes natural language commands and translates them into task operations using MCP tools. The agent integrates with OpenAI's API to understand user intents and execute appropriate task management actions.

## Features

- Natural language processing through OpenAI Agents SDK
- Integration with existing MCP tools for task operations
- Stateless execution with conversation history stored in database
- Support for multiple tool calls per user request
- Comprehensive error handling and confirmation messages
- Structured response format: {conversation_id, response, tool_calls}

## Installation

1. Clone the repository and navigate to the backend/chat_agent directory
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

Create a `.env` file in the root of the project with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/todo_db
DEBUG=false
SECRET_KEY=your-secret-key-here
```

## Running the Service

To run the service locally:

```bash
cd backend/chat_agent/src
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The service will be available at `http://localhost:8000`.

## API Endpoints

- `GET /` - Root endpoint to verify service is running
- `POST /api/{user_id}/chat` - Main chat endpoint for processing natural language requests

### Chat Endpoint Usage

Send a POST request to `/api/{user_id}/chat` with the following JSON payload:

```json
{
  "message": "Add a task to buy groceries"
}
```

The service will respond with a structured response:

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
        "data": {
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

To run the tests:

```bash
cd backend/chat_agent
pytest
```

## Project Structure

```
backend/chat_agent/
├── src/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config/                 # Configuration and settings
│   │   └── settings.py
│   ├── database/              # Database connection and models
│   │   ├── __init__.py
│   │   └── session.py         # Database session management
│   ├── models/                # SQLModel definitions (copied from MCP tools)
│   │   ├── __init__.py
│   │   ├── task.py            # Task model
│   │   ├── conversation.py    # Conversation model
│   │   └── message.py         # Message model
│   ├── agents/                # AI agent implementation
│   │   ├── __init__.py
│   │   └── runner.py          # OpenAI Agent Runner
│   ├── tools/                 # Tools integration
│   │   ├── __init__.py
│   │   └── mcp_client.py      # Client for MCP tools
│   ├── api/                   # API routes
│   │   ├── __init__.py
│   │   └── chat.py            # Chat endpoint implementation
│   └── logging_config.py      # Logging configuration
├── tests/
│   ├── __init__.py
│   ├── unit/                  # Unit tests for individual components
│   ├── integration/           # Integration tests
│   └── contract/              # Contract tests
├── requirements.txt           # Project dependencies
├── README.md                 # This file
└── .env.example              # Example environment variables
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for accessing the AI services
- `DATABASE_URL`: PostgreSQL database connection string
- `DEBUG`: Enable/disable debug mode (default: false)
- `SECRET_KEY`: Secret key for security (default: hardcoded, change in production!)

## Supported Commands

The AI agent understands various natural language commands for task management:

- "Add a task to [task description]"
- "Create a task to [task description]"
- "Show me my tasks"
- "Show me my completed tasks"
- "Mark task [id or description] as complete"
- "Delete task [id or description]"
- "Update task [id or description] to [new description]"
- And more variations based on context

## Architecture

The system follows a stateless design where:
1. Each request fetches conversation history from the database
2. The AI agent processes the user's message with access to MCP tools
3. Tool calls are executed through the MCP tools interface
4. The assistant's response is stored in the database
5. A structured response is returned to the client

## Security

- User data isolation through user_id parameter validation
- Input sanitization for natural language processing
- Secure API key handling through environment variables
- Rate limiting considerations (to be implemented)