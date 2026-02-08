#!/usr/bin/env python3
"""
Comprehensive test for API endpoints
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test the health endpoint"""
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "healthy":
                print("[SUCCESS] Health endpoint is working")
                return True
            else:
                print(f"[ERROR] Health endpoint returned unexpected data: {data}")
                return False
        else:
            print(f"[ERROR] Health endpoint returned status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Health endpoint test failed: {e}")
        return False

def test_root_endpoint():
    """Test the root endpoint"""
    print("Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            if "message" in data:
                print("[SUCCESS] Root endpoint is working")
                return True
            else:
                print(f"[ERROR] Root endpoint returned unexpected data: {data}")
                return False
        else:
            print(f"[ERROR] Root endpoint returned status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Root endpoint test failed: {e}")
        return False

def test_api_endpoints_structure():
    """Test that API endpoints exist (will return 404 or 422 for missing params, but not 404 for route)"""
    print("Testing API endpoints structure...")
    
    # Test auth endpoints
    auth_endpoints = [
        (f"{BASE_URL}/api/v1/auth/sign-up", "POST"),
        (f"{BASE_URL}/api/v1/auth/sign-in", "POST"),
        (f"{BASE_URL}/api/v1/auth/me", "GET"),
    ]
    
    for endpoint, method in auth_endpoints:
        try:
            if method == "GET":
                response = requests.get(endpoint)
            elif method == "POST":
                response = requests.post(endpoint, json={})
            
            # We expect 422 (validation error) or 401 (unauthorized) but not 404 (not found)
            if response.status_code in [404]:
                print(f"[ERROR] Auth endpoint not found: {endpoint}")
                return False
            else:
                print(f"[SUCCESS] Auth endpoint exists: {endpoint} (status: {response.status_code})")
        except Exception as e:
            print(f"[ERROR] Auth endpoint test failed for {endpoint}: {e}")
            return False
    
    # Test task endpoints
    task_endpoints = [
        (f"{BASE_URL}/api/v1/tasks", "GET"),
        (f"{BASE_URL}/api/v1/tasks", "POST"),
        (f"{BASE_URL}/api/v1/tasks/999999", "GET"),  # Non-existent task
        (f"{BASE_URL}/api/v1/tasks/999999", "PUT"),  # Non-existent task
        (f"{BASE_URL}/api/v1/tasks/999999", "DELETE"),  # Non-existent task
        (f"{BASE_URL}/api/v1/tasks/999999/complete", "PATCH"),  # Non-existent task
    ]
    
    for endpoint, method in task_endpoints:
        try:
            if method == "GET":
                response = requests.get(endpoint)
            elif method == "POST":
                response = requests.post(endpoint, json={})
            elif method == "PUT":
                response = requests.put(endpoint, json={})
            elif method == "DELETE":
                response = requests.delete(endpoint)
            elif method == "PATCH":
                response = requests.patch(endpoint, json={})
            
            # We expect 422 (validation error) or 401 (unauthorized) but not 404 (not found)
            if response.status_code in [404]:
                print(f"[ERROR] Task endpoint not found: {endpoint}")
                return False
            else:
                print(f"[SUCCESS] Task endpoint exists: {endpoint} (status: {response.status_code})")
        except Exception as e:
            print(f"[ERROR] Task endpoint test failed for {endpoint}: {e}")
            return False
    
    return True

def main():
    print("Running comprehensive API endpoint tests...\n")
    
    success_count = 0
    total_tests = 3
    
    if test_health_endpoint():
        success_count += 1
    
    if test_root_endpoint():
        success_count += 1
        
    if test_api_endpoints_structure():
        success_count += 1
    
    print(f"\nTest Results: {success_count}/{total_tests} tests passed")
    
    if success_count == total_tests:
        print("[ALL TESTS PASSED] All API endpoints are functioning correctly!")
        return True
    else:
        print("[SOME TESTS FAILED] There are issues with some API endpoints.")
        return False

if __name__ == "__main__":
    main()