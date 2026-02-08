from sqlmodel import create_engine, Session
from typing import AsyncGenerator
from contextlib import asynccontextmanager
from fastapi import Depends
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")

# Remove the quotes from the DATABASE_URL if they exist
if DATABASE_URL and DATABASE_URL.startswith("'") and DATABASE_URL.endswith("'"):
    DATABASE_URL = DATABASE_URL[1:-1]

if DATABASE_URL and DATABASE_URL.startswith('"') and DATABASE_URL.endswith('"'):
    DATABASE_URL = DATABASE_URL[1:-1]

# Create sync and async engines
sync_engine = create_engine(DATABASE_URL, echo=False)

# Dependency for database session
def get_session():
    with Session(sync_engine) as session:
        yield session