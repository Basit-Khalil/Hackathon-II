---
id: 1
title: Create Todo AI Chatbot Constitution
stage: constitution
date: 2026-02-05
surface: agent
model: qwen3-coder-plus
feature: none
branch: 004-backend-todo
user: Claude Code
command: /sp.constitution
labels: [constitution, ai-chatbot, todo-app, agentic-architecture]
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

Create a Spec Constitution for Phase III: Todo AI Chatbot Integration for an existing Full Stack Todo Application.

Project Context:
Phase II of the project is already complete. The Todo application has:
- A fully functional frontend UI (already built and must NOT be rebuilt)
- A working FastAPI backend
- SQLModel ORM
- Neon Serverless PostgreSQL database
- Existing Task CRUD functionality

Objective:
Introduce an AI-powered conversational chatbot that integrates into the EXISTING frontend and backend system. The chatbot must allow users to manage todos through natural language using an Agentic architecture.

Critical Constraint:
DO NOT create a new frontend application.
DO NOT redesign UI.
DO NOT rebuild frontend.
The chatbot must integrate into the existing frontend via API endpoints only.

Development Methodology:
Use Spec-Driven Development with Agentic Dev Stack workflow:
1. Write Specification
2. Generate Implementation Plan
3. Break into Tasks
4. Implement using Claude Code
Manual coding is NOT allowed.
Evaluation will focus on prompts, specifications, plans, and iteration quality.

Architecture Requirements:
- Stateless server architecture
- Single chat endpoint
- Conversation history stored in database
- AI agent must use MCP tools for all task operations
- MCP tools must also be stateless
- Database is the single source of truth

Technology Stack:
Backend Framework: Python FastAPI
AI Framework: OpenAI Agents SDK
MCP Server: Official MCP SDK
ORM: SQLModel
Database: Neon Serverless PostgreSQL
Authentication: Better Auth
Frontend: Existing Todo Frontend (integration only)

System Components:
1. FastAPI Chat Endpoint
   POST /api/{user_id}/chat

2. OpenAI Agent Runner
   Handles natural language understanding and tool orchestration

3. MCP Server
   Provides task tools:
   - add_task
   - list_tasks
   - complete_task
   - delete_task
   - update_task

4. Database Models:
   Task
   Conversation
   Message

Stateless Conversation Flow:
1. Receive request from existing frontend
2. Fetch conversation history from database
3. Append new user message
4. Execute AI agent with MCP tools
5. Store assistant response
6. Return structured response

Agent Behavior Rules:
- Detect task creation, listing, completion, deletion, updates
- Always confirm actions
- Handle errors gracefully
- Chain multiple MCP tools when needed
- Use database as persistent state
- Maintain conversational context via stored messages

Non-Functional Requirements:
- Modular architecture
- Tool-first AI design
- Production-ready structure
- Horizontal scalability
- Testable MCP tools
- Logging and observability

Security Requirements:
- User isolation per user_id
- Input validation
- Secure DB interactions
- Tool permission boundaries

Output Requirements:
The constitution must define:
- Project rules
- Development constraints
- Architectural principles
- Agentic workflow enforcement
- Integration-first philosophy
- Stateless design mandates
- MCP-first interaction rules
- No-manual-code policy
- Existing frontend preservation

Important Constraint

## Response snapshot

Created a comprehensive constitution for the Todo AI Chatbot Integration project that defines core principles, architectural constraints, development workflow, and security requirements. The constitution enforces an integration-first approach, agentic workflow enforcement, stateless design mandates, MCP-first interaction rules, no-manual-code policy, and existing frontend preservation.

## Outcome

- ✅ Impact: Created comprehensive constitution defining project principles and constraints
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with new constitution
- 🔁 Next prompts: Generate spec, plan, and tasks based on this constitution
- 🧠 Reflection: Constitution successfully captures all specified requirements and constraints

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): initial constitution creation
- Next experiment (smallest change to try): Generate specification based on constitution