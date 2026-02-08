#!/usr/bin/env python3
"""
Test script to directly test the auth functionality
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

# Test importing the auth module to see if there are any import errors
try:
    from api.v1.endpoints.auth import sign_up
    from sqlmodel import Session
    from database.database import get_session
    from models.user import UserCreate as UserCreateSchema
    print("[PASS] Successfully imported auth module")
except ImportError as e:
    print(f"[FAIL] Import error: {e}")
    sys.exit(1)

# Test creating a session
try:
    session_gen = get_session()
    session = next(session_gen)
    print("[PASS] Successfully created database session")
except Exception as e:
    print(f"[FAIL] Database session error: {e}")
    sys.exit(1)

# Test creating user data
try:
    user_data = UserCreateSchema(name="Test User", email="test@example.com", password="testpass123")
    print(f"[PASS] Created user data: {user_data}")
except Exception as e:
    print(f"[FAIL] User data creation error: {e}")
    sys.exit(1)

# Test the sign_up function directly
try:
    result = sign_up(user_data, session)
    print(f"[PASS] Sign up successful: {result}")
except Exception as e:
    print(f"[FAIL] Sign up error: {e}")
    import traceback
    traceback.print_exc()

# Close the session
try:
    session.close()
    print("[PASS] Session closed successfully")
except Exception as e:
    print(f"[WARN] Session close error: {e}")