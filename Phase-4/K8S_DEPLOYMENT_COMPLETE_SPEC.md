# Specification: Kubernetes Deployment Pipeline for Todo Chatbot System
## Phase IV — Local Kubernetes Deployment

---

## Objective

Deploy the Todo Chatbot System to a local Kubernetes cluster using Minikube with Helm charts for packaging and AI-enhanced DevOps tools for operations. The system consists of a stateless frontend, backend API with AI agents and MCP tools, and supporting services. The deployment must be reproducible, secure, and scalable while maintaining zero-downtime updates.

---

## Scope

### In Scope
- Deployment of frontend, backend, AI agent, and MCP services to Minikube
- Creation of Helm charts for each service and an umbrella chart
- Implementation of a CI-like local deployment pipeline
- Integration of AI DevOps tools (kubectl-ai, kagent, Docker AI)
- Configuration of Kubernetes resources (Deployments, Services, ConfigMaps, Secrets)
- Environment management for local development
- Security implementation with namespace isolation and secrets management

### Out of Scope
- Modification of existing frontend code
- Production deployment to cloud providers
- Manual infrastructure coding outside of specs
- Database schema changes
- Third-party service integrations beyond those already implemented

---

## Functional Requirements

### 1. Container Deployment
- **REQ-001**: Deploy frontend container as a Kubernetes Deployment
- **REQ-002**: Deploy backend container with FastAPI, AI Agent, and MCP tools as a Kubernetes Deployment
- **REQ-003**: Deploy AI Agent service container as a Kubernetes Deployment
- **REQ-004**: Deploy MCP tool service container as a Kubernetes Deployment
- **REQ-005**: Each service must run in a separate Kubernetes Deployment with configurable replicas

### 2. Kubernetes Resource Design
- **REQ-010**: Create namespace isolation using "chatbot-dev" namespace
- **REQ-011**: Define Deployments with proper resource requests and limits
- **REQ-012**: Configure Services with ClusterIP type for internal communication
- **REQ-013**: Create ConfigMaps for non-sensitive configuration data
- **REQ-014**: Implement Secrets for sensitive data (API keys, database credentials)
- **REQ-015**: Configure health probes (liveness and readiness) for all services
- **REQ-016**: Implement optional local ingress for external access

### 3. Helm Packaging
- **REQ-020**: Create individual Helm chart for frontend service
- **REQ-021**: Create individual Helm chart for backend service
- **REQ-022**: Create individual Helm chart for AI agent service
- **REQ-023**: Create individual Helm chart for MCP service
- **REQ-024**: Create umbrella Helm chart that includes all services
- **REQ-025**: Implement centralized values.yaml for configuration management
- **REQ-026**: Establish dependency management between charts

### 4. Local CI-like Deployment Pipeline
- **REQ-030**: Implement docker build step in pipeline
- **REQ-031**: Implement docker tag step in pipeline
- **REQ-032**: Implement minikube image load step in pipeline
- **REQ-033**: Implement helm install/upgrade step in pipeline
- **REQ-034**: Implement rollout verification step in pipeline
- **REQ-035**: Implement pod health validation step in pipeline

### 5. AI DevOps Integration
- **REQ-040**: Support docker ai (Gordon) for container operations
- **REQ-041**: Support kubectl-ai for Kubernetes operations
- **REQ-042**: Support kagent for cluster management
- **REQ-043**: Enable deployment creation via AI tools
- **REQ-044**: Enable scaling operations via AI tools
- **REQ-045**: Enable pod debugging via AI tools
- **REQ-046**: Enable cluster analysis via AI tools
- **REQ-047**: Enable resource optimization via AI tools

### 6. Environment Management
- **REQ-050**: Support OpenAI API keys via Kubernetes Secrets
- **REQ-051**: Support database connection configuration
- **REQ-052**: Support MCP endpoint configuration
- **REQ-053**: Support backend URL configuration
- **REQ-054**: Support model configuration parameters
- **REQ-055**: Support configurable service ports
- **REQ-056**: Support environment mode configuration
- **REQ-057**: All secrets must be stored using Kubernetes Secrets

---

## Non Functional Requirements

### Reliability
- **NFR-001**: Implement rolling updates with no downtime
- **NFR-002**: Ensure zero-downtime restart capability
- **NFR-003**: Configure readiness probes for graceful traffic routing
- **NFR-004**: Configure liveness probes for automatic recovery

### Scalability
- **NFR-010**: Enable configurable replica counts
- **NFR-011**: Prepare for horizontal scaling with HPA
- **NFR-012**: Implement proper resource limits and requests
- **NFR-013**: Design for horizontal scaling readiness

### Security
- **NFR-020**: Enforce namespace isolation
- **NFR-021**: Run containers as non-root users
- **NFR-022**: Implement proper secrets management
- **NFR-023**: Restrict service access and permissions
- **NFR-024**: Encrypt secrets at rest

### Observability
- **NFR-030**: Ensure logs accessible via kubectl
- **NFR-031**: Enable deployment status monitoring
- **NFR-032**: Provide pod diagnostics capabilities
- **NFR-033**: Implement health check endpoints

---

## Architecture Design

### Kubernetes Architecture Overview
```
Minikube Cluster (Local)
├── Namespace: chatbot-dev
│   ├── Deployment: frontend
│   │   ├── ReplicaSet
│   │   │   └── Pod(s): frontend-container
│   │   └── Service: frontend-service (NodePort)
│   ├── Deployment: backend
│   │   ├── ReplicaSet
│   │   │   └── Pod(s): backend-container (FastAPI + AI Agent + MCP)
│   │   └── Service: backend-service (ClusterIP)
│   ├── Deployment: agent
│   │   ├── ReplicaSet
│   │   │   └── Pod(s): agent-container (AI Agent)
│   │   └── Service: agent-service (ClusterIP)
│   └── Deployment: mcp
│       ├── ReplicaSet
│       │   └── Pod(s): mcp-container (MCP Server)
│       └── Service: mcp-service (ClusterIP)
└── External: Neon PostgreSQL Database
```

### Resource Mapping Table

| Resource Type | Name | Purpose | Configuration |
|---------------|------|---------|---------------|
| Namespace | chatbot-dev | Isolated environment for chatbot services | Default resource quotas |
| Deployment | frontend | Serves Next.js frontend application | 2 replicas, 500m CPU, 512Mi RAM |
| Service | frontend-service | Exposes frontend to external traffic | NodePort 30000, targets port 3000 |
| Deployment | backend | Runs FastAPI backend with AI agents and MCP | 2 replicas, 1000m CPU, 1Gi RAM |
| Service | backend-service | Internal API access for backend | ClusterIP, targets port 8000 |
| Deployment | agent | Dedicated AI agent service | 1 replica, 500m CPU, 512Mi RAM |
| Service | agent-service | Internal access to AI agents | ClusterIP, targets port 8001 |
| Deployment | mcp | MCP tool server | 1 replica, 300m CPU, 256Mi RAM |
| Service | mcp-service | Internal access to MCP tools | ClusterIP, targets port 8002 |
| ConfigMap | frontend-config | Frontend configuration | API_BASE_URL, LOG_LEVEL |
| ConfigMap | backend-config | Backend configuration | DATABASE_HOST, MCP_SERVER_URL |
| Secret | database-secrets | Database credentials | DATABASE_URL |
| Secret | api-keys | API keys | OPENAI_API_KEY, ANTHROPIC_API_KEY |
| Secret | auth-secrets | Authentication | AUTH_SECRET, JWT_SECRET |

---

## Deployment Model

### Helm Chart Structure
```
todo-chatbot-umbrella/
├── Chart.yaml
├── values.yaml
├── requirements.yaml
├── templates/
│   ├── NOTES.txt
│   ├── _helpers.tpl
│   └── ingress.yaml
└── charts/
    ├── frontend/
    │   ├── Chart.yaml
    │   ├── values.yaml
    │   └── templates/
    │       ├── deployment.yaml
    │       ├── service.yaml
    │       ├── configmap.yaml
    │       ├── hpa.yaml
    │       └── _helpers.tpl
    ├── backend/
    │   ├── Chart.yaml
    │   ├── values.yaml
    │   └── templates/
    │       ├── deployment.yaml
    │       ├── service.yaml
    │       ├── configmap.yaml
    │       ├── secret.yaml
    │       ├── hpa.yaml
    │       └── _helpers.tpl
    ├── agent/
    │   ├── Chart.yaml
    │   ├── values.yaml
    │   └── templates/
    │       ├── deployment.yaml
    │       ├── service.yaml
    │       ├── configmap.yaml
    │       ├── hpa.yaml
    │       └── _helpers.tpl
    └── mcp/
        ├── Chart.yaml
        ├── values.yaml
        └── templates/
            ├── deployment.yaml
            ├── service.yaml
            ├── configmap.yaml
            ├── hpa.yaml
            └── _helpers.tpl
```

### Deployment Workflow
1. **Preparation Phase**
   - Validate Minikube cluster status
   - Enable required Minikube addons (ingress, metrics-server)
   - Verify Docker images exist locally

2. **Image Preparation Phase**
   - Tag Docker images for Minikube registry
   - Load images into Minikube cluster

3. **Helm Deployment Phase**
   - Install/upgrade umbrella Helm chart
   - Wait for all deployments to become ready
   - Verify service accessibility

4. **Validation Phase**
   - Check pod health and status
   - Validate service endpoints
   - Confirm application functionality

---

## Pipeline Flow

### CI-like Local Pipeline
```
Source Code → Build Images → Tag Images → Load to Minikube → Deploy with Helm → Verify → Access
```

### Detailed Pipeline Steps

#### Step 1: Build
```bash
# Build frontend container
docker build -t todo-chatbot/frontend:$(date +%s) -f frontend/Dockerfile .

# Build backend container  
docker build -t todo-chatbot/backend:$(date +%s) -f backend/Dockerfile .
```

#### Step 2: Tag and Load
```bash
# Configure Docker to use Minikube's container registry
eval $(minikube docker-env)

# Tag images for Minikube
docker tag todo-chatbot/frontend:$(date +%s) todo-chatbot/frontend:latest
docker tag todo-chatbot/backend:$(date +%s) todo-chatbot/backend:latest

# Images are automatically loaded into Minikube
```

#### Step 3: Deploy
```bash
# Deploy using Helm with AI assistance
helm upgrade --install todo-chatbot . \
  --namespace chatbot-dev \
  --create-namespace \
  --set frontend.image.tag=latest \
  --set backend.image.tag=latest
```

#### Step 4: Verify
```bash
# Wait for deployments to be ready
kubectl rollout status deployment/frontend-deployment -n chatbot-dev
kubectl rollout status deployment/backend-deployment -n chatbot-dev

# Verify services are accessible
kubectl get svc -n chatbot-dev
```

#### Step 5: Access
```bash
# Get frontend URL
minikube service frontend-service -n chatbot-dev --url
```

---

## Environment Configuration Strategy

### Configuration Management
- **Values.yaml**: Centralized configuration for all services
- **ConfigMaps**: Non-sensitive configuration data
- **Secrets**: Sensitive data (API keys, passwords) stored as Kubernetes Secrets
- **Environment Variables**: Passed to containers via ConfigMaps/Secrets

### Environment Variables Structure
```yaml
# Global configuration
global:
  imageRegistry: ""
  storageClass: "standard"
  namespace: "chatbot-dev"

# Frontend configuration
frontend:
  replicaCount: 2
  image:
    repository: todo-chatbot/frontend
    tag: latest
    pullPolicy: IfNotPresent
  service:
    type: NodePort
    port: 3000
    nodePort: 30000
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 100m
      memory: 128Mi
  config:
    apiUrl: "http://backend-service:8000"

# Backend configuration
backend:
  replicaCount: 2
  image:
    repository: todo-chatbot/backend
    tag: latest
    pullPolicy: IfNotPresent
  service:
    type: ClusterIP
    port: 8000
  resources:
    limits:
      cpu: 1000m
      memory: 1Gi
    requests:
      cpu: 200m
      memory: 256Mi
  config:
    databaseUrl: "postgresql://user:pass@neon-db:5432/todo"
    mcpServerUrl: "http://mcp-service:8002"
```

---

## Security Model

### Container Security
- **Non-root Execution**: All containers run as non-root users
- **Minimal Base Images**: Use Alpine or distroless base images
- **Image Scanning**: Scan images for vulnerabilities before deployment
- **Read-only Root Filesystem**: Where possible, mount root filesystem as read-only

### Kubernetes Security
- **RBAC**: Implement Role-Based Access Control for all resources
- **Network Policies**: Define network policies to restrict pod communication
- **Pod Security Standards**: Apply baseline or restricted pod security standards
- **Secrets Management**: Store sensitive data in Kubernetes secrets, not configmaps

### Data Security
- **Encryption at Rest**: Ensure persistent volumes are encrypted
- **Encryption in Transit**: Use TLS for all inter-service communication
- **Database Security**: Secure database connections with proper authentication
- **Audit Logging**: Enable audit logging for all security-relevant events

### Deployment Security
- **Immutable Images**: Use immutable image tags for deployments
- **Signed Images**: Implement image signing and verification
- **Least Privilege**: Grant minimum required permissions to pods
- **Security Context**: Configure security contexts for all pods

---

## Networking Strategy

### Service Communication
- **Internal Communication**: Services communicate via ClusterIP services
- **External Access**: Frontend accessible via NodePort or Ingress
- **Load Balancing**: Kubernetes service discovery and load balancing
- **DNS Resolution**: Internal DNS resolution for service discovery

### Network Policies
- **Isolation**: Network policies to isolate services within namespace
- **Egress Control**: Control outbound traffic from pods
- **Ingress Control**: Control inbound traffic to services
- **Namespace Segregation**: Prevent cross-namespace communication

---

## AI DevOps Integration Design

### Docker AI (Gordon) Integration
- **Image Optimization**: Use Gordon to optimize Docker images
- **Build Assistance**: Use Gordon for Dockerfile creation and optimization
- **Troubleshooting**: Use Gordon for container issue diagnosis

### Kubectl-AI Integration
- **Resource Management**: Use kubectl-ai for Kubernetes resource operations
- **Deployment Creation**: Use AI to generate Kubernetes manifests
- **Scaling Operations**: Use AI for scaling decisions
- **Debugging**: Use AI for pod and deployment debugging

### Kagent Integration
- **Cluster Operations**: Use kagent for cluster management tasks
- **Deployment Automation**: Use kagent for automated deployments
- **Analysis**: Use kagent for cluster and resource analysis

### AI-Enhanced Operations
- **Predictive Scaling**: AI-driven scaling recommendations
- **Anomaly Detection**: AI-powered monitoring and alerting
- **Optimization**: AI-driven resource optimization
- **Troubleshooting**: AI-powered issue resolution

---

## Success Criteria

### Technical Success Criteria
- [ ] All services deployed successfully to Minikube
- [ ] Helm charts install without errors
- [ ] All pods running and healthy
- [ ] Services accessible internally and externally
- [ ] Zero-downtime deployments achieved
- [ ] AI DevOps tools integrated and functional
- [ ] Security requirements met

### Functional Success Criteria
- [ ] Frontend UI accessible via browser
- [ ] Backend API endpoints responsive
- [ ] AI agents functioning correctly
- [ ] MCP tools accessible and operational
- [ ] Database connectivity established
- [ ] Authentication working properly

### Performance Success Criteria
- [ ] Response times within acceptable limits
- [ ] Resource utilization optimized
- [ ] Horizontal scaling functional
- [ ] Load distribution working properly

---

## Constraints

### Technical Constraints
- **Spec-Driven Development**: All implementation must follow specifications
- **No Manual Infrastructure Coding**: Infrastructure as code only
- **Existing Frontend Unchanged**: Do not modify frontend code
- **Helm Charts Mandatory**: All deployments must use Helm
- **Local Minikube Only**: Deployment limited to local Minikube
- **AI DevOps Tools Required**: Must integrate kubectl-ai, kagent, Docker AI
- **Reproducible Deployment**: Deployment must be repeatable

### Operational Constraints
- **Stateless Design**: All services must be stateless
- **Namespace Isolation**: All resources in chatbot-dev namespace
- **Secrets Management**: All sensitive data in Kubernetes Secrets
- **Health Probes**: All services must have health checks
- **Resource Limits**: All deployments must have resource requests/limits

---

## Deliverables

### Required Deliverables
1. **Helm Charts**: Complete set of individual and umbrella Helm charts
2. **Kubernetes Manifests**: Generated from Helm templates
3. **Deployment Pipeline**: CI-like local deployment script
4. **Configuration Files**: Values.yaml and environment configurations
5. **Documentation**: Deployment and operation guides
6. **Security Implementation**: RBAC, network policies, and security contexts
7. **AI DevOps Integration**: Scripts and configurations for AI tools

### Supporting Deliverables
1. **Validation Scripts**: Scripts to verify deployment success
2. **Troubleshooting Guide**: Guide for common deployment issues
3. **Scaling Configuration**: HPA and resource configuration
4. **Monitoring Setup**: Basic monitoring configuration
5. **Backup/Recovery Procedures**: Procedures for backup and recovery

---

## Acceptance Conditions

### Pre-Deployment Acceptance
- [ ] Minikube cluster running and accessible
- [ ] Docker images built and available
- [ ] Helm client installed and configured
- [ ] AI DevOps tools installed and accessible
- [ ] All prerequisites verified

### Deployment Acceptance
- [ ] Helm chart installation successful
- [ ] All deployments in "Running" state
- [ ] All services accessible and responsive
- [ ] Health checks passing
- [ ] AI DevOps tools functional
- [ ] Security requirements satisfied

### Post-Deployment Acceptance
- [ ] Application functionality verified
- [ ] Zero-downtime update capability confirmed
- [ ] Scaling functionality tested
- [ ] Monitoring and logging working
- [ ] Security scanning passed
- [ ] Performance benchmarks met

### Operational Acceptance
- [ ] Documentation complete and accurate
- [ ] Troubleshooting procedures validated
- [ ] Rollback procedures tested
- [ ] Maintenance procedures documented
- [ ] Team trained on operations