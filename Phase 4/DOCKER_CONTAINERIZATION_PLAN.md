# Implementation Plan for Spec 1 — Docker Containerization
## Todo Chatbot System Container-Based Deployment

---

## 1. Container Architecture

### System Overview
```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Frontend      │    │    Backend       │    │  Neon PostgreSQL │
│   Container     │◄──►│    Container     │◄──►│    (External)    │
│                 │    │                  │    │                  │
│  Next.js        │    │  FastAPI         │    │  Todo Tables     │
│  ChatKit UI     │    │  MCP Server      │    │  User Tables     │
│  Port: 3000     │    │  OpenAI Agents   │    │  Session Tables  │
└─────────────────┘    │  Better Auth     │    └──────────────────┘
                       │  Port: 8000       │
                       └──────────────────┘
```

### Container Responsibilities
- **Frontend Container**: Serves Next.js application, handles UI rendering, manages user interactions
- **Backend Container**: Runs FastAPI server, MCP server, OpenAI Agents SDK, authentication
- **External Database**: Neon PostgreSQL for persistent data storage

### Internal Architecture (Backend Container)
```
Backend Container
├── FastAPI Application
│   ├── API Routes (/api/chat, /api/todo, /api/health)
│   ├── Better Auth Middleware
│   └── Database Connection Pool
├── MCP Server
│   ├── Tool Registration
│   └── Context Management
├── OpenAI Agents SDK
│   ├── Agent Orchestration
│   └── LLM Integration
└── Configuration Layer
    ├── Environment Variables
    └── Runtime Settings
```

---

## 2. Backend Container Plan

### Python Base Image Selection
- **Base Image**: `python:3.11-slim` for optimal balance of compatibility and size
- **Alternative**: `python:3.9-alpine` for smaller footprint if compatibility permits
- **Justification**: Maintains compatibility with existing dependencies while minimizing attack surface

### Dependency Installation Strategy
```
Stage 1: Builder
├── FROM python:3.11-slim as builder
├── WORKDIR /app
├── COPY requirements.txt .
└── RUN pip install --user --no-cache-dir -r requirements.txt

Stage 2: Production
├── FROM python:3.11-slim
├── WORKDIR /app
├── Install minimal system deps (gcc, curl)
├── COPY --from=builder /root/.local /root/.local
├── COPY --chown=app:app . .
└── USER app
```

### Uvicorn Runtime Setup
- **Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`
- **Workers**: 1 for initial deployment (can scale in future phases)
- **Reload**: Disabled for production stability
- **Logging**: Structured logging enabled

### Health Endpoint Configuration
- **Endpoint**: `/health` returning JSON status
- **Response**: `{"status": "healthy", "timestamp": "ISO8601"}`
- **Dependencies Check**: Database connectivity, MCP server status
- **Healthcheck Command**: `curl -f http://localhost:8000/health || exit 1`

---

## 3. Frontend Container Plan

### Next.js Build Stage
```
Stage 1: Builder
├── FROM node:18-alpine AS builder
├── WORKDIR /app
├── COPY package*.json ./
├── RUN npm ci --only=production
├── COPY . .
└── RUN npm run build

Stage 2: Runner
├── FROM node:18-alpine AS runner
├── WORKDIR /app
├── Install dumb-init for signal handling
├── Create non-root user
├── COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
├── COPY --from=builder --chown=nextjs:nextjs /app/node_modules ./node_modules
└── COPY --from=builder --chown=nextjs:nextjs /app/package*.json ./
```

### Production Start Command
- **Command**: `npm start` (runs `next start`)
- **Port**: 3000 (standard Next.js port)
- **Environment**: NODE_ENV=production

### Static Asset Handling
- **Optimization**: Next.js automatic optimization for images and assets
- **Caching**: Proper HTTP caching headers for static assets
- **Compression**: Gzip compression enabled

---

## 4. Build Optimization

### Multi-Stage Builds Implementation
- **Builder Stage**: Compiles/transpiles code, installs dependencies
- **Runner Stage**: Minimal runtime environment with only necessary files
- **Benefits**: Smaller final image size, security (no build tools in runtime)

### Dependency Caching Strategy
```
Docker Layer Caching:
├── Layer 1: Base image
├── Layer 2: System dependencies
├── Layer 3: Python/Node dependencies (cached separately)
├── Layer 4: Application code
└── Layer 5: Runtime configurations
```

### Small Image Layers Approach
- **Base Images**: Use slim/alpine variants
- **Cleanup**: Remove cache files after installation
- **Multi-stage**: Exclude build artifacts from final image
- **Pruning**: Remove unnecessary packages and files

---

## 5. Environment Handling

### .env.example Template
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@neon-host.region.provider.neon.tech/dbname

# Authentication
AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# AI Provider Keys
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Backend API Configuration
BACKEND_URL=http://backend:8000
FRONTEND_URL=http://localhost:3000

# MCP Server Configuration
MCP_SERVER_PORT=8001
```

### Runtime Variables
- **Database Connection**: Neon PostgreSQL connection string
- **API Keys**: Secure storage of AI provider keys
- **Service URLs**: Internal/external service communication endpoints
- **Authentication**: Secret keys and configuration

### API Base URL Configuration
- **Frontend**: Configurable API base URL for backend communication
- **Backend**: Database connection string and external service endpoints
- **Environment-Specific**: Different configurations for dev/staging/prod

---

## 6. Local Execution Strategy

### Docker Build Workflow
```bash
# Backend container
docker build -t todo-chatbot-backend -f backend/Dockerfile .

# Frontend container  
docker build -t todo-chatbot-frontend -f frontend/Dockerfile .

# Verify images
docker images | grep todo-chatbot
```

### Docker Run Verification
```bash
# Run backend container
docker run -d \
  --name backend-container \
  -p 8000:8000 \
  -e DATABASE_URL="..." \
  -e OPENAI_API_KEY="..." \
  todo-chatbot-backend

# Run frontend container
docker run -d \
  --name frontend-container \
  -p 3000:3000 \
  -e BACKEND_URL="http://localhost:8000" \
  --link backend-container \
  todo-chatbot-frontend

# Verify containers
docker ps
```

### Frontend/Backend Connectivity Testing
- **Health Check**: Verify backend `/health` endpoint
- **API Test**: Test `/api/chat` endpoint from frontend
- **Database**: Confirm database connectivity from backend
- **UI Verification**: Load frontend UI and test functionality

---

## 7. Gordon (Docker AI) Integration Plan

### Image Build via Docker AI
- **Command**: Use Gordon to generate optimized Dockerfile
- **Input**: Source code and requirements.txt/package.json
- **Output**: Production-ready Dockerfile with optimizations
- **Verification**: Compare AI-generated vs manual Dockerfile

### Debugging Assistance via Docker AI
- **Issue Identification**: Use Gordon to identify container issues
- **Performance Issues**: Optimize image size and build time
- **Security Issues**: Identify vulnerabilities and suggest fixes
- **Best Practices**: Ensure adherence to Docker best practices

### Optimization Suggestions
- **Layer Optimization**: Suggest optimal layer caching strategies
- **Base Image**: Recommend most appropriate base images
- **Security**: Propose security hardening techniques
- **Size Reduction**: Suggest methods to minimize image size

---

## 8. Validation Plan

### Backend Container Healthcheck Validation
```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2026-02-08T10:00:00Z",
  "dependencies": {
    "database": "connected",
    "mcp_server": "running"
  }
}
```

### Frontend UI Loading Validation
- **Page Load**: Verify Next.js application loads correctly
- **Static Assets**: Confirm CSS, JS, and images load properly
- **Client-side Rendering**: Test interactive components
- **API Integration**: Verify API calls to backend

### Chat Endpoint Accessibility
- **Endpoint**: `/api/chat` should accept POST requests
- **Payload**: Accepts messages in standard format
- **Response**: Returns AI-generated responses
- **Streaming**: Supports streaming responses if implemented

### MCP Tools Callability
- **Tool Registration**: MCP tools properly registered
- **Function Calls**: Backend can call MCP tools
- **Context Management**: MCP context properly handled
- **Response Processing**: MCP responses processed correctly

---

## Container Lifecycle Flow

```
Development → Build → Deploy → Run → Monitor → Scale

1. Development: Code changes in local environment
2. Build: Docker images created with multi-stage process
3. Deploy: Images pushed to registry, pulled to target environment
4. Run: Containers started with proper configuration
5. Monitor: Health checks and metrics collection
6. Scale: Prepare for horizontal scaling in future phases
```

## Build Sequence

```
Backend Build Sequence:
1.  Parse requirements.txt
2.  Pull base image (python:3.11-slim)
3.  Install system dependencies
4.  Install Python packages in builder stage
5.  Create non-root user
6.  Copy application code
7.  Set up health checks
8.  Configure entrypoint command
9.  Validate image security
10. Tag and store image

Frontend Build Sequence:
1.  Parse package.json
2.  Pull base image (node:18-alpine)
3.  Install production dependencies
4.  Build Next.js application
5.  Create minimal runtime image
6.  Copy built assets
7.  Set up health checks
8.  Configure entrypoint command
9.  Validate image security
10. Tag and store image
```

## Runtime Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Host Environment                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │   Frontend      │    │    Backend       │                   │
│  │   Container     │    │    Container     │                   │
│  │                 │    │                  │                   │
│  │  Port: 3000     │    │  Port: 8000      │                   │
│  │  Volume: none   │    │  Volume: none    │                   │
│  │  Env: BACKEND_  │    │  Env: DATABASE_  │                   │
│  │       URL       │    │       URL        │                   │
│  └─────────────────┘    └──────────────────┘                   │
│              │                    │                            │
│              └────────────────────┘                            │
│                        │                                       │
│                        ▼                                       │
│        ┌─────────────────────────────────┐                     │
│        │     Neon PostgreSQL (External)  │                     │
│        │                                 │                     │
│        │  Todo, User, Session Tables     │                     │
│        └─────────────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

## Dependency Mapping

```
Frontend Dependencies:
├── Next.js Framework
├── ChatKit Components
├── API Client Libraries
└── Build Tools (for build stage)

Backend Dependencies:
├── FastAPI Framework
├── SQLAlchemy/SQLModel
├── Better Auth
├── OpenAI SDK
├── MCP Server
└── uvicorn ASGI Server

Infrastructure Dependencies:
├── Docker Engine
├── Neon PostgreSQL
└── Host Network Stack
```

## Testing Strategy

### Unit Testing
- **Backend**: API endpoint unit tests
- **Frontend**: Component unit tests
- **Containers**: Individual container functionality

### Integration Testing
- **Frontend-Backend**: API communication tests
- **Database**: Database connectivity tests
- **MCP**: Tool integration tests

### Container Testing
- **Build**: Verify successful image builds
- **Run**: Confirm containers start properly
- **Health**: Validate health check endpoints
- **Load**: Test under simulated load conditions

### End-to-End Testing
- **User Flow**: Complete user interaction testing
- **Error Handling**: Test failure scenarios
- **Recovery**: Verify system recovery from failures