from sqlmodel import create_engine, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from ..config.settings import settings


# Create async engine for PostgreSQL with asyncpg driver
async_engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,  # Log SQL queries in debug mode
)


# Create session maker for async sessions
AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)


def get_session():
    """
    Dependency to get database session for FastAPI.
    """
    with Session(async_engine) as session:
        yield session


async def get_async_session():
    """
    Async dependency to get async database session for FastAPI.
    """
    async with AsyncSessionLocal() as session:
        yield session