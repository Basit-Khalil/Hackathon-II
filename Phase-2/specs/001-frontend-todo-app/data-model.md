# Data Model: Phase II – Todo Full-Stack Web Application (Frontend)

## User Entity

**Fields**:
- `id`: string - Unique identifier for the user
- `email`: string - User's email address (unique)
- `name`: string - User's display name
- `createdAt`: string - ISO timestamp of account creation
- `updatedAt`: string - ISO timestamp of last update

**Validation**:
- Email must be valid email format
- Email must be unique
- Name must be 1-50 characters

## Task Entity

**Fields**:
- `id`: string - Unique identifier for the task
- `title`: string - Task title (required)
- `description`: string - Optional task description
- `completed`: boolean - Task completion status
- `createdAt`: string - ISO timestamp of task creation
- `updatedAt`: string - ISO timestamp of last update
- `userId`: string - Reference to the user who owns the task

**Validation**:
- Title must be 1-200 characters
- Description can be empty or 1-1000 characters
- Completed defaults to false
- userId must reference an existing user

## State Transitions

**Task States**:
- Pending (completed: false) → Completed (completed: true)
- Completed (completed: true) → Pending (completed: false)

**User Authentication States**:
- Unauthenticated → Authenticated (on successful login/signup)
- Authenticated → Unauthenticated (on logout/expired session)

## Relationships

- One User to Many Tasks (one-to-many)
- Each Task belongs to exactly one User