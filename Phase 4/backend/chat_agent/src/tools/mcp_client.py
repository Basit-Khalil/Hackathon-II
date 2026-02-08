from typing import Optional, Dict, Any
from sqlmodel import Session
from ..models.task import Task, TaskCreate, TaskUpdate
from ...mcp_tools.src.mcp.tools.add_task import add_task as mcp_add_task
from ...mcp_tools.src.mcp.tools.list_tasks import list_tasks as mcp_list_tasks
from ...mcp_tools.src.mcp.tools.complete_task import complete_task as mcp_complete_task
from ...mcp_tools.src.mcp.tools.delete_task import delete_task as mcp_delete_task
from ...mcp_tools.src.mcp.tools.update_task import update_task as mcp_update_task


class MCPClient:
    """
    Client for interacting with MCP tools for task operations.
    """
    def __init__(self, session: Session):
        self.session = session

    async def add_task(self, title: str, description: Optional[str] = None, user_id: int = None) -> Dict[str, Any]:
        """
        Add a new task using the MCP tool.

        Args:
            title: Title of the task
            description: Description of the task (optional)
            user_id: ID of the user creating the task

        Returns:
            Result from the MCP tool
        """
        try:
            # Use the imported MCP tool implementation
            result = await mcp_add_task(title, description, user_id)
            return {
                "success": result.success,
                "task": result.task.dict() if result.task else None,
                "error": result.error
            }
        except Exception as e:
            return {
                "success": False,
                "task": None,
                "error": str(e)
            }

    async def list_tasks(self, user_id: int, completed: Optional[bool] = None) -> Dict[str, Any]:
        """
        List tasks for a user using the MCP tool.

        Args:
            user_id: ID of the user whose tasks to list
            completed: Filter by completion status (optional)

        Returns:
            Result from the MCP tool
        """
        try:
            result = await mcp_list_tasks(user_id, completed)
            tasks_data = [task.dict() for task in result.tasks] if result.success else []
            return {
                "success": result.success,
                "tasks": tasks_data,
                "error": result.error
            }
        except Exception as e:
            return {
                "success": False,
                "tasks": [],
                "error": str(e)
            }

    async def complete_task(self, task_id: int, user_id: int) -> Dict[str, Any]:
        """
        Mark a task as completed using the MCP tool.

        Args:
            task_id: ID of the task to complete
            user_id: ID of the user requesting the completion

        Returns:
            Result from the MCP tool
        """
        try:
            result = await mcp_complete_task(task_id, user_id)
            return {
                "success": result.success,
                "task": result.task.dict() if result.task else None,
                "error": result.error
            }
        except Exception as e:
            return {
                "success": False,
                "task": None,
                "error": str(e)
            }

    async def delete_task(self, task_id: int, user_id: int) -> Dict[str, Any]:
        """
        Delete a task using the MCP tool.

        Args:
            task_id: ID of the task to delete
            user_id: ID of the user requesting the deletion

        Returns:
            Result from the MCP tool
        """
        try:
            result = await mcp_delete_task(task_id, user_id)
            return {
                "success": result.success,
                "deleted": result.deleted,
                "error": result.error
            }
        except Exception as e:
            return {
                "success": False,
                "deleted": False,
                "error": str(e)
            }

    async def update_task(self, task_id: int, user_id: int, title: Optional[str] = None,
                         description: Optional[str] = None, completed: Optional[bool] = None) -> Dict[str, Any]:
        """
        Update a task using the MCP tool.

        Args:
            task_id: ID of the task to update
            user_id: ID of the user requesting the update
            title: New title for the task (optional)
            description: New description for the task (optional)
            completed: New completion status (optional)

        Returns:
            Result from the MCP tool
        """
        try:
            result = await mcp_update_task(task_id, user_id, title, description, completed)
            return {
                "success": result.success,
                "task": result.task.dict() if result.task else None,
                "error": result.error
            }
        except Exception as e:
            return {
                "success": False,
                "task": None,
                "error": str(e)
            }