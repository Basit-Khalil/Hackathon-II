# Todo Backend API

This is a secure, production-ready FastAPI backend for the Todo web application. It provides JWT-secured REST APIs for todo task management with strict user data isolation.

## Features

- JWT-based authentication using Better Auth shared secret
- User isolation - each user can only access their own tasks
- Full CRUD operations for todo tasks
- Persistent storage with Neon Serverless PostgreSQL
- Proper error handling with appropriate HTTP status codes

## Endpoints

All endpoints require a valid JWT token in the Authorization header: `Authorization: Bearer <token>`

### Task Management

- `GET /api/v1/tasks` - Get all tasks for the authenticated user
- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks/{task_id}` - Get a specific task
- `PUT /api/v1/tasks/{task_id}` - Update a task
- `DELETE /api/v1/tasks/{task_id}` - Delete a task
- `PATCH /api/v1/tasks/{task_id}/complete` - Update task completion status

The user ID is automatically extracted from the JWT token, ensuring proper task ownership without requiring the user ID in the URL.

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
DATABASE_URL=your_postgresql_connection_string
```

## Installation

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Create the database tables:
   ```bash
   python init_db.py
   ```

3. Run the application:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

## Frontend Integration

To integrate with the frontend:

1. The frontend should obtain JWT tokens from Better Auth
2. Include the JWT token in the Authorization header for all API requests
3. Ensure the user ID in the API URL matches the user ID in the JWT token
4. Handle 401 (Unauthorized) and 403 (Forbidden) responses appropriately

## Security

- All endpoints require valid JWT authentication
- User data isolation is enforced at the API and database level
- The URL user_id is validated against the JWT token's user_id
- Proper error responses without internal information leakage