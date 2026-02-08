import os
import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv




# Load environment variables
load_dotenv()

# Import API routes
from api.v1.api import api_router
from exceptions.handlers import register_exception_handlers

# Create FastAPI app
app = FastAPI(
    title="Todo Backend API",
    description="Secure, production-ready FastAPI backend for Todo web application",
    version="1.0.0"
)

# Register exception handlers
register_exception_handlers(app)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        # Add your Vercel frontend URL after deployment
        # "https://your-frontend.vercel.app"  # Replace with your actual Vercel URL after deployment
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Todo Backend API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "todo-backend"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )