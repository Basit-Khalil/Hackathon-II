# Data Model: AI Chat Backend for Todo AI Chatbot

## Entities

### Conversation
**Description**: Represents a chat session between user and AI assistant, containing associated messages
**Fields**:
- id: Integer (Primary Key)
- user_id: Integer (Foreign Key to user)
- created_at: DateTime
- updated_at: DateTime

**Relationships**:
- One-to-many with Message (conversation.messages)

### Message
**Description**: Represents individual messages within a conversation, including user inputs and AI responses
**Fields**:
- id: Integer (Primary Key)
- conversation_id: Integer (Foreign Key to Conversation)
- role: String (user/assistant)
- content: Text
- created_at: DateTime
- updated_at: DateTime

**Relationships**:
- Many-to-one with Conversation (message.conversation)

### Task
**Description**: Represents a user's todo item that can be managed through MCP tools
**Fields**:
- id: Integer (Primary Key)
- title: String
- description: Text (Optional)
- completed: Boolean
- user_id: Integer (Foreign Key to user)
- created_at: DateTime
- updated_at: DateTime

**Relationships**:
- Many-to-one with User (task.user)

## Validation Rules

### Conversation
- user_id must exist in users table
- created_at and updated_at automatically managed by system

### Message
- conversation_id must exist in conversations table
- role must be either 'user' or 'assistant'
- content must not be empty
- created_at and updated_at automatically managed by system

### Task
- user_id must exist in users table
- title must not be empty
- completed defaults to false
- created_at and updated_at automatically managed by system

## State Transitions

### Task
- New task: completed = false
- When completed: completed = true
- When reopened: completed = false