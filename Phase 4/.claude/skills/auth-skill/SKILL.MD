---
name: auth-skill
description: Handle secure user authentication including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Authentication Skill

## Instructions
Implement authentication with the following capabilities:

1. **User Signup**
   - Accept user credentials (email/username + password)
   - Validate input data
   - Prevent duplicate users
   - Store user securely in database

2. **User Signin**
   - Verify user existence
   - Compare hashed passwords
   - Return authentication tokens on success
   - Handle invalid credentials gracefully

3. **Password Hashing**
   - Never store plain-text passwords
   - Use a secure hashing algorithm (e.g., bcrypt, argon2)
   - Apply salting automatically
   - Support password verification

4. **JWT Token Management**
   - Generate access tokens after successful login
   - Include user identifier and expiry in payload
   - Sign tokens using a secret key
   - Validate and decode tokens for protected routes

5. **Better Auth Integration**
   - Integrate Better Auth as an authentication provider
   - Support session-based or token-based auth
   - Delegate auth flows where applicable
   - Ensure compatibility with existing JWT strategy

## Security Requirements
- Enforce strong password policies
- Use environment variables for secrets
- Set token expiration times
- Protect sensitive routes with auth middleware
- Prevent common attacks (brute force, token reuse)

## Example Flow (Pseudo)
```text
User Signup
→ validate input
→ hash password
→ store user
→ return success response

User Signin
→ fetch user
→ verify password
→ generate JWT
→ return token