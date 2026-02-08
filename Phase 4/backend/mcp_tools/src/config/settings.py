from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    database_url: str = "postgresql+asyncpg://username:password@localhost/dbname"
    debug: bool = False
    secret_key: str = "your-secret-key-here"

    class Config:
        env_file = ".env"


settings = Settings()