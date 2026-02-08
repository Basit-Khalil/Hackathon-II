from sqlmodel import SQLModel, Field
from typing import Optional
import datetime


class ConversationBase(SQLModel):
    """
    Base model for Conversation with common fields.
    """
    user_id: int = Field(..., description="ID of the user who owns this conversation")


class Conversation(ConversationBase, table=True):
    """
    Conversation model representing a chat session between user and AI assistant.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow, description="When the conversation was started")
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow, description="When the conversation was last updated")


class ConversationCreate(ConversationBase):
    """
    Model for creating a new conversation.
    """
    pass


class ConversationPublic(ConversationBase):
    """
    Public model for conversation with ID included.
    """
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime