# Data Model: Todo Console Application

## Task Entity

### Fields
- **id**: integer (auto-incremented, unique)
  - Purpose: Unique identifier for each task
  - Constraints: Must be unique, auto-incremented from 1
  - Validation: Must be a positive integer

- **title**: string (required, non-empty)
  - Purpose: The main description of the task
  - Constraints: Required field, cannot be empty
  - Validation: Must contain at least one non-whitespace character

- **description**: string (optional)
  - Purpose: Additional details about the task
  - Constraints: Optional field, can be empty or null
  - Validation: Can be any string or empty

- **completed**: boolean (default = false)
  - Purpose: Tracks whether the task is completed
  - Constraints: Boolean value, defaults to false
  - Validation: Must be true or false

### Example Task Object
```python
{
    "id": 1,
    "title": "Complete project proposal",
    "description": "Write and submit the project proposal document",
    "completed": False
}
```

## Task Collection

### Structure
- **tasks**: List of Task entities
  - Purpose: Stores all tasks in memory during the session
  - Type: List/array of Task objects
  - Constraints: In-memory only, resets on application exit

### Operations
- **Add Task**: Append a new Task object to the list
- **View Tasks**: Iterate through the list to display all tasks
- **Update Task**: Find Task by ID and modify its properties
- **Delete Task**: Remove Task object from the list by ID
- **Toggle Completion**: Find Task by ID and flip the completed status

## Validation Rules

### Task Creation
- Title must be provided and not empty
- ID must be unique and auto-incremented
- Completed status defaults to false

### Task Update
- Task must exist (ID validation required)
- Title, if provided, must not be empty
- Description can be updated to any value (including empty)

### Task Deletion
- Task must exist (ID validation required)
- After deletion, IDs remain unchanged for other tasks

### Task Completion Toggle
- Task must exist (ID validation required)
- Completed status toggles from current value to opposite value