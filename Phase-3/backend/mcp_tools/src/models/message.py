from sqlmodel import SQLModel, Field
from typing import Optional
import datetime


class MessageBase(SQLModel):
    """
    Base model for Message with common fields.
    """
    conversation_id: int = Field(..., description="ID of the conversation this message belongs to")
    role: str = Field(..., description="Role of the message sender (user/assistant)")
    content: str = Field(..., description="Content of the message")


class Message(MessageBase, table=True):
    """
    Message model representing individual messages within a conversation.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow, description="When the message was created")
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow, description="When the message was last updated")


class MessageCreate(MessageBase):
    """
    Model for creating a new message.
    """
    pass


class MessagePublic(MessageBase):
    """
    Public model for message with ID included.
    """
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime