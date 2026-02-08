from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional


router = APIRouter()


class HealthCheck(BaseModel):
    """
    Health check response model.
    """
    status: str
    database_status: Optional[str] = None


@router.get("/health", response_model=HealthCheck)
async def health_check():
    """
    Health check endpoint to verify the server is running.
    """
    # For now, we'll just return that the service is healthy
    # In a real implementation, we'd check database connectivity, etc.
    return HealthCheck(status="healthy", database_status="connected")