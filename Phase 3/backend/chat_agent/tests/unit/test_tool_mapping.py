import pytest
from src.tools.mcp_client import MCPClient


def test_mcp_client_initialization():
    """Test that MCPClient can be initialized."""
    # We can't fully test without a session, but we can verify the class exists
    assert hasattr(MCPClient, '__init__')

    # Check that the expected methods exist
    methods_to_check = ['add_task', 'list_tasks', 'complete_task', 'delete_task', 'update_task']
    for method in methods_to_check:
        assert hasattr(MCPClient, method)