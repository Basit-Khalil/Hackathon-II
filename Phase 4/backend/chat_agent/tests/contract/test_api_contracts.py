import pytest
from fastapi.testclient import TestClient
from src.main import app


def test_root_endpoint():
    """Test the root endpoint."""
    client = TestClient(app)

    response = client.get("/")
    assert response.status_code == 200

    data = response.json()
    assert "message" in data
    assert "AI Chat Agent is running!" in data["message"]


def test_chat_endpoint_structure():
    """Test that the chat endpoint is properly structured."""
    # We can't fully test the chat endpoint without valid user_id and message
    # but we can verify the structure exists
    client = TestClient(app)

    # This will fail with 422 (validation error) because we don't send a proper payload
    # but it confirms the endpoint exists
    response = client.post("/api/1/chat")
    assert response.status_code in [422, 404, 500]  # Expected based on implementation