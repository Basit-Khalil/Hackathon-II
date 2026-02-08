from ...database.session import AsyncSessionLocal
from ...models.task import Task, TaskPublic
from ...mcp.schemas.tool_schemas import CompleteTaskResponse
from ...logging_config import logger
from sqlmodel import select
from datetime import datetime


async def complete_task(task_id: int, user_id: int) -> CompleteTaskResponse:
    """
    Mark a task as completed.

    Args:
        task_id: ID of the task to complete
        user_id: ID of the user requesting the completion

    Returns:
        CompleteTaskResponse with the updated task or error information
    """
    try:
        async with AsyncSessionLocal() as session:
            # Find the task
            query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
            result = await session.execute(query)
            task = result.scalar_one_or_none()

            if not task:
                return CompleteTaskResponse(
                    success=False,
                    error="Task not found or does not belong to user"
                )

            # Update task to completed
            task.completed = True
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

            return CompleteTaskResponse(
                success=True,
                task=task_public
            )
    except Exception as e:
        logger.error(f"Error completing task: {str(e)}")
        return CompleteTaskResponse(
            success=False,
            error=f"Failed to complete task: {str(e)}"
        )