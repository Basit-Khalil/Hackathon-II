# Backend Integration Guide

This document explains how to integrate the frontend with the backend API.

## API Base URL

The backend API is served at: `http://localhost:8000` (for development)

## API Endpoints

All endpoints require a valid JWT token in the Authorization header: `Authorization: Bearer <token>`

### Task Management

- `GET /api/v1/tasks` - Get all tasks for the authenticated user
- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks/{task_id}` - Get a specific task
- `PUT /api/v1/tasks/{task_id}` - Update a task
- `DELETE /api/v1/tasks/{task_id}` - Delete a task
- `PATCH /api/v1/tasks/{task_id}/complete` - Update task completion status

## Authentication

1. The frontend should obtain JWT tokens from Better Auth
2. Include the JWT token in the Authorization header for all API requests
3. The backend will extract the user ID from the JWT token to ensure proper task ownership
4. Handle 401 (Unauthorized) and 403 (Forbidden) responses appropriately

## Frontend Configuration

Update your frontend `.env.local` file to include:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Database Configuration

Make sure your `.env` file in the backend directory contains:

```
BETTER_AUTH_SECRET=your_better_auth_secret
DATABASE_URL=your_postgresql_connection_string
```

## Running the Backend

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

## Troubleshooting

- If you get 401 errors, verify that your JWT token is valid and not expired
- If you get 403 errors, verify that the token has the correct user permissions
- If you get database errors, verify that your DATABASE_URL is properly configured
- If API calls fail, make sure the backend server is running and accessible