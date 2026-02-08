# Docker Containerization for Todo AI Chatbot
## Spec 1 Implementation

This document describes the Docker containerization of the Todo AI Chatbot system, including both frontend and backend services.

## Project Structure

```
.
├── backend/
│   ├── Dockerfile          # Backend container definition
│   └── .dockerignore       # Backend build context exclusions
├── frontend/
│   ├── Dockerfile          # Frontend container definition
│   └── .dockerignore       # Frontend build context exclusions
├── .env.example           # Environment variables template
├── docker-compose.yml     # Local development orchestration
├── GORDON_INTEGRATION.md  # Docker AI (Gordon) usage guide
└── VALIDATION_RESULTS.md  # Implementation verification
```

## Prerequisites

- Docker Engine (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Access to Neon PostgreSQL database
- API keys for AI providers (OpenAI, Anthropic)

## Building the Containers

### Backend Container
```bash
# Build the backend container
docker build -t todo-chatbot-backend -f backend/Dockerfile .
```

### Frontend Container
```bash
# Build the frontend container
docker build -t todo-chatbot-frontend -f frontend/Dockerfile .
```

## Running the Containers

### Individual Containers

#### Backend
```bash
# Run the backend container
docker run -d \
  --name backend-container \
  -p 8000:8000 \
  -e DATABASE_URL="your_neon_postgres_url" \
  -e OPENAI_API_KEY="your_openai_api_key" \
  -e AUTH_SECRET="your_auth_secret" \
  todo-chatbot-backend
```

#### Frontend
```bash
# Run the frontend container
docker run -d \
  --name frontend-container \
  -p 3000:3000 \
  -e BACKEND_URL="http://host.docker.internal:8000" \
  todo-chatbot-frontend
```

### Using Docker Compose (Recommended for local development)

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your actual values:
```bash
# Edit the .env file with your actual values
# DATABASE_URL, OPENAI_API_KEY, AUTH_SECRET, etc.
```

3. Start the services:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend UI: http://localhost:3000
- Backend API: http://localhost:8000

## Container Features

### Backend Container
- Multi-stage build for optimized image size
- Python 3.11 runtime environment
- FastAPI application server with uvicorn
- MCP server integration
- OpenAI Agents SDK
- Better Auth authentication
- Health check endpoint at `/health`
- Non-root user execution for security
- Proper dependency management

### Frontend Container
- Multi-stage build for optimized image size
- Node.js 18 runtime environment
- Next.js production build
- ChatKit UI components
- Health check endpoint at `/api/health`
- Non-root user execution for security
- Proper static asset handling

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@neon-host.region.provider.neon.tech/dbname

# Authentication
AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# AI Provider Keys
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Backend API Configuration
BACKEND_URL=http://backend:8000  # Internal service URL
FRONTEND_URL=http://localhost:3000

# MCP Server Configuration
MCP_SERVER_PORT=8001
```

## Docker AI (Gordon) Integration

This implementation includes integration with Docker AI (Gordon) for:

- Container build optimization
- Performance analysis
- Troubleshooting assistance
- Security recommendations

See `GORDON_INTEGRATION.md` for detailed commands and prompts.

## Security Features

- **Non-root execution**: Both containers run as non-root users
- **Minimal base images**: Using slim/alpine variants
- **Secrets management**: No hardcoded secrets in Dockerfiles
- **Build context exclusions**: .dockerignore files exclude sensitive files
- **Health checks**: Built-in health check endpoints
- **Proper isolation**: Separate containers for frontend and backend

## Health Checks

### Backend Health Check
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-08T10:00:00Z",
  "dependencies": {
    "database": "connected",
    "mcp_server": "running"
  }
}
```

### Frontend Health Check
```bash
curl http://localhost:3000/api/health
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify `DATABASE_URL` is correctly set
   - Ensure Neon PostgreSQL is accessible
   - Check firewall/network settings

2. **API Key Issues**
   - Verify API keys are correctly set in environment
   - Check API key permissions and validity

3. **Container Build Issues**
   - Ensure all dependencies are properly listed
   - Check Docker version compatibility
   - Verify sufficient disk space

4. **Inter-Container Communication**
   - When using docker-compose, services can reach each other via service names
   - When running separately, use `host.docker.internal` for host access

### Using Docker AI for Troubleshooting

For complex issues, use Docker AI (Gordon):
```bash
# Analyze a problematic Dockerfile
docker ai analyze --file backend/Dockerfile

# Get optimization suggestions
docker ai optimize --image todo-chatbot-backend

# Debug runtime issues
docker ai troubleshoot --container backend-container
```

## Validation

To validate the implementation, run:

```bash
# Build and test individual containers
docker build -t todo-chatbot-backend -f backend/Dockerfile . && \
docker build -t todo-chatbot-frontend -f frontend/Dockerfile .

# Test with docker-compose
docker-compose up --build
```

Check `VALIDATION_RESULTS.md` for detailed validation steps and expected outcomes.

## Next Steps

Once this Docker containerization is validated:

1. Proceed to Spec 2: Kubernetes deployment
2. Implement CI/CD pipelines
3. Add monitoring and logging
4. Implement auto-scaling policies