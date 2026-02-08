#!/usr/bin/env python3
"""
Simple test to verify the backend functionality
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from sqlmodel import SQLModel, create_engine, Session
from database.database import DATABASE_URL
from models.user import User
from models.task import Task
from api.v1.endpoints.auth import sign_up
from api.v1.endpoints.tasks import get_tasks
from schemas.user import UserCreate as UserCreateSchema
from schemas.task import TaskCreate as TaskCreateSchema

# Create a fresh database engine for testing
engine = create_engine(DATABASE_URL, echo=True)

def test_signup():
    """Test user signup functionality"""
    print("Testing user signup...")
    
    # Create a new session
    with Session(engine) as session:
        # Clean up any existing test user
        existing_user = session.query(User).filter(User.email == "testuser@example.com").first()
        if existing_user:
            session.delete(existing_user)
            session.commit()
        
        # Create user data
        user_data = UserCreateSchema(
            name="Test User",
            email="testuser@example.com",
            password="securepassword123"
        )
        
        try:
            # Call the signup function
            result = sign_up(user_data, session)
            print(f"[SUCCESS] User signed up: {result.user.name}")
            return result
        except Exception as e:
            print(f"[ERROR] Signup failed: {e}")
            return None

def test_database_connection():
    """Test database connection"""
    print("Testing database connection...")
    try:
        # Create all tables
        SQLModel.metadata.create_all(engine)
        print("[SUCCESS] Database connection and tables OK")
        return True
    except Exception as e:
        print(f"[ERROR] Database connection failed: {e}")
        return False

if __name__ == "__main__":
    print("Running simple backend tests...\n")
    
    # Test database connection
    if not test_database_connection():
        sys.exit(1)
    
    # Test signup
    result = test_signup()
    if result:
        print(f"\n[ALL TESTS PASSED] Backend is working correctly!")
    else:
        print(f"\n[SOME TESTS FAILED] There are issues with the backend.")