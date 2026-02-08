#!/bin/bash
# Script to start the backend server

echo "Starting Todo Backend API server..."
echo "Make sure you have installed the required packages:"
echo "pip install -r requirements.txt"
echo ""
echo "Also make sure your .env file is properly configured with:"
echo "- BETTER_AUTH_SECRET"
echo "- DATABASE_URL"
echo ""

# Check if uvicorn is available
if python -c "import uvicorn" &> /dev/null; then
    echo "Starting server on http://localhost:8000"
    uvicorn main:app --reload --port 8000
else
    echo "Error: uvicorn is not installed. Please install it with 'pip install uvicorn'"
fi