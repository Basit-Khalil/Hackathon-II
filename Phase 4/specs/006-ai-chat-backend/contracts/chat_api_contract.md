# API Contract: Chat Endpoint

## Endpoint: POST /api/{user_id}/chat

### Description
Main chat endpoint for the AI chatbot. Processes natural language user messages and returns structured responses with potential tool calls.

### Path Parameters
- `user_id` (integer, required): The ID of the user sending the message

### Request Body
```json
{
  "message": "string (required): The user's message to the AI assistant"
}
```

### Response Body
```json
{
  "conversation_id": "integer: The ID of the conversation",
  "response": "string: The AI assistant's response to the user",
  "tool_calls": [
    {
      "tool_name": "string: Name of the MCP tool called",
      "parameters": "object: Parameters passed to the tool",
      "result": {
        "success": "boolean: Whether the tool call was successful",
        "data": "object: Result data from the tool call"
      }
    }
  ]
}
```

### Success Response (200 OK)
- Status: 200
- Content-Type: application/json
- Body: Structured response as defined above

### Error Responses
- 400 Bad Request: Invalid request format
- 401 Unauthorized: Invalid or missing authentication
- 403 Forbidden: User attempting to access another user's data
- 500 Internal Server Error: Server error during processing

### Example Request
```json
{
  "message": "Add a task to buy groceries"
}
```

### Example Response
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

### Security Requirements
- Validates user_id matches authenticated user
- Ensures user can only access their own conversations
- Implements rate limiting to prevent abuse