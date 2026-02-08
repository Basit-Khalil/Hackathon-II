from sqlmodel import SQLModel, Field
from typing import Optional
import datetime


class TaskBase(SQLModel):
    """
    Base model for Task with common fields.
    """
    title: str = Field(..., description="Title of the task")
    description: Optional[str] = Field(None, description="Description of the task")
    completed: bool = Field(default=False, description="Whether the task is completed")
    user_id: int = Field(..., description="ID of the user who owns this task")


class Task(TaskBase, table=True):
    """
    Task model representing a user's todo item.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow, description="When the task was created")
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow, description="When the task was last updated")


class TaskCreate(TaskBase):
    """
    Model for creating a new task.
    """
    pass


class TaskUpdate(SQLModel):
    """
    Model for updating an existing task.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskPublic(TaskBase):
    """
    Public model for task with ID included.
    """
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime