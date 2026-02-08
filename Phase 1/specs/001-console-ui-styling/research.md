# Research: Console UI Styling

## Decision: Terminal Width Handling
**Rationale**: Using Python's `os.get_terminal_size()` to get the current terminal width and center text based on that width. This provides responsive centering that adapts to different terminal sizes.
**Alternatives considered**:
- Hard-coding a fixed width (e.g., 80 characters) - too rigid and doesn't adapt to different terminal sizes
- Using a library like `shutil.get_terminal_size()` - overkill for simple centering needs
- Manual calculation - error-prone and less reliable

## Decision: Divider Line Characters
**Rationale**: Using "=" characters for divider lines as specified in the requirements. This creates clear visual separation while being universally supported across terminals.
**Alternatives considered**:
- Using "-" characters - also valid but "=" was specifically mentioned in requirements
- Using other ASCII characters like "*" or "#" - less conventional for dividers
- Unicode box-drawing characters - might not be supported in all terminals

## Decision: Emoji Support
**Rationale**: Using the exact emojis specified in the requirements (➕, 📋, ✅, ❌, ✏️, 🗑️, 🚪) as they provide clear visual indicators for each menu option.
**Alternatives considered**:
- Text-based icons (e.g., "[+]", "[L]", "[C]") - less visually appealing
- Different emoji sets - the specified ones are clear and intuitive
- No emojis - goes against the explicit requirement for emoji usage

## Decision: Menu Display Function
**Rationale**: Creating a dedicated function to display the formatted menu to ensure consistency across all interactions and easy maintenance.
**Alternatives considered**:
- Inline formatting in each function - would lead to code duplication and inconsistency
- Using a configuration file - overkill for simple menu formatting
- Class-based approach - unnecessary complexity for simple UI formatting

## Decision: Header Display Function
**Rationale**: Creating a dedicated function to display the formatted header to ensure consistency and reusability across the application.
**Alternatives considered**:
- Hard-coding header in main loop - less maintainable and harder to update
- Multiple header formats - would violate consistency requirement
- Template-based approach - unnecessary complexity for simple formatting

## Decision: Output Spacing and Separators
**Rationale**: Using consistent spacing (blank lines) and separators to improve readability as specified in the requirements.
**Alternatives considered**:
- Minimal spacing - reduces readability
- Complex formatting - overcomplicates simple console output
- No separators - makes output harder to distinguish between sections