from fastapi import FastAPI
from .logging_config import logger
from .api.chat import router as chat_router
from .config.settings import settings


# Initialize FastAPI app
app = FastAPI(
    title="AI Chat Agent",
    description="AI agent for processing natural language task commands",
    version="1.0.0"
)


@app.on_event("startup")
async def startup_event():
    """
    Startup event to initialize the application.
    """
    logger.info("Starting AI Chat Agent...")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Shutdown event to clean up resources.
    """
    logger.info("Shutting down AI Chat Agent...")


# Include routers
app.include_router(chat_router, prefix="/api", tags=["chat"])


# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint for the application.
    """
    return {"message": "AI Chat Agent is running!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)