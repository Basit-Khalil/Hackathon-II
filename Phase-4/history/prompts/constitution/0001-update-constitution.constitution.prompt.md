---
id: 1
title: Update Constitution
stage: constitution
date: 2026-01-05
surface: agent
model: qwen3-coder-plus
feature: none
branch: master
user: Basit-Khalil
command: /sp.constitution
labels: [constitution, governance, template]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

```text
Project: Phase II – Todo Full-Stack Web Application

Objective:
Transform the Phase I console-based Todo application into a modern, multi-user,
full-stack web application with persistent storage and secure authentication,
using a strict Spec-Driven Development workflow.

Core principles:
- Spec-first development (no implementation without approved specifications)
- Agentic Dev Stack compliance (Spec → Plan → Tasks → Implement)
- Security by design (authentication and user isolation enforced at all layers)
- Deterministic behavior (clear, predictable API responses)
- Maintainability (clean separation of frontend, backend, and specs)

Key standards:
- All functionality must be derived from written specs in /specs
- No manual application code is allowed outside Claude Code executions
- Every implementation step must reference at least one spec file
- REST APIs must follow the defined endpoint contracts exactly
- Authentication must use JWT tokens issued by Better Auth
- Backend must independently verify JWTs using a shared secret
- All task data must be scoped to the authenticated user
- Unauthorized access must be rejected with proper HTTP status codes

Constraints:
- Technology stack is fixed and must not be changed:
  - Frontend: Next.js 16+ (App Router)
  - Backend: Python FastAPI
  - ORM: SQLModel
  - Database: Neon Serverless PostgreSQL
  - Authentication: Better Auth (JWT-based)
- REST API routes must follow the specified `/api/{user_id}/tasks` structure
- All API requests must require a valid JWT token
- No shared database sessions between frontend and backend
- No hardcoded secrets; all secrets must be loaded from environment variables
- Code generation must be incremental and task-based

Process rules:
- Specs must be written and finalized before planning
- A Phase II implementation plan must be generated before task execution
- Tasks must be atomic, verifiable, and spec-referenced
- Implementation must proceed task-by-task
- Specs may only be updated through explicit revision steps

Security requi
```

## Response snapshot

Updated the constitution template with specific values for the Phase II Todo Full-Stack Web Application project, incorporating all specified principles and constraints.

## Outcome

- ✅ Impact: Constitution file updated with project-specific principles and governance
- 🧪 Tests: none
- 📁 Files: 1 file modified (.specify/memory/constitution.md)
- 🔁 Next prompts: Plan development workflow based on updated constitution
- 🧠 Reflection: Constitution now provides clear guidance for the full-stack todo application development

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A