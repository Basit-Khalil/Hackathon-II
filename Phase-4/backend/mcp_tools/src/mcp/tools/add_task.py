from ...database.session import AsyncSessionLocal
from ...models.task import Task
from ...mcp.schemas.tool_schemas import AddTaskRequest, AddTaskResponse
from ...logging_config import logger
from sqlalchemy.exc import IntegrityError


async def add_task(title: str, description: str = None, user_id: int = None) -> AddTaskResponse:
    """
    Add a new task to the database.

    Args:
        title: Title of the task
        description: Description of the task (optional)
        user_id: ID of the user creating the task

    Returns:
        AddTaskResponse with the created task or error information
    """
    try:
        async with AsyncSessionLocal() as session:
            # Create task object
            db_task = Task(
                title=title,
                description=description,
                user_id=user_id,
                completed=False  # Default to not completed
            )

            session.add(db_task)
            await session.commit()
            await session.refresh(db_task)

            # Return success response
            return AddTaskResponse(
                success=True,
                task=db_task
            )
    except IntegrityError as e:
        logger.error(f"Integrity error adding task: {str(e)}")
        return AddTaskResponse(
            success=False,
            error=f"Failed to add task due to integrity constraint: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error adding task: {str(e)}")
        return AddTaskResponse(
            success=False,
            error=f"Failed to add task: {str(e)}"
        )