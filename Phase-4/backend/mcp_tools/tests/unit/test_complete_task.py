import pytest
from src.mcp.tools.complete_task import complete_task
from src.mcp.schemas.tool_schemas import CompleteTaskResponse


@pytest.mark.asyncio
async def test_complete_task_parameters():
    """Test that complete_task function accepts the correct parameters."""
    assert callable(complete_task)

    # Check function signature
    import inspect
    sig = inspect.signature(complete_task)
    params = list(sig.parameters.keys())
    assert 'task_id' in params
    assert 'user_id' in params