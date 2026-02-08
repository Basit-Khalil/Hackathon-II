import pytest
from src.mcp.tools.update_task import update_task
from src.mcp.schemas.tool_schemas import UpdateTaskResponse


@pytest.mark.asyncio
async def test_update_task_parameters():
    """Test that update_task function accepts the correct parameters."""
    assert callable(update_task)

    # Check function signature
    import inspect
    sig = inspect.signature(update_task)
    params = list(sig.parameters.keys())
    assert 'task_id' in params
    assert 'user_id' in params