# Quickstart: Todo Console Application

## Prerequisites
- Python 3.13+ installed on your system
- Console/terminal access

## Setup
1. Ensure Python 3.13+ is installed: `python --version`
2. Navigate to the project directory containing `src/main.py`
3. No additional setup required - the application uses only standard library modules

## Running the Application
```bash
python src/main.py
```

## Basic Usage
1. The application will display a numbered menu:
   ```
   1. Add task
   2. View tasks
   3. Update task
   4. Delete task
   5. Mark task complete / incomplete
   6. Exit
   ```

2. Enter the number corresponding to your desired action
3. Follow the prompts for each operation

## Example Workflow
1. **Add a task**: Select option 1, enter a task title, optionally add description
2. **View tasks**: Select option 2 to see all your tasks with their status
3. **Mark complete**: Select option 5, enter the task ID to toggle its completion status
4. **Exit**: Select option 6 to quit the application (note: data is not persisted)

## Error Handling
- Invalid menu choices will show an error and re-display the menu
- Invalid task IDs will show an error message
- Empty titles will be rejected when adding/updating tasks
- The application will not crash on invalid input