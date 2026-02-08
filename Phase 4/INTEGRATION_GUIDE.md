# Frontend-Backend Integration Guide

This document provides step-by-step instructions for integrating the frontend with the completed backend API.

## Overview

The backend is a complete FastAPI application that provides secure JWT-authenticated endpoints for todo task management. It enforces strict user isolation and integrates seamlessly with the existing frontend.

## Backend Setup

### 1. Environment Configuration

Make sure your backend `.env` file is properly configured:

```env
BETTER_AUTH_SECRET=DL6c7isj20QA8nZmBwaX1g3M4tSwVojY
DATABASE_URL=postgresql://neondb_owner:npg_EL7yCdJv2kTf@ep-polished-silence-ahtddtn4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Initialize Database

```bash
python init_db.py
```

### 4. Start Backend Server

```bash
uvicorn main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

## Frontend Configuration

### 1. Update Environment Variables

Update your frontend `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 2. Verify API Client Compatibility

The backend endpoints are designed to match the existing frontend API client in `frontend/lib/api.ts`:

- `GET /api/v1/tasks` - Get all tasks for authenticated user
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/{task_id}` - Get specific task
- `PUT /api/v1/tasks/{task_id}` - Update task
- `DELETE /api/v1/tasks/{task_id}` - Delete task
- `PATCH /api/v1/tasks/{task_id}/complete` - Update completion status

## Authentication Flow

1. The frontend should obtain JWT tokens from Better Auth
2. The tokens are automatically included in the Authorization header by the existing `frontend/lib/api.ts` client
3. The backend extracts the user ID from the JWT token to ensure proper task ownership
4. All responses will properly handle 401/403 errors by triggering re-authentication in the frontend

## Testing the Integration

### 1. Start Both Servers

Backend:
```bash
cd "E:\Hackathon 2\Phase 2"
uvicorn main:app --reload --port 8000
```

Frontend:
```bash
cd "E:\Hackathon 2\Phase 2\frontend"
npm run dev
```

### 2. Verify API Communication

1. Log into the frontend application
2. Try creating a new task - it should appear in the task list
3. Try updating a task - the changes should persist
4. Try marking a task as complete/incomplete - the status should update
5. Try deleting a task - it should disappear from the list

### 3. Verify User Isolation

- Each user should only see their own tasks
- Users should not be able to access or modify other users' tasks
- All operations should be properly authenticated

## Troubleshooting

### Common Issues

1. **API calls failing with 401 errors**:
   - Verify that JWT tokens are being properly obtained from Better Auth
   - Check that the BETTER_AUTH_SECRET matches between frontend and backend

2. **Database connection errors**:
   - Verify that the DATABASE_URL is properly formatted in the .env file
   - Check that the Neon PostgreSQL database is accessible

3. **CORS errors**:
   - Ensure the backend allows requests from the frontend origin
   - Check that both servers are running on the expected ports

4. **Task operations not working**:
   - Verify that the API endpoints match between frontend and backend
   - Check that the Authorization header is being properly set

### Verification Steps

Run the backend verification script:
```bash
python test_backend_imports.py
```

## Production Deployment

### Backend Environment Variables

For production deployment, ensure these environment variables are set:
- `BETTER_AUTH_SECRET`: Your Better Auth secret key
- `DATABASE_URL`: PostgreSQL connection string for production database

### API Base URL

Update the frontend's `NEXT_PUBLIC_API_BASE_URL` to point to your deployed backend URL.

## Security Considerations

- The backend enforces user isolation at the database level
- All endpoints require valid JWT authentication
- No user data can be accessed by unauthorized users
- The user ID is extracted from JWT tokens, preventing user ID spoofing

## Next Steps

1. Complete the backend setup following the steps above
2. Test the integration thoroughly with the frontend
3. Verify all functionality works as expected
4. Deploy both frontend and backend to production
5. Update environment variables for production deployment

The integration is now complete and ready for testing!
