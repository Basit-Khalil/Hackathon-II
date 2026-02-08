<!--
Sync Impact Report:
- Version change: N/A → 1.0.0
- Modified principles: All principles are new for this project
- Added sections: Core Principles, Agentic Architecture Constraints, Development Workflow, Security Requirements
- Removed sections: None
- Templates requiring updates: ✅ Updated / ⚠ Pending
- Follow-up TODOs: None
-->
# Todo AI Chatbot Integration Constitution

## Core Principles

### I. Integration-First Architecture
The AI chatbot must integrate seamlessly into the existing frontend via API endpoints only. No new frontend applications, UI redesigns, or rebuilding of existing frontend components is permitted. All interactions must occur through well-defined API contracts with the existing system.

### II. Agentic Workflow Enforcement
All AI interactions must follow an Agentic architecture using MCP tools for task operations. The AI agent must use MCP tools exclusively for all task operations (add, list, complete, delete, update) rather than direct database calls. This ensures proper separation of concerns and standardized operations.

### III. Stateless Design Mandates
Maintain a stateless server architecture with conversation history stored in the database. The AI agent runner and MCP tools must be stateless, with the database serving as the single source of truth for all persistent data. Each conversation flow must be self-contained and not rely on server-side session state.

### IV. MCP-First Interaction Rules
All task operations must be performed through MCP tools rather than direct database access. The MCP server must provide standardized tools (add_task, list_tasks, complete_task, delete_task, update_task) that serve as the canonical interface for all task-related operations.

### V. No-Manual-Code Policy
Implementation must follow Spec-Driven Development with Agentic Dev Stack workflow only. Manual coding is prohibited. The sequence must be: Write Specification → Generate Implementation Plan → Break into Tasks → Implement using Claude Code. All changes must be generated through this process.

### VI. Existing Frontend Preservation
The existing fully functional frontend UI must remain unchanged and preserved. The chatbot integration must work within the constraints of the existing UI architecture without requiring any modifications to the frontend codebase.

## Agentic Architecture Constraints

### State Management
- Conversation state maintained through database-stored messages
- No server-side session persistence
- Each API call must reconstruct necessary context from database
- MCP tools must be stateless and operate on database as source of truth

### Tool Orchestration
- AI agent must detect task creation, listing, completion, deletion, and updates
- Actions must be confirmed before execution
- Errors must be handled gracefully with appropriate user feedback
- Multiple MCP tools may be chained when needed for complex operations
- Conversational context maintained via stored message history

### Database-First Approach
- Database serves as the single source of truth
- All operations must go through proper database transactions
- Conversation history stored in structured format (Conversation/Message models)
- User isolation maintained through user_id scoping

## Development Workflow

### Spec-Driven Development Cycle
- All development follows the strict sequence: Spec → Plan → Tasks → Implementation
- Each phase must be completed before moving to the next
- Specifications must be comprehensive and detailed before planning begins
- Plans must address all architectural requirements before task breakdown
- Tasks must be testable and implementable before execution

### Technology Stack Compliance
- Backend: Python FastAPI for API endpoints
- AI Framework: OpenAI Agents SDK for natural language processing
- MCP Server: Official MCP SDK for tool interfaces
- ORM: SQLModel for database operations
- Database: Neon Serverless PostgreSQL for persistence
- Authentication: Better Auth for user management
- Frontend: Existing Todo Frontend (integration only)

### API Contract Standards
- Single chat endpoint: POST /api/{user_id}/chat
- Proper error handling with appropriate HTTP status codes
- Structured response format for frontend consumption
- Input validation for all user inputs
- Rate limiting and security controls implemented

## Security Requirements

### User Isolation
- Strict user isolation through user_id parameter validation
- No cross-user data access permitted
- Authentication and authorization checks on every request
- Session management through Better Auth integration

### Input Validation
- All user inputs must be validated before processing
- Sanitization of natural language inputs to prevent injection
- Validation of MCP tool parameters before execution
- Rate limiting to prevent abuse

### Secure Operations
- All database interactions must use parameterized queries
- MCP tools must implement proper permission boundaries
- Audit logging for sensitive operations
- Secure handling of API keys and credentials through environment variables

## Governance

This constitution governs all development activities for the Todo AI Chatbot Integration project. All team members must adhere to these principles and constraints. Amendments to this constitution require formal approval and documentation of the changes. All pull requests and reviews must verify compliance with these principles. Development must follow the specified workflow and technology stack requirements.

All implementations must pass through the Claude Code development process without manual intervention. Any deviation from these principles requires explicit approval and documentation of the rationale.

**Version**: 1.0.0 | **Ratified**: 2026-02-05 | **Last Amended**: 2026-02-05