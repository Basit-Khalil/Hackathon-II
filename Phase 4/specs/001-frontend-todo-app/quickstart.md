# Quickstart Guide: Phase II – Todo Full-Stack Web Application (Frontend)

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Access to the backend API (JWT-secured FastAPI server)

## Setup Instructions

### 1. Clone and Initialize
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install
```

### 2. Environment Configuration
Create a `.env.local` file in the frontend root with the following variables:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Key Features

### Authentication
- User signup and login via Better Auth
- JWT token automatically attached to API requests
- Protected routes for authenticated users only

### Task Management
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Responsive UI for desktop and mobile

### API Integration
- Centralized API client handles all backend communication
- Automatic JWT token management
- Error handling for 401/403 responses

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── lib/                   # API client and utility functions
├── hooks/                 # Custom React hooks
└── styles/                # Global styles
```

## Running Tests

```bash
# Run unit tests
npm test
# or
yarn test

# Run end-to-end tests
npm run test:e2e
# or
yarn test:e2e
```

## Building for Production

```bash
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
```

## API Endpoints Used

The frontend communicates with these backend endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/{user_id}/tasks` - Get user's tasks
- `POST /api/{user_id}/tasks` - Create new task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle task completion

## Troubleshooting

### Common Issues
- **API Connection Errors**: Verify backend server is running and `NEXT_PUBLIC_API_BASE_URL` is correct
- **Authentication Failures**: Check JWT configuration and secret keys match between frontend and backend
- **JWT Token Not Attached**: Ensure API client is properly configured with token handling

### Development Tips
- Use server components by default; only use client components when interactivity is needed
- All API calls should go through the centralized API client in `lib/api.ts`
- Authentication state is managed consistently across routes