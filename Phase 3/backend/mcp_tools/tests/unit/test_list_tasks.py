import pytest
from src.mcp.tools.list_tasks import list_tasks
from src.mcp.schemas.tool_schemas import ListTasksResponse


@pytest.mark.asyncio
async def test_list_tasks_parameters():
    """Test that list_tasks function accepts the correct parameters."""
    assert callable(list_tasks)

    # Check function signature
    import inspect
    sig = inspect.signature(list_tasks)
    params = list(sig.parameters.keys())
    assert 'user_id' in params