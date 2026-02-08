from ...database.session import AsyncSessionLocal
from ...models.task import Task, TaskPublic
from ...mcp.schemas.tool_schemas import UpdateTaskResponse
from ...logging_config import logger
from sqlmodel import select
from datetime import datetime
from typing import Optional


async def update_task(
    task_id: int,
    user_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
    completed: Optional[bool] = None
) -> UpdateTaskResponse:
    """
    Update an existing task.

    Args:
        task_id: ID of the task to update
        user_id: ID of the user requesting the update
        title: New title for the task (optional)
        description: New description for the task (optional)
        completed: New completion status for the task (optional)

    Returns:
        UpdateTaskResponse with the updated task or error information
    """
    try:
        async with AsyncSessionLocal() as session:
            # Find the task
            query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
            result = await session.execute(query)
            task = result.scalar_one_or_none()

            if not task:
                return UpdateTaskResponse(
                    success=False,
                    error="Task not found or does not belong to user"
                )

            # Update task fields if provided
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            if completed is not None:
                task.completed = completed

            # Update timestamp
            task.updated_at = datetime.utcnow()

            session.add(task)
            await session.commit()
            await session.refresh(task)

            # Return success response
            task_public = TaskPublic(
                id=task.id,
                title=task.title,
                description=task.description,
                completed=task.completed,
                user_id=task.user_id,
                created_at=task.created_at,
                updated_at=task.updated_at
            )

            return UpdateTaskResponse(
                success=True,
                task=task_public
            )
    except Exception as e:
        logger.error(f"Error updating task: {str(e)}")
        return UpdateTaskResponse(
            success=False,
            error=f"Failed to update task: {str(e)}"
        )