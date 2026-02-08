import pytest
from fastapi.testclient import TestClient
from src.main import app


def test_server_startup():
    """Test that the server starts up correctly."""
    client = TestClient(app)

    response = client.get("/")
    assert response.status_code == 200

    data = response.json()
    assert "message" in data
    assert "MCP Task Server is running!" in data["message"]


def test_health_endpoint():
    """Test the health check endpoint."""
    client = TestClient(app)

    response = client.get("/api/health")
    assert response.status_code == 200

    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"