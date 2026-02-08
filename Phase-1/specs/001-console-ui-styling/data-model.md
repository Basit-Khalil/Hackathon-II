# Data Model: Console UI Styling

## UI Formatting Entity

### Properties
- **header**: Defines the application header format
  - **title**: The application title text ("TODO APPLICATION")
  - **divider_char**: Character used for horizontal dividers ("=")
  - **alignment**: Text alignment (centered)

- **menu**: Defines the menu presentation format
  - **options**: List of menu options with index, label, and emoji
  - **format**: Format string for each menu item
  - **spacing**: Spacing between menu items

- **spacing**: Defines output formatting rules
  - **line_spacing**: Number of blank lines between sections
  - **indentation**: Indentation for nested content
  - **separators**: Characters used for section separation

### Example UI Formatting Object
```python
{
    "header": {
        "title": "TODO APPLICATION",
        "divider_char": "=",
        "width": 50
    },
    "menu": {
        "options": [
            {"index": 1, "emoji": "➕", "label": "Add Task"},
            {"index": 2, "emoji": "📋", "label": "List Tasks"},
            {"index": 3, "emoji": "✅", "label": "Mark Complete"},
            {"index": 4, "emoji": "❌", "label": "Mark Incomplete"},
            {"index": 5, "emoji": "✏️", "label": "Update Task"},
            {"index": 6, "emoji": "🗑️", "label": "Delete Task"},
            {"index": 7, "emoji": "🚪", "label": "Exit"}
        ]
    },
    "spacing": {
        "before_header": 1,
        "after_header": 1,
        "before_menu": 1,
        "after_menu": 1,
        "section_separator": 2
    }
}
```

## UI Formatting Operations

### Header Display
- **display_header()**: Renders the application header with centered title and divider lines
- **center_text(text, width)**: Centers text within the specified width
- **draw_divider(char, width)**: Draws a horizontal divider line

### Menu Display
- **display_menu()**: Renders the formatted menu with emojis and labels
- **format_menu_item(index, emoji, label)**: Formats a single menu item
- **get_terminal_width()**: Gets the current terminal width for responsive formatting

### Output Formatting
- **add_spacing(lines)**: Adds specified number of blank lines
- **add_separator()**: Adds a visual separator between sections
- **format_task_output(task)**: Formats task display with proper spacing

## Validation Rules

### Header Formatting
- Title must be centered based on terminal width
- Divider lines must span the full width of the formatted title
- Divider characters must be consistent (using "=" as specified)

### Menu Formatting
- All menu options must include numeric index, emoji, and descriptive label
- Menu must be presented in the exact order specified (1-7)
- Each option must use the exact emoji specified in requirements

### Output Formatting
- Proper spacing must be maintained between different sections
- Clear separators must be used between different types of output
- Consistent formatting must be maintained across all user interactions