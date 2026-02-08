# Chat Widget for Todo AI Chatbot

A lightweight floating chat widget that integrates with the Todo AI Chatbot backend. This widget provides a user-friendly interface for interacting with the AI assistant to manage tasks.

## Features

- Floating chat button that remains visible on the screen
- Modal/slide-in chat interface
- Real-time messaging with AI assistant
- Loading indicators during AI processing
- Error handling for failed requests
- Responsive design for all device sizes
- Clean, minimal aesthetic

## Installation

1. Copy the entire `chat_widget` directory to your frontend project
2. Include the CSS and JavaScript files in your HTML:

```html
<head>
  <!-- Other head content -->
  <link rel="stylesheet" href="/frontend/chat_widget/css/chat_widget.css">
</head>
<body>
  <!-- Your page content -->

  <!-- Before closing body tag -->
  <script src="/frontend/chat_widget/js/chat_widget.js"></script>
</body>
```

## Usage

### Initialize the Widget

Initialize the chat widget with the current user's ID:

```html
<script>
  // Initialize the chat widget when the page loads
  document.addEventListener('DOMContentLoaded', function() {
    // Replace with your method to get the current user ID
    const userId = getCurrentUserId();
    ChatWidget.init(userId);
  });
</script>
```

### Manual Initialization

You can also initialize the widget manually anywhere in your code:

```javascript
// Initialize with a specific user ID
const chatWidget = ChatWidget.init(123);
```

## API Integration

The widget communicates with the backend API at `/api/{user_id}/chat`. The widget expects:

- **Endpoint**: `POST /api/{user_id}/chat`
- **Request body**:
  ```json
  {
    "message": "user's message text"
  }
  ```
- **Expected response**:
  ```json
  {
    "conversation_id": 123,
    "response": "AI's response text",
    "tool_calls": []
  }
  ```

## Customization

You can customize the widget's appearance by overriding the CSS variables:

```css
:root {
  --widget-primary-color: #your-color;
  --widget-secondary-color: #your-color;
  --widget-text-color: #your-color;
  --widget-border-radius: 8px;
  --widget-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --widget-width: 400px;
  --widget-height: 500px;
  --button-size: 50px;
}
```

## Methods

The `ChatWidget` class provides the following methods:

- `init(userId)`: Initialize the chat widget with a user ID
- `toggleWidget()`: Open or close the widget
- `openWidget()`: Open the widget
- `closeWidget()`: Close the widget

## Events

The widget doesn't emit custom events, but you can listen to standard DOM events on the created elements.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security

- All user messages are HTML-escaped to prevent XSS attacks
- Uses standard Fetch API for secure communication
- Follows same-origin policy for API requests

## Troubleshooting

### Widget Not Appearing
- Verify that the CSS and JS files are properly loaded
- Check the browser console for JavaScript errors
- Ensure the initialization code runs after DOM is loaded

### API Requests Failing
- Confirm the backend API endpoint is accessible at `/api/{user_id}/chat`
- Check browser console for network errors
- Verify the user ID is being passed correctly

### Styling Issues
- Ensure the CSS file is properly loaded
- Check for conflicts with existing styles
- Verify CSS variables are properly defined

## Development

To modify the widget:

1. Edit `css/chat_widget.css` for styling changes
2. Edit `js/chat_widget.js` for behavior changes
3. Test changes using the `index.html` demo page

## License

MIT