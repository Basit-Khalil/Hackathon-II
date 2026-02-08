import pytest
from src.mcp.tools.add_task import add_task
from src.mcp.schemas.tool_schemas import AddTaskResponse


@pytest.mark.asyncio
async def test_add_task_parameters():
    """Test that add_task function accepts the correct parameters."""
    # This test verifies the function signature without needing complex mocking
    # In a real implementation, we would have proper database integration tests
    assert callable(add_task)

    # Check function signature
    import inspect
    sig = inspect.signature(add_task)
    params = list(sig.parameters.keys())
    assert 'title' in params
    assert 'user_id' in params