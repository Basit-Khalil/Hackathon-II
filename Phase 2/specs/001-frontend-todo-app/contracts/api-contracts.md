# API Contracts: Phase II – Todo Full-Stack Web Application (Frontend)

## Authentication Endpoints

### POST /api/auth/signup
**Description**: Create a new user account
**Request**:
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }
  ```
**Response**:
- Success: `201 Created`
  ```json
  {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token-string"
  }
  ```
- Error: `400 Bad Request` (validation error) or `409 Conflict` (email exists)

### POST /api/auth/login
**Description**: Authenticate user and return JWT token
**Request**:
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
**Response**:
- Success: `200 OK`
  ```json
  {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token-string"
  }
  ```
- Error: `400 Bad Request` (validation error) or `401 Unauthorized` (invalid credentials)

### POST /api/auth/logout
**Description**: Invalidate user session
**Request**:
- Headers: `Authorization: Bearer {jwt-token}`
**Response**:
- Success: `200 OK`
  ```json
  {
    "message": "Successfully logged out"
  }
  ```

## Task Management Endpoints

### GET /api/{user_id}/tasks
**Description**: Retrieve all tasks for a specific user
**Request**:
- Headers: `Authorization: Bearer {jwt-token}`
**Response**:
- Success: `200 OK`
  ```json
  {
    "tasks": [
      {
        "id": "task-uuid",
        "title": "Task title",
        "description": "Task description",
        "completed": false,
        "createdAt": "2026-01-05T10:00:00Z",
        "updatedAt": "2026-01-05T10:00:00Z",
        "userId": "user-uuid"
      }
    ]
  }
  ```
- Error: `401 Unauthorized` (invalid token) or `403 Forbidden` (access denied)

### POST /api/{user_id}/tasks
**Description**: Create a new task for the user
**Request**:
- Headers: `Authorization: Bearer {jwt-token}`, `Content-Type: application/json`
- Body:
  ```json
  {
    "title": "New task title",
    "description": "Task description (optional)"
  }
  ```
**Response**:
- Success: `201 Created`
  ```json
  {
    "task": {
      "id": "task-uuid",
      "title": "New task title",
      "description": "Task description (optional)",
      "completed": false,
      "createdAt": "2026-01-05T10:00:00Z",
      "updatedAt": "2026-01-05T10:00:00Z",
      "userId": "user-uuid"
    }
  }
  ```
- Error: `401 Unauthorized` (invalid token) or `403 Forbidden` (access denied)

### PUT /api/{user_id}/tasks/{task_id}
**Description**: Update an existing task
**Request**:
- Headers: `Authorization: Bearer {jwt-token}`, `Content-Type: application/json`
- Body:
  ```json
  {
    "title": "Updated task title",
    "description": "Updated description",
    "completed": true
  }
  ```
**Response**:
- Success: `200 OK`
  ```json
  {
    "task": {
      "id": "task-uuid",
      "title": "Updated task title",
      "description": "Updated description",
      "completed": true,
      "createdAt": "2026-01-05T10:00:00Z",
      "updatedAt": "2026-01-05T11:00:00Z",
      "userId": "user-uuid"
    }
  }
  ```
- Error: `401 Unauthorized` (invalid token), `403 Forbidden` (access denied), or `404 Not Found` (task not found)

### DELETE /api/{user_id}/tasks/{task_id}
**Description**: Delete a task
**Request**:
- Headers: `Authorization: Bearer {jwt-token}`
**Response**:
- Success: `200 OK`
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```
- Error: `401 Unauthorized` (invalid token), `403 Forbidden` (access denied), or `404 Not Found` (task not found)

### PATCH /api/{user_id}/tasks/{task_id}/complete
**Description**: Mark a task as complete/incomplete
**Request**:
- Headers: `Authorization: Bearer {jwt-token}`, `Content-Type: application/json`
- Body:
  ```json
  {
    "completed": true
  }
  ```
**Response**:
- Success: `200 OK`
  ```json
  {
    "task": {
      "id": "task-uuid",
      "title": "Task title",
      "description": "Task description",
      "completed": true,
      "createdAt": "2026-01-05T10:00:00Z",
      "updatedAt": "2026-01-05T11:00:00Z",
      "userId": "user-uuid"
    }
  }
  ```
- Error: `401 Unauthorized` (invalid token), `403 Forbidden` (access denied), or `404 Not Found` (task not found)