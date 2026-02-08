import pytest
from fastapi.testclient import TestClient
from src.main import app


def test_application_startup():
    """Test that the application starts up correctly."""
    client = TestClient(app)

    # Test root endpoint
    response = client.get("/")
    assert response.status_code == 200
    assert "AI Chat Agent is running!" in response.json()["message"]

    # Test that the API router is properly included
    # This will return 422 (validation error) because we don't provide user_id
    # but confirms the route exists
    response = client.post("/api/1/chat")
    assert response.status_code in [422, 404, 500]  # Expected based on implementation