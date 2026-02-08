from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from ..config.settings import settings
from ..models.task import Task
from ..models.conversation import Conversation
from ..models.message import Message


async def init_db():
    """
    Initialize the database by creating all tables.
    """
    engine = create_async_engine(settings.database_url)
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    await engine.dispose()


def get_engine():
    """
    Get database engine for sync operations.
    """
    from sqlalchemy import create_engine
    sync_engine = create_engine(settings.database_url)
    return sync_engine