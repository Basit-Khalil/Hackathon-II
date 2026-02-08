import pytest
from src.agents.runner import run_agent


@pytest.mark.asyncio
async def test_run_agent_function_exists():
    """Test that the run_agent function exists and has correct signature."""
    assert callable(run_agent)

    # Check function signature
    import inspect
    sig = inspect.signature(run_agent)
    params = list(sig.parameters.keys())
    assert 'user_id' in params
    assert 'conversation_id' in params
    assert 'user_message' in params