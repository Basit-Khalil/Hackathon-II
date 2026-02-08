#!/usr/bin/env python3
"""
Test script to verify the bcrypt password length fix
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from dependencies.auth import hash_password, verify_password

def test_short_password():
    """Test with a short password (should work)"""
    password = "short123"
    try:
        hashed = hash_password(password)
        print(f"[PASS] Short password '{password}' hashed successfully")

        verified = verify_password(password, hashed)
        print(f"[PASS] Short password verification: {verified}")
        return True
    except Exception as e:
        print(f"[FAIL] Short password failed: {e}")
        return False

def test_long_password():
    """Test with a long password (should work after fix)"""
    password = "a" * 80  # Definitely longer than 72 bytes
    try:
        hashed = hash_password(password)
        print(f"[PASS] Long password (length {len(password)}) hashed successfully")

        verified = verify_password(password, hashed)
        print(f"[PASS] Long password verification: {verified}")
        return True
    except Exception as e:
        print(f"[FAIL] Long password failed: {e}")
        return False

def test_utf8_password():
    """Test with UTF-8 password that might exceed 72 bytes when encoded"""
    password = "üñíçødé" * 10  # UTF-8 characters take more than 1 byte each
    try:
        print(f"Original password length: {len(password)} chars, {len(password.encode('utf-8'))} bytes")
        hashed = hash_password(password)
        print(f"[PASS] UTF-8 password hashed successfully")

        verified = verify_password(password, hashed)
        print(f"[PASS] UTF-8 password verification: {verified}")
        return True
    except Exception as e:
        print(f"[FAIL] UTF-8 password failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing password hash/verify functions...")

    success_count = 0
    total_tests = 3

    if test_short_password():
        success_count += 1

    if test_long_password():
        success_count += 1

    if test_utf8_password():
        success_count += 1

    print(f"\nTests passed: {success_count}/{total_tests}")

    if success_count == total_tests:
        print("[PASS] All tests passed! The fix should work correctly.")
    else:
        print("[FAIL] Some tests failed!")
        sys.exit(1)