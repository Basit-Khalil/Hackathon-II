# Todo Console Application

A simple in-memory todo list application with a command-line interface featuring enhanced UI styling.

## Features

- **Enhanced Visual Experience**: The application now features a centered header with "TODO APPLICATION" title and divider lines for improved visual appeal.
- **Emoji-Enhanced Menu**: Menu options include clear emojis for visual clarity:
  - 1. ➕ Add Task
  - 2. 📋 List Tasks
  - 3. ✏️ Update Task
  - 4. 🗑️ Delete Task
  - 5. ✅ Mark Task Complete/Incomplete
  - 6. 🚪 Exit
- **Consistent UI Experience**: Header and menu formatting remains consistent across all user interactions.
- **Improved Readability**: Proper spacing and separators between different sections of output.

## Usage

Run the application with Python 3.13+:

```bash
python src/main.py
```

## Notes on Emoji Support

The application uses emojis for enhanced visual clarity in the menu. On some systems (particularly Windows Command Prompt), emojis may not display correctly. The application will continue to function normally, but the visual experience may be degraded. For best experience, use a terminal that supports Unicode emojis such as:

- Windows Terminal
- PowerShell
- Command Prompt with UTF-8 code page (chcp 65001)
- Any Unix/Linux terminal

## Requirements

- Python 3.13+
- Terminal with at least 60 columns for proper formatting