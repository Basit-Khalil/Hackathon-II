from ...database.session import AsyncSessionLocal
from ...models.task import Task
from ...mcp.schemas.tool_schemas import DeleteTaskResponse
from ...logging_config import logger
from sqlmodel import select, delete


async def delete_task(task_id: int, user_id: int) -> DeleteTaskResponse:
    """
    Delete a task from the database.

    Args:
        task_id: ID of the task to delete
        user_id: ID of the user requesting the deletion

    Returns:
        DeleteTaskResponse indicating success or error information
    """
    try:
        async with AsyncSessionLocal() as session:
            # Find the task
            query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
            result = await session.execute(query)
            task = result.scalar_one_or_none()

            if not task:
                return DeleteTaskResponse(
                    success=False,
                    error="Task not found or does not belong to user"
                )

            # Delete the task
            delete_query = delete(Task).where(Task.id == task_id, Task.user_id == user_id)
            await session.execute(delete_query)
            await session.commit()

            # Return success response
            return DeleteTaskResponse(
                success=True,
                deleted=True
            )
    except Exception as e:
        logger.error(f"Error deleting task: {str(e)}")
        return DeleteTaskResponse(
            success=False,
            error=f"Failed to delete task: {str(e)}"
        )