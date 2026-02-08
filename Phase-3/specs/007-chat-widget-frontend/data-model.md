# Data Model: Chat Widget Frontend for Todo AI Chatbot

## Entities

### ChatMessage
**Description**: Represents a message in the conversation with properties like sender (user/ai), content, and timestamp
**Fields**:
- id: String (unique identifier for the message)
- sender: String (either "user" or "ai")
- content: String (the text content of the message)
- timestamp: Date (when the message was created/sent)
- status: String (status of the message - "sent", "received", "error")

**Relationships**:
- Belongs to a Conversation (message.conversation)

### Conversation
**Description**: Represents a chat session with properties like conversation ID and message history
**Fields**:
- id: String (unique identifier for the conversation)
- userId: Integer (ID of the user this conversation belongs to)
- messages: Array of ChatMessage (collection of messages in this conversation)
- createdAt: Date (when the conversation was started)

**Relationships**:
- Contains many ChatMessages (conversation.messages)

### ChatWidgetState
**Description**: Represents the UI state of the chat widget (open/closed, loading, error)
**Fields**:
- isOpen: Boolean (whether the chat widget is currently open)
- isLoading: Boolean (whether the widget is waiting for a response)
- error: String (error message if any, otherwise null)
- lastActive: Date (when the widget was last interacted with)

## Validation Rules

### ChatMessage
- content must not be empty
- sender must be either "user" or "ai"
- timestamp must be a valid date
- status must be one of "sent", "received", "error"

### Conversation
- userId must be a positive integer
- messages array must not exceed 1000 items (for performance)
- createdAt must be a valid date

### ChatWidgetState
- isOpen must be boolean
- isLoading must be boolean
- error must be string or null

## State Transitions

### ChatWidgetState
- Initial state: isOpen = false, isLoading = false, error = null
- When button clicked: isOpen = true
- When message submitted: isLoading = true
- When response received: isLoading = false
- When error occurs: error = errorMessage
- When closed: isOpen = false