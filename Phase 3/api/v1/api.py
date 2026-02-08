from fastapi import APIRouter
from api.v1.endpoints import tasks
from api.v1.endpoints.auth import router as auth_router

api_router = APIRouter()

# Include task endpoints (already prefixed with /tasks in tasks.py)
api_router.include_router(tasks.router, prefix="", tags=["tasks"])

# Include auth endpoints (already prefixed with /auth in auth.py)
api_router.include_router(auth_router, prefix="", tags=["auth"])