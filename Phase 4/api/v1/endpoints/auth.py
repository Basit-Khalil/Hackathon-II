from fastapi import APIRouter, Depends, HTTPException, status,Response
from sqlmodel import Session, select
from typing import Dict
from database.database import get_session
from models.user import User, UserCreate as UserCreateModel
from schemas.user import UserResponse, UserCreate as UserCreateSchema, UserToken, UserLogin
from auth.jwt_handler import decode_jwt_token, SECRET_KEY, ALGORITHM
from dependencies.auth import hash_password, verify_password
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

load_dotenv()

router = APIRouter()
security = HTTPBearer()

@router.post("/auth/sign-up", response_model=UserToken)
def sign_up(
    user_data: UserCreateSchema,
    session: Session = Depends(get_session)
):
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Hash the password
    hashed_password = hash_password(user_data.password)

    # Create user instance
    user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Create JWT token
    token_data = {
        "userId": str(user.id),  # Convert to string to store in JWT
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(days=30)  # Token expires in 30 days
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    # Convert SQLModel user to Pydantic response model
    user_response = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        created_at=user.created_at,
        updated_at=user.updated_at
    )

    return UserToken(user=user_response, token=token)

@router.post("/auth/sign-in", response_model=UserToken)
def sign_in(
    user_login: UserLogin,
    response: Response,
    session: Session = Depends(get_session)
):
    user = session.exec(
        select(User).where(User.email == user_login.email)
    ).first()

    if not user or not verify_password(user_login.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    token_data = {
        "userId": str(user.id),
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(days=30)
    }

    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    # 🔥 THIS IS THE FIX (COOKIE)
    response.set_cookie(
        key="auth-token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,   # True in production (HTTPS)
        path="/",
        max_age=60 * 60 * 24 * 30,
    )

    user_response = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        created_at=user.created_at,
        updated_at=user.updated_at
    )

    return UserToken(user=user_response, token=token)


@router.get("/auth/me", response_model=Dict)
def get_current_user_info(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("userId")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )

        # Get user from database (convert string ID to int for SQLModel)
        user = session.get(User, int(user_id))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at
        }
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )