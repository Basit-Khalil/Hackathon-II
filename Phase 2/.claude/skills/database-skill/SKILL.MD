---
name: database-skill
description: Design database schemas, create tables, and manage migrations in a safe and scalable way.
---

# Database Skill

## Instructions
Handle database design and management with the following responsibilities:

1. **Schema Design**
   - Identify core entities and relationships
   - Use clear and consistent naming conventions
   - Define primary keys and foreign keys
   - Normalize data where appropriate
   - Support scalability and future changes

2. **Table Creation**
   - Create tables based on approved schema
   - Use appropriate data types
   - Add constraints (NOT NULL, UNIQUE, DEFAULT)
   - Define indexes for frequently queried fields

3. **Migrations**
   - Create forward-only migration files
   - Apply schema changes incrementally
   - Support rollback strategies where possible
   - Never modify existing migrations after applied
   - Track migration state reliably

4. **Relationships**
   - One-to-one relationships
   - One-to-many relationships
   - Many-to-many relationships using join tables
   - Enforce referential integrity

5. **Data Safety**
   - Prevent destructive changes without migrations
   - Avoid data loss during schema updates
   - Use transactions for schema operations
   - Validate schema changes before applying

## Best Practices
- Separate schema definition from application logic
- Keep migrations small and focused
- Version control all migration files
- Use environment-specific databases
- Document schema changes clearly

## Example Schema (Pseudo)
```text
User
- id (primary key)
- email (unique)
- password_hash
- created_at

Post
- id (primary key)
- user_id (foreign key → User.id)
- title
- content
- created_at