# Research: Chat Widget Frontend for Todo AI Chatbot

## Decision: Frontend Technology Stack
**Rationale**: Using HTML5, CSS3, and vanilla JavaScript ES6+ ensures broad browser compatibility and minimal dependencies. This approach avoids heavy frameworks that would increase bundle size and complexity for a simple chat widget.

**Alternatives considered**:
- React/Vue/Angular components (rejected due to increased complexity and bundle size)
- Web Components (rejected due to browser compatibility concerns)
- jQuery (rejected due to unnecessary overhead for modern browsers)

## Decision: API Integration Pattern
**Rationale**: Using the native Fetch API with async/await provides clean, modern asynchronous communication with the backend. This integrates well with the existing /api/{user_id}/chat endpoint from the AI backend.

**Alternatives considered**:
- XMLHttpRequest (rejected due to older callback-based pattern)
- Third-party HTTP libraries like Axios (rejected to minimize dependencies)
- WebSocket connections (rejected as HTTP requests are sufficient for this use case)

## Decision: UI Architecture
**Rationale**: Floating button with modal/slide-in panel provides a non-intrusive user experience while keeping the chat interface accessible. This pattern is commonly used in customer support widgets and familiar to users.

**Alternatives considered**:
- Permanent sidebar (rejected due to screen space concerns)
- Embedded chat window (rejected as it would require more complex integration with existing UI)
- Full-screen overlay (rejected as it would be too disruptive)

## Decision: State Management
**Rationale**: Keeping the widget stateless from the frontend perspective aligns with the backend's responsibility for managing conversation history. The frontend only maintains UI state (open/closed, loading, etc.).

**Alternatives considered**:
- LocalStorage for message history (rejected due to statefulness contradiction)
- SessionStorage for temporary history (rejected for same reason)
- Full client-side state management (rejected to maintain alignment with backend-only state)

## Decision: Responsive Design Approach
**Rationale**: Using CSS Flexbox and Grid with media queries ensures the widget works well across all device sizes while maintaining performance.

**Alternatives considered**:
- CSS Frameworks like Bootstrap (rejected to minimize dependencies)
- JavaScript-based responsive logic (rejected due to performance concerns)
- Separate mobile/desktop implementations (rejected due to maintenance overhead)