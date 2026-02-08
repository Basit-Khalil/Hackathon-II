# Specification: Kubernetes Deployment Pipeline for Todo Chatbot System

## System Context
- **Phase III**: Todo Chatbot completed
- **Backend**: Includes AI Agent + MCP tools
- **Frontend**: Deployed separately
- **Containerization**: Docker containers required
- **Deployment Target**: Minikube (local)
- **Packaging**: Helm charts
- **AI DevOps Tools**: kubectl-ai, kagent, Docker AI Agent (Gordon)

---

## 1. Kubernetes Architecture

### Cluster Architecture
```
Minikube Cluster
├── Master Node
│   ├── kube-apiserver
│   ├── etcd
│   ├── kube-controller-manager
│   └── kube-scheduler
└── Worker Node
    ├── kubelet
    ├── kube-proxy
    └── containerd
        ├── frontend-pod
        │   └── frontend-container
        ├── backend-pod
        │   └── backend-container
        ├── agent-pod
        │   └── agent-container
        └── mcp-pod
            └── mcp-container
```

### Service Topology
```
External Traffic
├── Ingress Controller
│   ├── frontend-service (NodePort/LoadBalancer)
│   └── backend-service (ClusterIP)
└── External Database (Neon PostgreSQL)
```

### Namespace Strategy
- **todo-chatbot-system**: Main application namespace
- **monitoring**: Prometheus/Grafana monitoring stack
- **logging**: ELK stack for centralized logging
- **kube-system**: Kubernetes system components

### Pod Architecture
- **Frontend Pods**: Next.js application serving UI
- **Backend Pods**: FastAPI application with MCP server and AI agents
- **Agent Pods**: Dedicated OpenAI Agents SDK pods (optional, can be co-located)
- **MCP Pods**: Model Context Protocol service pods (optional, can be co-located)

---

## 2. Kubernetes Resource Mapping

### Deployments
| Component | Replicas | Resource Limits | Health Checks |
|-----------|----------|-----------------|---------------|
| frontend-deployment | 2 | CPU: 500m, RAM: 512Mi | Liveness: /health, Readiness: /ready |
| backend-deployment | 2 | CPU: 1000m, RAM: 1Gi | Liveness: /health, Readiness: /ready |
| agent-deployment | 1 | CPU: 500m, RAM: 512Mi | Liveness: /health, Readiness: /ready |
| mcp-deployment | 1 | CPU: 300m, RAM: 256Mi | Liveness: /health, Readiness: /ready |

### Services
| Service Name | Type | Port | Target | Purpose |
|--------------|------|------|--------|---------|
| frontend-service | NodePort | 3000:30000 | frontend-pods | External UI access |
| backend-service | ClusterIP | 8000 | backend-pods | Internal API access |
| agent-service | ClusterIP | 8001 | agent-pods | Agent communication |
| mcp-service | ClusterIP | 8002 | mcp-pods | MCP protocol access |

### ConfigMaps
| Name | Purpose | Contents |
|------|---------|----------|
| frontend-config | Frontend configuration | API_BASE_URL, LOG_LEVEL |
| backend-config | Backend configuration | DATABASE_HOST, MCP_SERVER_URL |
| agent-config | Agent configuration | OPENAI_API_KEY, AGENT_CONFIG_PATH |
| mcp-config | MCP configuration | MCP_PORT, MCP_TOOLS_PATH |

### Secrets
| Name | Purpose | Contents |
|------|---------|----------|
| database-secrets | Database credentials | DATABASE_URL |
| api-keys | API keys | OPENAI_API_KEY, ANTHROPIC_API_KEY |
| auth-secrets | Authentication | AUTH_SECRET, JWT_SECRET |
| ingress-tls | TLS certificates | tls.crt, tls.key |

### Persistent Volumes (Optional)
| Name | Storage Class | Size | Access Mode | Mount Path |
|------|---------------|------|-------------|------------|
| logs-pv | standard | 10Gi | ReadWriteOnce | /var/log/app |

---

## 3. Helm Chart Structure

### Umbrella Chart (Root)
```
todo-chatbot/
├── Chart.yaml
├── values.yaml
├── requirements.yaml
├── templates/
│   ├── NOTES.txt
│   ├── _helpers.tpl
│   └── ingress.yaml
├── charts/
│   ├── frontend/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── configmap.yaml
│   │       └── hpa.yaml
│   ├── backend/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── configmap.yaml
│   │       ├── secret.yaml
│   │       └── hpa.yaml
│   ├── agent/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       └── configmap.yaml
│   └── mcp/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           └── configmap.yaml
```

### Values Structure (values.yaml)
```yaml
# Global configuration
global:
  imageRegistry: ""
  storageClass: "standard"
  namespace: "todo-chatbot-system"

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

# Agent configuration
agent:
  replicaCount: 1
  image:
    repository: todo-chatbot/backend
    tag: latest
    pullPolicy: IfNotPresent
  service:
    type: ClusterIP
    port: 8001
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 100m
      memory: 128Mi

# MCP configuration
mcp:
  replicaCount: 1
  image:
    repository: todo-chatbot/backend
    tag: latest
    pullPolicy: IfNotPresent
  service:
    type: ClusterIP
    port: 8002
  resources:
    limits:
      cpu: 300m
      memory: 256Mi
    requests:
      cpu: 50m
      memory: 64Mi
```

---

## 4. Deployment Workflow

### Pre-Deployment Phase
1. **Validate Minikube Status**
   ```bash
   minikube status
   ```

2. **Start Minikube Cluster**
   ```bash
   minikube start --cpus=4 --memory=8192 --disk-size=40g
   ```

3. **Enable Required Addons**
   ```bash
   minikube addons enable ingress
   minikube addons enable metrics-server
   ```

4. **Verify Docker Images**
   ```bash
   docker images | grep todo-chatbot
   ```

### Deployment Phase
1. **Tag Images for Minikube**
   ```bash
   eval $(minikube docker-env)
   docker build -t todo-chatbot/frontend:latest -f frontend/Dockerfile .
   docker build -t todo-chatbot/backend:latest -f backend/Dockerfile .
   ```

2. **Install Helm Charts**
   ```bash
   # Install backend chart
   helm install backend ./charts/backend --namespace todo-chatbot-system --create-namespace
   
   # Install frontend chart
   helm install frontend ./charts/frontend --namespace todo-chatbot-system
   
   # Install agent chart
   helm install agent ./charts/agent --namespace todo-chatbot-system
   
   # Install mcp chart
   helm install mcp ./charts/mcp --namespace todo-chatbot-system
   
   # Or install umbrella chart
   helm install todo-chatbot . --namespace todo-chatbot-system --create-namespace
   ```

3. **Verify Deployments**
   ```bash
   kubectl get pods -n todo-chatbot-system
   kubectl get services -n todo-chatbot-system
   kubectl get deployments -n todo-chatbot-system
   ```

### Post-Deployment Phase
1. **Access Application**
   ```bash
   minikube service frontend-service -n todo-chatbot-system
   ```

2. **Monitor Health**
   ```bash
   kubectl get events -n todo-chatbot-system
   kubectl logs -l app=frontend -n todo-chatbot-system
   kubectl logs -l app=backend -n todo-chatbot-system
   ```

---

## 5. Pipeline Flow

### CI-like Local Pipeline
```
Source Code → Build Images → Tag Images → Deploy to Minikube → Verify → Access
```

### Detailed Pipeline Steps

#### Step 1: Build
```bash
# Build frontend container
docker build -t todo-chatbot/frontend:$(date +%s) -f frontend/Dockerfile .

# Build backend container  
docker build -t todo-chatbot/backend:$(date +%s) -f backend/Dockerfile .
```

#### Step 2: Tag
```bash
# Tag for Minikube
eval $(minikube docker-env)
docker tag todo-chatbot/frontend:$(date +%s) todo-chatbot/frontend:latest
docker tag todo-chatbot/backend:$(date +%s) todo-chatbot/backend:latest
```

#### Step 3: Deploy
```bash
# Deploy using Helm
helm upgrade --install todo-chatbot . \
  --namespace todo-chatbot-system \
  --create-namespace \
  --set frontend.image.tag=latest \
  --set backend.image.tag=latest
```

#### Step 4: Verify
```bash
# Wait for deployments to be ready
kubectl rollout status deployment/frontend-deployment -n todo-chatbot-system
kubectl rollout status deployment/backend-deployment -n todo-chatbot-system

# Verify services are accessible
kubectl get svc -n todo-chatbot-system
```

#### Step 5: Access
```bash
# Get frontend URL
minikube service frontend-service -n todo-chatbot-system --url
```

### AI DevOps Integration Pipeline
```bash
# Use Docker AI Agent (Gordon) for image optimization
docker ai optimize --image todo-chatbot/backend:latest
docker ai optimize --image todo-chatbot/frontend:latest

# Use kubectl-ai for deployment
kubectl-ai apply -f k8s-manifests/ --namespace todo-chatbot-system

# Use kagent for cluster operations
kagent deploy --chart todo-chatbot --namespace todo-chatbot-system
```

---

## 6. Security Considerations

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

### API Security
- **TLS Termination**: Enable TLS for all external communications
- **Authentication**: Implement proper authentication for all services
- **Rate Limiting**: Apply rate limiting to prevent abuse
- **Input Validation**: Validate all inputs to prevent injection attacks

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

### Monitoring and Compliance
- **Security Monitoring**: Implement continuous security monitoring
- **Compliance Checking**: Regular compliance checks against security policies
- **Incident Response**: Define incident response procedures
- **Regular Updates**: Keep Kubernetes and all components updated

---

## Non-Functional Requirements

### Zero Downtime Restart
- **Readiness Probes**: Ensure pods are ready before routing traffic
- **Liveness Probes**: Detect and restart unhealthy pods
- **Rolling Updates**: Use rolling update strategy for deployments
- **Pod Disruption Budgets**: Maintain minimum available pods during updates

### Namespace Isolation
- **Resource Quotas**: Limit resource consumption per namespace
- **Network Policies**: Isolate network traffic between namespaces
- **RBAC Boundaries**: Separate permissions between namespaces
- **Labeling Strategy**: Consistent labeling for resource identification

### Log Accessibility
- **Structured Logging**: Use structured logging format (JSON)
- **Centralized Logging**: Forward logs to centralized logging solution
- **Log Retention**: Configure appropriate log retention policies
- **Log Aggregation**: Aggregate logs by service and namespace

### Health Checks
- **Liveness Probes**: Detect deadlocked applications
- **Readiness Probes**: Determine when pods are ready for traffic
- **Startup Probes**: Handle slow-starting applications
- **Custom Health Endpoints**: Implement meaningful health checks

### Horizontal Scalability Ready
- **Stateless Design**: Ensure applications are stateless
- **Horizontal Pod Autoscaler**: Configure HPAs based on metrics
- **Cluster Autoscaler**: Enable cluster autoscaling for nodes
- **Resource Requests/Limits**: Properly configure resource specifications