#!/usr/bin/env python3
"""
Todo Console Application
A simple in-memory todo list application with a command-line interface.
"""

import os

# Application constants and configuration
APP_NAME = "Todo Console Application"
VERSION = "1.0.0"

# Default configuration
DEFAULT_CONFIG = {
    "max_title_length": 100,
    "max_description_length": 500,
    "min_title_length": 1,
}


# UI Formatting Functions
def get_terminal_width():
    """
    Get the current terminal width for responsive formatting.

    Returns:
        int: Terminal width in columns, with a minimum of 60 to prevent display issues
    """
    try:
        width = os.get_terminal_size().columns
        # Set a reasonable minimum width to prevent display issues in very narrow terminals
        return max(width, 60)
    except OSError:
        # Default to 80 if we can't determine terminal width (e.g., when output is redirected)
        return 80


def center_text(text, width=None):
    """
    Center text within the specified width or terminal width.

    Args:
        text (str): Text to center
        width (int, optional): Width to center within. Defaults to terminal width.

    Returns:
        str: Centered text
    """
    if width is None:
        width = get_terminal_width()

    return text.center(width)


def draw_divider(char="=", width=None):
    """
    Draw a horizontal divider line.

    Args:
        char (str): Character to use for the divider (default: "=")
        width (int, optional): Width of the divider. Defaults to terminal width.

    Returns:
        str: Divider line
    """
    if width is None:
        width = get_terminal_width()

    return char * width


def display_header():
    """Display the application header with centered title and divider lines"""
    title = "TODO APPLICATION"
    print()  # Add a blank line before header for spacing
    print(draw_divider("="))
    print(center_text(title))
    print(draw_divider("="))
    print()  # Add a blank line after header for spacing


def display_menu():
    """Display the main menu options with emojis for visual clarity"""
    print("Please select an option:")
    print("1. ➕ Add Task")
    print("2. 📋 List Tasks")
    print("3. ✏️ Update Task")
    print("4. 🗑️ Delete Task")
    print("5. ✅ Mark Task Complete/Incomplete")
    print("6. 🚪 Exit")


def add_spacing(lines=1):
    """
    Add specified number of blank lines for improved readability.

    Args:
        lines (int): Number of blank lines to add (default: 1)
    """
    for _ in range(lines):
        print()


def add_separator(char="-", width=None):
    """
    Add a visual separator line between sections.

    Args:
        char (str): Character to use for the separator (default: "-")
        width (int, optional): Width of the separator. Defaults to terminal width.
    """
    if width is None:
        width = get_terminal_width()

    print(char * width)


class Task:
    """Represents a single todo task with id, title, description, and completion status"""

    def __init__(self, task_id, title, description="", completed=False):
        """
        Initialize a Task instance.

        Args:
            task_id (int): Unique identifier for the task
            title (str): Task title (required, non-empty)
            description (str): Task description (optional)
            completed (bool): Completion status (default: False)
        """
        if not isinstance(task_id, int) or task_id <= 0:
            raise ValueError("task_id must be a positive integer")

        if not title or not title.strip():
            raise ValueError("title must be a non-empty string")

        if not isinstance(title, str):
            raise ValueError("title must be a string")

        if not isinstance(description, str):
            raise ValueError("description must be a string")

        if not isinstance(completed, bool):
            raise ValueError("completed must be a boolean")

        self.id = task_id
        self.title = title.strip()
        self.description = description.strip()
        self.completed = completed

    def to_dict(self):
        """Convert the task to a dictionary representation"""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed
        }

    def __repr__(self):
        """String representation of the task"""
        status = "Completed" if self.completed else "Not Completed"
        return f"Task(id={self.id}, title='{self.title}', description='{self.description}', completed={self.completed})"

    def __str__(self):
        """Human-readable string representation of the task"""
        status = "Completed" if self.completed else "Not Completed"
        return f"ID: {self.id}, Title: {self.title}, Status: {status}"


# Global in-memory storage for tasks
tasks = []


def get_next_task_id():
    """Generate the next available task ID"""
    if not tasks:
        return 1

    # Find the highest ID currently in use and return the next number
    max_id = max(task.id for task in tasks)
    return max_id + 1


def validate_task_title(title):
    """
    Validate the task title.

    Args:
        title (str): The title to validate

    Returns:
        bool: True if valid, False otherwise
    """
    if not title or not title.strip():
        return False
    if len(title.strip()) < DEFAULT_CONFIG["min_title_length"]:
        return False
    if len(title.strip()) > DEFAULT_CONFIG["max_title_length"]:
        return False
    return True


def validate_task_id(task_id):
    """
    Validate the task ID.

    Args:
        task_id (int or str): The task ID to validate

    Returns:
        bool: True if valid, False otherwise
    """
    try:
        task_id = int(task_id)
        return task_id > 0
    except (ValueError, TypeError):
        return False


def sanitize_input(user_input):
    """
    Sanitize user input by stripping whitespace.

    Args:
        user_input (str): The input to sanitize

    Returns:
        str: Sanitized input
    """
    if user_input is None:
        return ""
    return str(user_input).strip()




def add_task():
    """Add a new task to the task list"""
    global tasks

    add_spacing(1)
    print("--- Add New Task ---")

    # Get task title
    title = input("Enter task title: ").strip()

    # Validate title
    if not validate_task_title(title):
        print(f"Error: Task title must be between {DEFAULT_CONFIG['min_title_length']} and {DEFAULT_CONFIG['max_title_length']} characters and cannot be empty.")
        return False

    # Get optional description
    description = input("Enter task description (optional): ").strip()

    # Generate unique ID
    task_id = get_next_task_id()

    # Create and add the task
    try:
        new_task = Task(task_id, title, description, completed=False)
        tasks.append(new_task)
        print(f"Success: Task '{new_task.title}' added with ID {new_task.id}")
        add_spacing(1)  # Add spacing before showing menu again
        return True
    except ValueError as e:
        print(f"Error creating task: {e}")
        add_spacing(1)  # Add spacing before showing menu again
        return False


def view_tasks():
    """Display all tasks in the task list"""
    global tasks

    add_spacing(1)
    print("--- View All Tasks ---")

    # Check if there are any tasks
    if not tasks:
        print("No tasks found. Your todo list is empty.")
        return

    # Display all tasks with ID, title, and status
    print("Current tasks:")
    add_separator()
    for task in tasks:
        status = "Completed" if task.completed else "Not Completed"
        print(f"ID: {task.id}, Title: {task.title}, Status: {status}")
    add_separator()
    add_spacing(1)


def get_task_by_id(task_id):
    """
    Find a task by its ID.

    Args:
        task_id (int): The ID of the task to find

    Returns:
        Task: The task object if found, None otherwise
    """
    global tasks

    # Validate the task ID first
    if not validate_task_id(task_id):
        return None

    # Convert to int if it's a string
    try:
        task_id = int(task_id)
    except ValueError:
        return None

    # Look for the task with the given ID
    for task in tasks:
        if task.id == task_id:
            return task

    # Task not found
    return None


def toggle_task_completion(task_id):
    """
    Toggle the completion status of a task.

    Args:
        task_id (int): The ID of the task to toggle

    Returns:
        bool: True if successful, False otherwise
    """
    global tasks

    # Find the task
    task = get_task_by_id(task_id)

    if task is None:
        return False

    # Toggle the completion status
    task.completed = not task.completed
    return True


def mark_task_complete():
    """Mark a task as complete or incomplete"""
    global tasks

    add_spacing(1)
    print("--- Mark Task Complete/Incomplete ---")

    if not tasks:
        print("No tasks available. Please add tasks first.")
        return

    # Get task ID from user
    task_id_input = input("Enter task ID to toggle completion status: ").strip()

    # Validate task ID
    if not validate_task_id(task_id_input):
        print("Error: Invalid task ID. Please enter a positive integer.")
        return

    task_id = int(task_id_input)

    # Find the task
    task = get_task_by_id(task_id)
    if task is None:
        print(f"Error: Task with ID {task_id} not found.")
        return

    # Toggle the completion status
    success = toggle_task_completion(task_id)

    if success:
        new_status = "Completed" if task.completed else "Not Completed"
        action = "completed" if task.completed else "marked as incomplete"
        print(f"Success: Task '{task.title}' has been {action}. New status: {new_status}")
    else:
        print(f"Error: Could not toggle completion status for task ID {task_id}")
    add_spacing(1)


def update_task():
    """Update an existing task's title or description"""
    global tasks

    add_spacing(1)
    print("--- Update Task ---")

    if not tasks:
        print("No tasks available. Please add tasks first.")
        return

    # Get task ID from user
    task_id_input = input("Enter task ID to update: ").strip()

    # Validate task ID
    if not validate_task_id(task_id_input):
        print("Error: Invalid task ID. Please enter a positive integer.")
        return

    task_id = int(task_id_input)

    # Find the task
    task = get_task_by_id(task_id)
    if task is None:
        print(f"Error: Task with ID {task_id} not found.")
        return

    print(f"Current task: ID {task.id}, Title: '{task.title}', Description: '{task.description}'")

    # Get new title (or keep current)
    new_title = input(f"Enter new title (current: '{task.title}', press Enter to keep current): ").strip()
    if not new_title:
        new_title = task.title
    elif not validate_task_title(new_title):
        print(f"Error: Task title must be between {DEFAULT_CONFIG['min_title_length']} and {DEFAULT_CONFIG['max_title_length']} characters and cannot be empty.")
        return

    # Get new description (or keep current)
    new_description = input(f"Enter new description (current: '{task.description}', press Enter to keep current): ").strip()
    if not new_description:
        new_description = task.description

    # Update the task
    task.title = new_title
    task.description = new_description

    print(f"Success: Task updated. New title: '{task.title}', New description: '{task.description}'")
    add_spacing(1)


def delete_task():
    """Delete a task from the task list"""
    global tasks

    add_spacing(1)
    print("--- Delete Task ---")

    if not tasks:
        print("No tasks available to delete.")
        return

    # Get task ID from user
    task_id_input = input("Enter task ID to delete: ").strip()

    # Validate task ID
    if not validate_task_id(task_id_input):
        print("Error: Invalid task ID. Please enter a positive integer.")
        return

    task_id = int(task_id_input)

    # Find the task
    task = get_task_by_id(task_id)
    if task is None:
        print(f"Error: Task with ID {task_id} not found.")
        return

    print(f"Task to delete: ID {task.id}, Title: '{task.title}'")

    # Confirm deletion
    confirm = input("Are you sure you want to delete this task? (y/N): ").strip().lower()
    if confirm not in ['y', 'yes']:
        print("Task deletion cancelled.")
        return

    # Remove the task from the list
    tasks.remove(task)

    print(f"Success: Task '{task.title}' with ID {task.id} has been deleted.")
    add_spacing(1)


def main():
    """Main application entry point"""
    display_header()
    print("Use the menu options to manage your tasks.")

    # Initialize in-memory task storage
    global tasks
    tasks = []

    # Main application loop
    while True:
        display_menu()

        try:
            choice = input("Enter your choice (1-6): ").strip()

            if choice == "1":
                add_task()
            elif choice == "2":
                view_tasks()
            elif choice == "3":
                update_task()
            elif choice == "4":
                delete_task()
            elif choice == "5":
                mark_task_complete()
            elif choice == "6":
                print("Exiting application...")
                break
            else:
                print("Invalid choice. Please enter a number between 1 and 6.")
        except KeyboardInterrupt:
            print("\n\nApplication interrupted by user. Exiting...")
            break
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            print("Please try again or contact support if the problem persists.")


if __name__ == "__main__":
    main()