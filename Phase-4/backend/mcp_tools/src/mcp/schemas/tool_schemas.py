from pydantic import BaseModel
from typing import Optional, List
from ...models.task import TaskPublic


class AddTaskRequest(BaseModel):
    """
    Request schema for add_task tool.
    """
    title: str
    description: Optional[str] = None
    user_id: int


class AddTaskResponse(BaseModel):
    """
    Response schema for add_task tool.
    """
    success: bool
    task: Optional[TaskPublic] = None
    error: Optional[str] = None


class ListTasksRequest(BaseModel):
    """
    Request schema for list_tasks tool.
    """
    user_id: int
    completed: Optional[bool] = None


class ListTasksResponse(BaseModel):
    """
    Response schema for list_tasks tool.
    """
    success: bool
    tasks: List[TaskPublic] = []
    error: Optional[str] = None


class CompleteTaskRequest(BaseModel):
    """
    Request schema for complete_task tool.
    """
    task_id: int
    user_id: int


class CompleteTaskResponse(BaseModel):
    """
    Response schema for complete_task tool.
    """
    success: bool
    task: Optional[TaskPublic] = None
    error: Optional[str] = None


class DeleteTaskRequest(BaseModel):
    """
    Request schema for delete_task tool.
    """
    task_id: int
    user_id: int


class DeleteTaskResponse(BaseModel):
    """
    Response schema for delete_task tool.
    """
    success: bool
    deleted: bool = False
    error: Optional[str] = None


class UpdateTaskRequest(BaseModel):
    """
    Request schema for update_task tool.
    """
    task_id: int
    user_id: int
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class UpdateTaskResponse(BaseModel):
    """
    Response schema for update_task tool.
    """
    success: bool
    task: Optional[TaskPublic] = None
    error: Optional[str] = None