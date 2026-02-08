from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from database.database import get_session
from models.task import Task, TaskCreate, TaskUpdate, TaskPublic
from schemas.task import TaskResponse, TaskCreate as TaskCreateSchema, TaskUpdate as TaskUpdateSchema, TaskToggleComplete, ErrorResponse
from auth.jwt_handler import extract_user_id_from_token
from dependencies.auth import get_current_user, verify_user_owns_resource
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

router = APIRouter()
security = HTTPBearer()

@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks(
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Query tasks for the authenticated user (extracted from JWT)
    statement = select(Task).where(Task.user_id == current_user_id)
    tasks = session.exec(statement).all()

    return tasks


@router.post("/tasks", response_model=TaskResponse)
def create_task(
    task_data: TaskCreateSchema,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Create task instance with user_id from JWT token
    task = Task(
        title=task_data.title,
        description=task_data.description,
        user_id=current_user_id
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Get task by ID and ensure it belongs to the authenticated user
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == current_user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdateSchema,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Get task by ID and ensure it belongs to the authenticated user
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == current_user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update task fields if provided
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Get task by ID and ensure it belongs to the authenticated user
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == current_user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    session.delete(task)
    session.commit()

    return {"detail": "Task deleted successfully"}


@router.patch("/tasks/{task_id}/complete", response_model=TaskResponse)
def toggle_task_completion(
    task_id: int,
    completion_data: TaskToggleComplete,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Get task by ID and ensure it belongs to the authenticated user
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == current_user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update completion status
    task.completed = completion_data.completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task