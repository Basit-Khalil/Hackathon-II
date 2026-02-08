# Quickstart: Chat Widget Frontend for Todo AI Chatbot

## Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Access to the Todo AI Chatbot backend API
- Existing Todo frontend application

## Integration Instructions

### 1. Include the Chat Widget Files
Add the chat widget files to your frontend project:
```bash
frontend/
└── chat_widget/
    ├── css/
    │   └── chat_widget.css
    ├── js/
    │   └── chat_widget.js
    └── index.html (demo page)
```

### 2. Link CSS and JavaScript
In your HTML page, add the following to the `<head>` section:
```html
<link rel="stylesheet" href="/frontend/chat_widget/css/chat_widget.css">
```

And before the closing `</body>` tag:
```html
<script src="/frontend/chat_widget/js/chat_widget.js"></script>
```

### 3. Initialize the Chat Widget
Add the following div to your HTML where you want the chat button to appear:
```html
<div id="chat-widget-container"></div>
```

Initialize the widget with your user ID:
```javascript
// Initialize the chat widget with the current user's ID
document.addEventListener('DOMContentLoaded', function() {
    const userId = getCurrentUserId(); // Replace with your method to get the current user ID
    ChatWidget.init(userId);
});
```

### 4. API Configuration
The widget expects the backend API to be available at `/api/{user_id}/chat`. Make sure your backend is configured to handle these requests.

## Usage

### Basic Usage
Once initialized, the chat widget will appear as a floating button on your page. Clicking the button will open the chat interface where users can interact with the AI assistant.

### Customization
You can customize the appearance by modifying the CSS variables in `chat_widget.css`:
- `--widget-primary-color`: Primary color for the widget
- `--widget-secondary-color`: Secondary color for backgrounds
- `--widget-text-color`: Text color for messages

## Testing

### Manual Testing
1. Open your page in a browser
2. Verify the floating chat button appears
3. Click the button and verify the chat interface opens
4. Send a test message and verify it appears in the chat history
5. Wait for a response and verify it appears in the chat history

### API Testing
The widget makes POST requests to `/api/{user_id}/chat` with the following structure:
```json
{
  "message": "user's message text"
}
```

And expects responses in the format:
```json
{
  "conversation_id": 123,
  "response": "AI's response text",
  "tool_calls": []
}
```

## Troubleshooting

### Widget Not Appearing
- Verify that the CSS and JS files are properly linked
- Check browser console for JavaScript errors
- Ensure the initialization code is running

### API Requests Failing
- Verify that the backend API endpoint is accessible
- Check browser console for network errors
- Verify that the user ID is being passed correctly

### Styling Issues
- Verify that the CSS file is properly loaded
- Check for conflicts with existing styles
- Adjust CSS variables as needed