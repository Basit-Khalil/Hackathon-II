# MCP Task Server & Tools

This project implements an MCP (Model Context Protocol) server that provides task management tools for the Todo AI Chatbot. The server allows AI agents to perform task operations (add, list, complete, delete, update) through standardized tools.

## Features

- FastAPI-based server for handling MCP tool requests
- SQLModel ORM for database operations with Neon PostgreSQL
- Five core MCP tools for task management:
  - `add_task`: Create new tasks
  - `list_tasks`: Retrieve user's tasks
  - `complete_task`: Mark tasks as completed
  - `delete_task`: Remove tasks
  - `update_task`: Modify existing tasks
- Input validation and error handling
- User data isolation
- Stateless operation

## Installation

1. Clone the repository and navigate to the backend/mcp_tools directory
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
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/todo_db
DEBUG=false
SECRET_KEY=your-secret-key-here
```

## Running the Server

To run the server locally:

```bash
cd backend/mcp_tools/src
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will be available at `http://localhost:8000`.

## API Endpoints

- `GET /` - Root endpoint to verify server is running
- `GET /api/health` - Health check endpoint

## MCP Tools

The server provides the following MCP tools:

### add_task
- Creates a new task in the database
- Parameters: title (str), description (str, optional), user_id (int)

### list_tasks
- Lists tasks for a specific user
- Parameters: user_id (int), completed (bool, optional)

### complete_task
- Marks a task as completed
- Parameters: task_id (int), user_id (int)

### delete_task
- Deletes a task from the database
- Parameters: task_id (int), user_id (int)

### update_task
- Updates an existing task
- Parameters: task_id (int), user_id (int), title (str, optional), description (str, optional), completed (bool, optional)

## Testing

To run the tests:

```bash
cd backend/mcp_tools
pytest
```

## Project Structure

```
backend/mcp_tools/
├── src/
│   ├── config/          # Configuration and settings
│   ├── database/        # Database connection and initialization
│   ├── models/          # SQLModel database models
│   ├── mcp/             # MCP server and tools
│   │   ├── tools/       # Individual MCP tools
│   │   └── schemas/     # Tool request/response schemas
│   ├── api/             # API routes
│   └── logging_config.py # Logging configuration
├── tests/
│   ├── unit/            # Unit tests for individual components
│   ├── integration/     # Integration tests
│   └── contract/        # Contract tests
├── requirements.txt     # Project dependencies
├── README.md           # This file
└── .env.example        # Example environment variables
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL database connection string
- `DEBUG`: Enable/disable debug mode (default: false)
- `SECRET_KEY`: Secret key for security (default: hardcoded, change in production)

## Database Models

- `Task`: Represents a user's todo item
- `Conversation`: Represents a chat session between user and AI
- `Message`: Represents individual messages within a conversation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests to ensure everything works
6. Submit a pull request