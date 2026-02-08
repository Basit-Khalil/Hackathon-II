# Implementation Plan: AI Chat Backend for Todo AI Chatbot

**Branch**: `006-ai-chat-backend` | **Date**: 2026-02-05 | **Spec**: [link to spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-ai-chat-backend/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a FastAPI-based chat endpoint that integrates with OpenAI Agents SDK to process natural language commands from users. The system fetches conversation history from the database, processes user messages through an AI agent with access to MCP tools, executes appropriate task operations, and returns structured responses. The architecture maintains stateless operation with conversation history stored in the database.

## Technical Context

**Language/Version**: Python 3.9+
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, SQLModel, asyncpg
**Storage**: Neon Serverless PostgreSQL (via existing MCP tools infrastructure)
**Testing**: pytest for unit and integration tests
**Target Platform**: Linux server (web backend)
**Project Type**: Web backend - extends existing backend infrastructure
**Performance Goals**: Process requests within 5 seconds, handle 100+ concurrent users
**Constraints**: <5000ms p95 response time, stateless operation, user data isolation
**Scale/Scope**: 1000+ users, multi-turn conversations, natural language processing

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Integration-First Architecture: Chat endpoint will integrate via API only with existing frontend
- ✅ Agentic Workflow Enforcement: AI agent will use MCP tools exclusively for task operations
- ✅ Stateless Design Mandates: System will maintain stateless operation with DB as source of truth
- ✅ MCP-First Interaction Rules: All task operations will go through MCP tools, not direct DB access
- ✅ No-Manual-Code Policy: Implementation will follow Spec-Driven Development workflow
- ✅ Existing Frontend Preservation: No changes to existing frontend UI will be made

## Project Structure

### Documentation (this feature)

```text
specs/006-ai-chat-backend/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (extends existing backend)

```text
backend/
└── mcp_tools/           # Extends existing MCP tools structure
    ├── src/
    │   ├── __init__.py
    │   ├── main.py                 # FastAPI application entry point
    │   ├── config/                 # Configuration and settings
    │   │   └── settings.py
    │   ├── database/              # Database connection and models (reuse from MCP tools)
    │   │   ├── __init__.py
    │   │   ├── session.py         # Database session management (reuse from MCP tools)
    │   │   └── models/            # SQLModel definitions (reuse from MCP tools)
    │   │       ├── __init__.py
    │   │       ├── task.py        # Task model (reuse from MCP tools)
    │   │       ├── conversation.py # Conversation model (reuse from MCP tools)
    │   │       └── message.py     # Message model (reuse from MCP tools)
    │   ├── agents/                # AI agent implementation
    │   │   ├── __init__.py
    │   │   ├── runner.py          # OpenAI Agent Runner
    │   │   └── tools/             # MCP tools integration
    │   │       ├── __init__.py
    │   │       └── mcp_client.py  # Client for MCP tools
    │   ├── api/                   # API routes
    │   │   ├── __init__.py
    │   │   └── chat.py            # Chat endpoint implementation
    │   └── logging_config.py      # Logging configuration (reuse from MCP tools)
    ├── tests/
    │   ├── __init__.py
    │   ├── unit/                  # Unit tests for individual components
    │   │   ├── __init__.py
    │   │   └── test_chat_endpoint.py
    │   ├── integration/           # Integration tests
    │   │   ├── __init__.py
    │   │   └── test_ai_agent_integration.py
    │   └── contract/              # Contract tests
    │       ├── __init__.py
    │       └── test_api_contracts.py
    ├── requirements.txt           # Project dependencies
    └── .env.example             # Environment variable examples
```

**Structure Decision**: Extends existing backend/mcp_tools structure to leverage existing database models and MCP tools infrastructure. This maintains consistency with the existing architecture while adding the AI chat functionality.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [None] | [N/A] | [All constitution checks passed] |