---
description: "Task list for AI Chat Backend implementation"
---

# Tasks: AI Chat Backend for Todo AI Chatbot

**Input**: Design documents from `/specs/006-ai-chat-backend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests will be included for the chat endpoint to ensure it functions correctly.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/mcp_tools/`, `backend/mcp_tools/tests/` at repository root

<!--
  ============================================================================
  The tasks below are based on the user stories and requirements from spec.md:
  - User Story 1: AI Chat Endpoint Setup (Priority: P1)
  - User Story 2: Natural Language Processing to MCP Tools (Priority: P2)
  - User Story 3: Conversation Management and Statelessness (Priority: P3)
  ============================================================================ -->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Update requirements.txt with OpenAI Agents SDK dependency
- [X] T002 [P] Create agents directory structure in backend/chat_agent/src/agents/
- [X] T003 [P] Create API routes directory structure in backend/chat_agent/src/api/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create chat endpoint file in backend/chat_agent/src/api/chat.py
- [X] T005 Create OpenAI Agent Runner in backend/chat_agent/src/agents/runner.py
- [X] T006 Create MCP tools client in backend/chat_agent/src/tools/mcp_client.py
- [X] T007 Update main.py to include chat endpoint router
- [X] T008 Update settings.py with OpenAI configuration

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - AI Chat Endpoint Setup (Priority: P1) 🎯 MVP

**Goal**: Implement the POST /api/{user_id}/chat endpoint that can receive user messages and return structured responses

**Independent Test**: The system can receive a user message at the /api/{user_id}/chat endpoint, process it through the AI agent, and return a structured response with conversation_id, response text, and any tool calls made.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T009 [P] [US1] Unit test for chat endpoint in backend/chat_agent/tests/unit/test_chat_endpoint.py
- [X] T010 [P] [US1] Contract test for API structure in backend/chat_agent/tests/contract/test_api_contracts.py

### Implementation for User Story 1

- [X] T011 [US1] Implement POST /api/{user_id}/chat endpoint in backend/chat_agent/src/api/chat.py
- [X] T012 [US1] Add request/response models for chat endpoint
- [X] T013 [US1] Test basic endpoint functionality with mock agent

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Natural Language Processing to MCP Tools (Priority: P2)

**Goal**: Enable the AI agent to map natural language commands to appropriate MCP tool calls

**Independent Test**: When a user provides a natural language command (e.g., "Add a task to buy groceries"), the AI agent correctly identifies the intent and calls the appropriate MCP tool (e.g., add_task).

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [X] T014 [P] [US2] Unit test for natural language processing in backend/chat_agent/tests/unit/test_nlp_processing.py
- [X] T015 [P] [US2] Unit test for tool mapping in backend/chat_agent/tests/unit/test_tool_mapping.py

### Implementation for User Story 2

- [X] T016 [P] [US2] Implement MCP tools client interface in backend/chat_agent/src/tools/mcp_client.py
- [X] T017 [P] [US2] Integrate OpenAI Agent with MCP tools in backend/chat_agent/src/agents/runner.py
- [X] T018 [US2] Implement natural language to tool mapping logic
- [X] T019 [US2] Test tool execution with various natural language inputs

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Conversation Management and Statelessness (Priority: P3)

**Goal**: Implement conversation history management while maintaining stateless execution

**Independent Test**: The system can fetch conversation history from the database, process a new message, store the response, and maintain proper conversation continuity without storing session data on the server.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [X] T020 [P] [US3] Unit test for conversation history management in backend/chat_agent/tests/unit/test_conversation_history.py
- [X] T021 [P] [US3] Unit test for stateless execution in backend/chat_agent/tests/unit/test_stateless_execution.py

### Implementation for User Story 3

- [X] T022 [P] [US3] Implement conversation history retrieval from DB
- [X] T023 [P] [US3] Implement appending new user message to conversation history
- [X] T024 [P] [US3] Implement storing assistant response in conversation history
- [X] T025 [US3] Ensure stateless execution without server-side session storage
- [X] T026 [US3] Test conversation continuity across multiple requests

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T027 [P] Implement error handling and confirmation messages
- [X] T028 [P] Add comprehensive logging for chat interactions
- [X] T029 [P] Update README with AI chat functionality
- [X] T030 Security validation for user data isolation
- [X] T031 Performance testing of chat endpoint
- [X] T032 Integration test with existing frontend
- [X] T033 Update .env.example with OpenAI configuration

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence