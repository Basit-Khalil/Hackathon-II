# Spec 1: Docker Containerization of Todo AI Chatbot
## Phase IV — Cloud Native Deployment

### System Components
- **Next.js ChatKit frontend** - Interactive chat interface
- **FastAPI backend** - RESTful API server with async capabilities
- **MCP Server** - Model Context Protocol server for AI integration
- **OpenAI Agents SDK** - AI agent orchestration framework
- **Neon PostgreSQL** - External database service
- **Better Auth** - Authentication and authorization middleware

---

## Container Architecture

### Backend Container
The backend container will house all server-side components in a single service for architectural simplicity:

```
Backend Container
├── FastAPI Application Server
│   ├── Chat API endpoints
│   ├── Todo management endpoints
│   └── Health check endpoints
├── MCP Server Integration
│   ├── Tool registration
│   └── Context management
├── OpenAI Agents SDK
│   ├── Agent orchestration
│   └── LLM integration
├── Better Auth Middleware
│   ├── User authentication
│   └── Session management
├── Database Connection Pool
│   └── Neon PostgreSQL connector
└── Configuration Layer
    ├── Environment variables
    └── Runtime settings
```

### Frontend Container
The frontend container will serve the Next.js application:

```
Frontend Container
├── Next.js Application
│   ├── ChatKit UI components
│   ├── API integration layer
│   └── Static asset serving
├── Build-time Configuration
│   └── Environment variable injection
└── Runtime Configuration
    └── API endpoint configuration
```

### Inter-container Communication
- Frontend communicates with backend via HTTP/HTTPS
- Backend connects to Neon PostgreSQL externally
- All inter-service communication uses environment-configured endpoints

---

## Image Structure

### Backend Dockerfile Structure (Multi-stage)
```dockerfile
# Build stage
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim
WORKDIR /app

# Install minimal system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder stage
COPY --from=builder /root/.local /root/.local

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Copy application code
COPY --chown=app:app . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start command
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile Structure (Multi-stage)
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Create non-root user
RUN addgroup -g 1001 -S nextjs && \
    adduser -S nextjs -u 1001
USER nextjs

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
COPY --from=builder --chown=nextjs:nextjs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nextjs /app/package*.json ./

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start command
CMD ["npm", "start"]
```

---

## Build Flow

### Backend Build Process
1. **Dependency Resolution**
   - Parse `requirements.txt` for Python dependencies
   - Install packages in isolated builder stage
   - Cache dependencies for faster rebuilds

2. **Code Compilation**
   - Copy application source code
   - Perform any necessary compilation steps
   - Validate code integrity

3. **Image Assembly**
   - Create minimal production image
   - Copy dependencies from builder stage
   - Apply security hardening (non-root user)
   - Configure health checks

### Frontend Build Process
1. **Dependency Installation**
   - Install production-only Node.js packages
   - Leverage Docker layer caching for dependencies

2. **Application Build**
   - Execute Next.js build process
   - Generate optimized static assets
   - Create server-side rendering bundles

3. **Production Image Creation**
   - Create lightweight runtime image
   - Copy built assets from builder stage
   - Configure security and health checks

### Build Optimization Strategies
- **Layer Caching**: Dependencies cached separately from application code
- **Multi-stage Builds**: Reduce final image size by excluding build tools
- **Slim Base Images**: Use Alpine or slim variants for minimal footprint
- **Security Scanning**: Integrate vulnerability scanning in build process

---

## Runtime Flow

### Backend Runtime Configuration
1. **Initialization Sequence**
   - Environment variable validation
   - Database connection establishment
   - MCP server initialization
   - AI agent registration
   - Authentication system setup

2. **Service Startup**
   - FastAPI application startup
   - Background task initialization
   - Health check endpoints activation
   - Metrics collection setup

3. **Runtime Operations**
   - Request processing through FastAPI
   - Authentication validation via Better Auth
   - Database operations through connection pool
   - AI agent invocation via OpenAI SDK
   - MCP tool execution

### Frontend Runtime Configuration
1. **Server Initialization**
   - Next.js server startup
   - Static asset serving configuration
   - API endpoint configuration
   - Client-side hydration preparation

2. **Request Handling**
   - Route resolution
   - Server-side rendering
   - Static asset delivery
   - API proxy configuration

### Health Monitoring
- **Liveness Probes**: Verify application responsiveness
- **Readiness Probes**: Confirm service availability
- **Resource Monitoring**: Track CPU/memory usage
- **Log Collection**: Aggregate application logs

---

## Security Strategy

### Container Security
- **Non-root Execution**: All containers run as non-root users
- **Minimal Attack Surface**: Slim base images with minimal packages
- **Read-only Filesystems**: Where possible, mount read-only layers
- **Seccomp Profiles**: Restrict system call access

### Secrets Management
- **Environment Variables**: All sensitive data via environment variables
- **No Hardcoded Secrets**: Zero secrets in Dockerfiles or source code
- **External Secret Stores**: Integration with secret management systems
- **Credential Rotation**: Support for dynamic credential updates

### Network Security
- **Internal Communication**: Encrypted communication between containers
- **Port Exposure**: Minimal port exposure (only required ports)
- **Network Policies**: Container network segmentation
- **TLS Termination**: SSL/TLS termination at service boundaries

### Image Security
- **Vulnerability Scanning**: Automated scanning of base images
- **Dependency Updates**: Regular updates of base images and packages
- **Signed Images**: Image signing and verification
- **Immutable Tags**: Use immutable image tags for consistency

### Authentication & Authorization
- **Better Auth Integration**: Secure authentication middleware
- **Session Management**: Secure session handling
- **Token Validation**: JWT token validation
- **Rate Limiting**: API rate limiting to prevent abuse

---

## Deployment Readiness Checklist

### Pre-Build Verification
- [ ] Dockerfiles follow multi-stage pattern
- [ ] Base images are minimal and secure
- [ ] No hardcoded secrets in Dockerfiles
- [ ] .dockerignore files properly configured
- [ ] Dependencies listed in requirements/package files
- [ ] Health check endpoints implemented

### Build Verification
- [ ] Images build successfully in CI environment
- [ ] Multi-stage builds optimize image size
- [ ] Security scanning passes
- [ ] Images pushed to registry
- [ ] Image tags follow semantic versioning
- [ ] Build logs are clean and informative

### Runtime Verification
- [ ] Containers start successfully
- [ ] Health checks pass consistently
- [ ] Environment variables properly configured
- [ ] Database connectivity established
- [ ] API endpoints accessible
- [ ] Authentication system functional

### Security Verification
- [ ] Containers run as non-root users
- [ ] No secrets in image layers
- [ ] Network ports properly restricted
- [ ] TLS/SSL properly configured
- [ ] Authentication enforced
- [ ] Input validation implemented

### Performance Verification
- [ ] Resource limits properly configured
- [ ] Response times meet SLA requirements
- [ ] Concurrency handling tested
- [ ] Memory usage optimized
- [ ] Database connection pooling functional
- [ ] Caching mechanisms effective

### Integration Verification
- [ ] Frontend-backend communication functional
- [ ] MCP server integration working
- [ ] AI agent SDK operational
- [ ] Better Auth integration complete
- [ ] Database operations successful
- [ ] Error handling robust

### Documentation Verification
- [ ] Dockerfile comments explain purpose
- [ ] Build instructions documented
- [ ] Runtime configuration documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide available
- [ ] Security guidelines documented

---

## Deliverables Summary

### Required Files
- `backend/Dockerfile` - Backend service containerization
- `frontend/Dockerfile` - Frontend service containerization
- `.dockerignore` (backend) - Backend build context optimization
- `.dockerignore` (frontend) - Frontend build context optimization
- `.env.example` - Environment variable template
- `docker-compose.yml` (optional) - Local development orchestration

### Optional Files
- `Makefile` - Build and deployment convenience commands
- `scripts/build.sh` - Build automation script
- `scripts/test.sh` - Container testing script

### Success Criteria
- [ ] Both containers build successfully
- [ ] Containers run with minimal resources
- [ ] Security best practices implemented
- [ ] Health checks functional
- [ ] Environment configuration flexible
- [ ] Ready for Kubernetes deployment

---

## Next Steps

After successful implementation of this specification:
1. Proceed to local testing with docker-compose
2. Validate container functionality
3. Prepare for Spec 2 (Kubernetes deployment)
4. Document lessons learned for future phases