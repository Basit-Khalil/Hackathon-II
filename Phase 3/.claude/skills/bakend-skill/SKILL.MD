---
name: backend-skill
description: Generate backend routes, handle requests and responses, and connect application logic to the database.
---

# Backend Skill

## Instructions
Implement backend functionality with the following responsibilities:

1. **Route Generation**
   - Define clear and consistent API routes
   - Follow RESTful conventions where applicable
   - Separate public and protected routes
   - Group routes by resource or domain
   - Use versioning when required (e.g., /api/v1)

2. **Request Handling**
   - Parse incoming request data (params, body, headers)
   - Validate request payloads
   - Handle authentication and authorization checks
   - Sanitize user input to prevent injection attacks

3. **Response Handling**
   - Return structured and predictable responses
   - Use appropriate HTTP status codes
   - Handle success and error responses consistently
   - Avoid leaking internal error details
   - Include metadata when useful (pagination, counts)

4. **Database Connection**
   - Establish and manage database connections
   - Use connection pooling where supported
   - Interact with the database via models or queries
   - Handle database errors gracefully
   - Close or reuse connections properly

5. **Business Logic Integration**
   - Connect routes to service or controller logic
   - Keep business logic out of route definitions
   - Reuse database operations safely
   - Ensure single-responsibility per route

## Error Handling
- Centralize error handling logic
- Return meaningful error messages
- Log errors for debugging
- Handle validation, auth, and DB errors separately

## Best Practices
- Keep routes thin and logic modular
- Use environment variables for configuration
- Apply middleware for cross-cutting concerns
- Ensure API consistency across services
- Write predictable and testable endpoints

## Example Route Flow (Pseudo)
```text
Request
→ route match
→ validation
→ auth check
→ business logic
→ database operation
→ response
