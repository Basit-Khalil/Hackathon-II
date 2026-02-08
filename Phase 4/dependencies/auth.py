from fastapi import Depends, HTTPException, status
from typing import Dict
from auth.jwt_handler import verify_token
from passlib.context import CryptContext

# Password hashing context - using argon2 as primary, bcrypt as fallback
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

def get_current_user(payload: Dict = Depends(verify_token)) -> str:
    """
    Get current authenticated user's ID from JWT token
    """
    user_id = payload.get("userId")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_id

def verify_user_owns_resource(token_user_id: str, url_user_id: str) -> bool:
    """
    Verify that the user ID in the token matches the user ID in the URL
    """
    if token_user_id != url_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only access your own resources"
        )
    return True

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt
    Truncate password to 72 bytes if necessary to avoid bcrypt limitation
    """
    # Bcrypt has a limitation of 72 bytes for passwords
    # We need to truncate longer passwords to avoid ValueError
    if len(password.encode('utf-8')) > 72:
        # Truncate to 72 bytes while preserving UTF-8 character integrity
        encoded = password.encode('utf-8')
        truncated = encoded[:72]
        password = truncated.decode('utf-8', errors='ignore')

    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password
    Apply the same truncation as hash_password to ensure consistency
    """
    # Apply the same truncation as in hash_password to ensure consistency
    if len(plain_password.encode('utf-8')) > 72:
        encoded = plain_password.encode('utf-8')
        truncated = encoded[:72]
        plain_password = truncated.decode('utf-8', errors='ignore')

    return pwd_context.verify(plain_password, hashed_password)