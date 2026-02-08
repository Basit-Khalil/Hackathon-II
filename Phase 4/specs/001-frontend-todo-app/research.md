# Research: Phase II – Todo Full-Stack Web Application (Frontend)

## Decision: Next.js App Router with TypeScript
**Rationale**: Next.js 14 with App Router provides the best developer experience for building modern web applications with server-side rendering, routing, and built-in optimizations. TypeScript ensures type safety and reduces runtime errors.

**Alternatives considered**:
- Create React App: Outdated, no server-side rendering
- Remix: More complex routing system
- Gatsby: Better for static sites rather than dynamic applications

## Decision: Better Auth for Authentication
**Rationale**: Better Auth provides a complete authentication solution with JWT support that integrates well with Next.js. It handles user registration, login, session management, and token issuance.

**Alternatives considered**:
- NextAuth.js: Another Next.js-focused solution but with different JWT handling
- Auth0/Firebase: External services that add complexity and dependencies
- Custom auth solution: Would require significant development time

## Decision: SWR for Data Fetching
**Rationale**: SWR (stale-while-revalidate) is a React Hooks library for data fetching that provides caching, revalidation, focus tracking, and network awareness. Works well with Next.js and handles JWT token management.

**Alternatives considered**:
- React Query: Similar functionality but different API
- Fetch API with custom hooks: More manual work required
- Redux Toolkit Query: Overkill for this application size

## Decision: Tailwind CSS for Styling
**Rationale**: Tailwind CSS provides utility-first CSS that enables rapid UI development with consistent design patterns. Works well with Next.js and provides excellent responsive design capabilities.

**Alternatives considered**:
- Styled Components: CSS-in-JS approach that can lead to larger bundle sizes
- CSS Modules: More verbose than Tailwind
- Material UI: Component library that may not provide the custom design needed

## Decision: Centralized API Client
**Rationale**: A centralized API client in `/lib/api.ts` will handle all HTTP requests, JWT token management, error handling, and request/response formatting. This ensures consistent API interactions throughout the application.

**Alternatives considered**:
-分散 API calls: Would lead to inconsistent error handling and token management
- Multiple API clients: Would create code duplication

## Decision: Server Components by Default
**Rationale**: Following the project constraints, server components will be used by default for better performance, smaller bundle sizes, and SEO benefits. Client components will only be used where interactivity is required.

**Alternatives considered**:
- Client components everywhere: Would increase bundle size and reduce performance
- Mixed approach without clear rules: Would lead to inconsistent performance characteristics