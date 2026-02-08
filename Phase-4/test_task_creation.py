#!/usr/bin/env python3
"""
Test script to simulate adding a task via API
This will help verify if the issue is with the backend or the chatbot integration
"""

import requests
import json
import os
from datetime import datetime

BASE_URL = "http://localhost:8000/api/v1"

def test_add_task_without_auth():
    """Test adding a task without authentication (should fail)"""
    print("Testing adding a task without authentication...")
    
    task_data = {
        "title": "Test task from API",
        "description": "This is a test task added via API call",
        "completed": False
    }
    
    try:
        response = requests.post(f"{BASE_URL}/tasks", json=task_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 403 or response.status_code == 401:
            print("[EXPECTED] Task creation failed due to lack of authentication")
            return True
        else:
            print("[UNEXPECTED] Task creation succeeded without authentication")
            return False
    except Exception as e:
        print(f"[ERROR] Failed to connect to backend: {e}")
        return False

def test_full_workflow():
    """Test the complete workflow: sign up, sign in, add task"""
    print("\nTesting complete workflow...")
    
    # Step 1: Sign up a test user
    print("Step 1: Signing up test user...")
    user_data = {
        "name": "Test User",
        "email": f"testuser_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
        "password": "securepassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/sign-up", json=user_data)
        print(f"Sign up status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Sign up failed: {response.text}")
            return False
            
        result = response.json()
        token = result.get('token')
        print(f"Received token: {'Yes' if token else 'No'}")
        
        if not token:
            print("No token received from sign up")
            return False
        
        # Step 2: Add a task with the token
        print("\nStep 2: Adding a task with authentication...")
        task_data = {
            "title": "Test task from API",
            "description": "This is a test task added via API call",
            "completed": False
        }
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(f"{BASE_URL}/tasks", json=task_data, headers=headers)
        print(f"Add task status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            task_result = response.json()
            print(f"Task created successfully with ID: {task_result.get('id')}")
            return True
        else:
            print(f"Failed to add task: {response.text}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Workflow test failed: {e}")
        return False

def main():
    print("Testing task addition via API calls...\n")
    
    # Test 1: Without authentication (should fail)
    test1_success = test_add_task_without_auth()
    
    # Test 2: Full workflow (should succeed)
    test2_success = test_full_workflow()
    
    print(f"\nTest Results:")
    print(f"- Unauthenticated task creation: {'PASS (expected to fail)' if test1_success else 'FAIL'}")
    print(f"- Full workflow test: {'PASS' if test2_success else 'FAIL'}")
    
    if test2_success:
        print("\n[SUCCESS] Backend API is working correctly for task creation!")
        print("The issue might be with the chatbot integration or frontend, not the backend.")
    else:
        print("\n[ISSUE] There might be problems with the backend API.")

if __name__ == "__main__":
    main()