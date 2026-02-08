# CLI Interface Contract: Todo Console Application

## Overview
This contract defines the command-line interface interactions for the Todo Console Application. It specifies the user interface flow, input/output behavior, and error handling patterns.

## Menu Interface

### Main Menu Options
The application presents a numbered menu with 6 options:

```
1. Add task
2. View tasks
3. Update task
4. Delete task
5. Mark task complete / incomplete
6. Exit
```

### Menu Selection Interface
- **Input**: Single integer (1-6)
- **Output**: Action-specific prompt or exit
- **Error Handling**: Invalid input shows error message and re-displays menu

## Task Operations Interface

### Add Task Operation
- **Input Sequence**:
  1. Task title (required, non-empty)
  2. Task description (optional)
- **Output**: Success confirmation with assigned task ID
- **Error Handling**: Empty title shows error, re-prompts for valid input

### View Tasks Operation
- **Input**: None required
- **Output**: List of all tasks in format:
  ```
  ID: [id], Title: [title], Status: [Completed/Not Completed]
  ```
- **Special Case**: No tasks shows appropriate message

### Update Task Operation
- **Input Sequence**:
  1. Task ID (integer)
  2. New title (optional, can keep existing)
  3. New description (optional, can keep existing)
- **Output**: Success confirmation
- **Error Handling**: Invalid ID shows error message

### Delete Task Operation
- **Input**: Task ID (integer)
- **Output**: Success confirmation
- **Error Handling**: Invalid ID shows error message

### Mark Task Complete/Incomplete Operation
- **Input**: Task ID (integer)
- **Output**: Confirmation of new status
- **Error Handling**: Invalid ID shows error message

## Data Model Interface

### Task Representation
Tasks are presented to users in the format:
```
ID: [id], Title: [title], Status: [Completed/Not Completed]
```

### Input Validation
- Task titles: Must be non-empty strings
- Task IDs: Must be integers corresponding to existing tasks
- Menu choices: Must be integers 1-6

## Error Messages
All errors follow the pattern:
- Brief error description
- Instruction for correction if applicable
- Return to appropriate menu/prompt

## Exit Behavior
- Option 6 (Exit) terminates the application
- No data is persisted on exit
- No confirmation required for exit