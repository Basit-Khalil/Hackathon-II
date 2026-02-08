from fastapi import FastAPI
from .logging_config import logger
from .api.health import router as health_router
from .mcp.server import mcp_server
from .mcp.tools.add_task import add_task
from .mcp.tools.list_tasks import list_tasks
from .mcp.tools.complete_task import complete_task
from .mcp.tools.delete_task import delete_task
from .mcp.tools.update_task import update_task


# Initialize FastAPI app
app = FastAPI(
    title="MCP Task Server",
    description="Server for handling MCP task operations",
    version="1.0.0"
)


@app.on_event("startup")
async def startup_event():
    """
    Startup event to initialize the application.
    """
    logger.info("Starting MCP Task Server...")
    # Register all tools with the MCP server
    mcp_server.register_tool("add_task", add_task)
    mcp_server.register_tool("list_tasks", list_tasks)
    mcp_server.register_tool("complete_task", complete_task)
    mcp_server.register_tool("delete_task", delete_task)
    mcp_server.register_tool("update_task", update_task)
    logger.info("All tools registered with MCP server")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Shutdown event to clean up resources.
    """
    logger.info("Shutting down MCP Task Server...")


# Include routers
app.include_router(health_router, prefix="/api", tags=["health"])


# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint for the application.
    """
    return {"message": "MCP Task Server is running!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)