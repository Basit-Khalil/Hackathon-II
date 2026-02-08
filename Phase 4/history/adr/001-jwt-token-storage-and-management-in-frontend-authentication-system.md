# ADR-001: JWT Token Storage and Management in Frontend Authentication System

## Status
Accepted

## Date
2026-01-07

## Context

The frontend authentication system for the Next.js Todo application requires a secure and efficient approach to store, manage, and transmit JWT tokens for API communication. The decision involves how to handle token persistence, retrieval, and inclusion in API requests while maintaining security best practices and user experience requirements.

The system needs to:
- Store JWT tokens securely after authentication
- Include tokens in API requests automatically
- Handle token expiration gracefully
- Maintain session state across page refreshes
- Support secure logout functionality

## Decision

We will implement JWT token storage using localStorage combined with centralized authentication functions for management. This approach includes:

- Storing JWT tokens in browser localStorage with the key 'auth-token'
- Creating centralized auth functions in `frontend/lib/auth.ts` for token operations
- Implementing automatic token attachment to API requests via the API client
- Using middleware to check for token presence on protected routes
- Including proper error handling for expired/invalid tokens

The specific implementation includes:
- `getAuthToken()`, `setAuthToken()`, `removeAuthToken()` functions
- Enhanced `getCurrentUser()` function that validates token presence
- API client that automatically adds Authorization header with Bearer token
- Middleware that checks for tokens in multiple locations (cookies and headers)

## Alternatives

### Alternative 1: HTTP-only Cookies
- Store JWT tokens in HTTP-only cookies managed by the backend
- Pros: Better security against XSS attacks, automatic inclusion in requests
- Cons: More complex backend implementation, harder to access token in frontend code

### Alternative 2: Memory Storage Only
- Store tokens only in React component state or context
- Pros: No persistent storage, automatically cleared on refresh
- Cons: Requires re-authentication on every page refresh, poor UX

### Alternative 3: Session Storage
- Store tokens in browser sessionStorage
- Pros: Automatically cleared when tab/window closes
- Cons: Tokens lost on page refresh, same XSS vulnerabilities as localStorage

### Alternative 4: Hybrid Approach (localStorage + refresh tokens in http-only cookies)
- Store access tokens in localStorage, refresh tokens in http-only cookies
- Pros: Better security with rotation capabilities, persistent sessions
- Cons: More complex implementation, requires backend support for refresh tokens

## Consequences

### Positive
- Persistent authentication across page refreshes and browser sessions
- Centralized token management simplifies maintenance
- Automatic token inclusion in API requests
- Clear separation of concerns between authentication and business logic
- Consistent user experience with maintained sessions

### Negative
- Potential XSS vulnerability if the application has script injection flaws
- Tokens remain in storage until explicit logout or expiration
- localStorage is synchronous which could impact performance for large tokens
- More complex error handling when tokens expire

### Neutral
- Requires proper security headers (CSP, etc.) to mitigate XSS risks
- Implementation requires careful attention to token validation
- Adds complexity to authentication flow management

## References

- `/specs/002-frontend-auth-api-integration/spec.md`
- `/specs/002-frontend-auth-api-integration/plan.md`
- `frontend/lib/auth.ts`
- `frontend/lib/api.ts`
- `frontend/middleware.ts`