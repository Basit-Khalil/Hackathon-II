from ...database.session import AsyncSessionLocal
from ...models.task import Task, TaskPublic
from ...mcp.schemas.tool_schemas import ListTasksResponse
from ...logging_config import logger
from sqlmodel import select
from typing import List, Optional


async def list_tasks(user_id: int, completed: Optional[bool] = None) -> ListTasksResponse:
    """
    List tasks for a specific user.

    Args:
        user_id: ID of the user whose tasks to list
        completed: Optional filter for completed status (None = all, True = completed only, False = incomplete only)

    Returns:
        ListTasksResponse with the list of tasks or error information
    """
    try:
        async with AsyncSessionLocal() as session:
            # Build query
            query = select(Task).where(Task.user_id == user_id)

            if completed is not None:
                query = query.where(Task.completed == completed)

            # Execute query
            result = await session.execute(query)
            tasks = result.scalars().all()

            # Convert to public models properly
            task_list = []
            for task in tasks:
                task_public = TaskPublic(
                    id=task.id,
                    title=task.title,
                    description=task.description,
                    completed=task.completed,
                    user_id=task.user_id,
                    created_at=task.created_at,
                    updated_at=task.updated_at
                )
                task_list.append(task_public)

            # Return success response
            return ListTasksResponse(
                success=True,
                tasks=task_list
            )
    except Exception as e:
        logger.error(f"Error listing tasks: {str(e)}")
        return ListTasksResponse(
            success=False,
            error=f"Failed to list tasks: {str(e)}"
        )