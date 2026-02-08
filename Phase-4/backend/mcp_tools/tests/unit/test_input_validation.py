import pytest
from pydantic import ValidationError
from src.mcp.schemas.tool_schemas import (
    AddTaskRequest, ListTasksRequest, CompleteTaskRequest,
    DeleteTaskRequest, UpdateTaskRequest
)


def test_add_task_request_validation():
    """Test validation for AddTaskRequest."""
    # Valid request
    valid_request = AddTaskRequest(title="Test Task", user_id=1)
    assert valid_request.title == "Test Task"
    assert valid_request.user_id == 1

    # Missing required fields should raise validation error
    with pytest.raises(ValidationError):
        AddTaskRequest()


def test_list_tasks_request_validation():
    """Test validation for ListTasksRequest."""
    # Valid request
    valid_request = ListTasksRequest(user_id=1)
    assert valid_request.user_id == 1

    # Missing required field should raise validation error
    with pytest.raises(ValidationError):
        ListTasksRequest()


def test_complete_task_request_validation():
    """Test validation for CompleteTaskRequest."""
    # Valid request
    valid_request = CompleteTaskRequest(task_id=1, user_id=1)
    assert valid_request.task_id == 1
    assert valid_request.user_id == 1

    # Missing required fields should raise validation error
    with pytest.raises(ValidationError):
        CompleteTaskRequest(task_id=1)  # Missing user_id
    with pytest.raises(ValidationError):
        CompleteTaskRequest(user_id=1)  # Missing task_id


def test_delete_task_request_validation():
    """Test validation for DeleteTaskRequest."""
    # Valid request
    valid_request = DeleteTaskRequest(task_id=1, user_id=1)
    assert valid_request.task_id == 1
    assert valid_request.user_id == 1

    # Missing required fields should raise validation error
    with pytest.raises(ValidationError):
        DeleteTaskRequest(task_id=1)  # Missing user_id
    with pytest.raises(ValidationError):
        DeleteTaskRequest(user_id=1)  # Missing task_id


def test_update_task_request_validation():
    """Test validation for UpdateTaskRequest."""
    # Valid request with minimal fields
    valid_request = UpdateTaskRequest(task_id=1, user_id=1)
    assert valid_request.task_id == 1
    assert valid_request.user_id == 1

    # Valid request with optional fields
    valid_request_full = UpdateTaskRequest(
        task_id=1,
        user_id=1,
        title="Updated Title",
        description="Updated Description",
        completed=True
    )
    assert valid_request_full.task_id == 1
    assert valid_request_full.user_id == 1
    assert valid_request_full.title == "Updated Title"
    assert valid_request_full.description == "Updated Description"
    assert valid_request_full.completed is True

    # Missing required fields should raise validation error
    with pytest.raises(ValidationError):
        UpdateTaskRequest(task_id=1)  # Missing user_id
    with pytest.raises(ValidationError):
        UpdateTaskRequest(user_id=1)  # Missing task_id