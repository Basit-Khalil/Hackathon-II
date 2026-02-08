import pytest
from src.api.chat import _get_or_create_conversation


@pytest.mark.asyncio
async def test_get_or_create_conversation_function_exists():
    """Test that _get_or_create_conversation function exists and has correct signature."""
    assert callable(_get_or_create_conversation)

    # Check function signature
    import inspect
    sig = inspect.signature(_get_or_create_conversation)
    params = list(sig.parameters.keys())
    assert 'user_id' in params
    assert 'session' in params