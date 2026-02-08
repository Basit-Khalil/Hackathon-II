import pytest
from src.mcp.tools.delete_task import delete_task
from src.mcp.schemas.tool_schemas import DeleteTaskResponse


@pytest.mark.asyncio
async def test_delete_task_parameters():
    """Test that delete_task function accepts the correct parameters."""
    assert callable(delete_task)

    # Check function signature
    import inspect
    sig = inspect.signature(delete_task)
    params = list(sig.parameters.keys())
    assert 'task_id' in params
    assert 'user_id' in params