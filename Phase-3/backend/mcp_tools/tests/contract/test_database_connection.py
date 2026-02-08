import pytest
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from src.config.settings import settings


def test_database_connection_config():
    """Test that database configuration is properly set."""
    # Just verify that settings exist
    assert hasattr(settings, 'database_url')
    assert isinstance(settings.database_url, str)


def test_database_url_format():
    """Test that the database URL has the expected format."""
    # Check if the database URL follows the expected pattern
    assert settings.database_url.startswith(('postgresql:', 'postgresql+asyncpg:'))