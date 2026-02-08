from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from sqlmodel import Session
from ..database.session import get_session
from ..models.conversation import Conversation
from ..models.message import Message
from ..agents.runner import run_agent, AgentResponse, ToolCall
from ..logging_config import logger
import datetime


router = APIRouter()


class ChatRequest(BaseModel):
    """
    Request model for the chat endpoint.
    """
    message: str


class ToolCallResult(BaseModel):
    """
    Result of a tool call.
    """
    tool_name: str
    parameters: Dict[str, Any]
    result: Dict[str, Any]


class ChatResponse(BaseModel):
    """
    Response model for the chat endpoint.
    """
    conversation_id: int
    response: str
    tool_calls: List[ToolCallResult]


@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat_endpoint(user_id: int, request: ChatRequest, session: Session = Depends(get_session)):
    """
    Chat endpoint that processes natural language requests through an AI agent.

    Args:
        user_id: ID of the user making the request
        request: Chat request containing the user's message
        session: Database session dependency

    Returns:
        ChatResponse with conversation ID, AI response, and tool calls made
    """
    try:
        # Get or create conversation for the user
        conversation = _get_or_create_conversation(user_id, session)

        # Append new user message to conversation history
        user_message = Message(
            conversation_id=conversation.id,
            role="user",
            content=request.message,
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow()
        )
        session.add(user_message)
        session.commit()
        session.refresh(user_message)

        # Run agent with MCP tools
        agent_response = await run_agent(user_id, conversation.id, request.message, session)

        # Store assistant response in DB
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=agent_response.response_text,
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow()
        )
        session.add(assistant_message)
        session.commit()

        # Convert tool calls to the required format
        tool_call_results = []
        for tool_call in agent_response.tool_calls:
            tool_call_result = ToolCallResult(
                tool_name=tool_call.tool_name,
                parameters=tool_call.parameters,
                result=tool_call.result
            )
            tool_call_results.append(tool_call_result)

        # Return structured response
        return ChatResponse(
            conversation_id=conversation.id,
            response=agent_response.response_text,
            tool_calls=tool_call_results
        )

    except Exception as e:
        logger.error(f"Error processing chat request for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")


def _get_or_create_conversation(user_id: int, session: Session) -> Conversation:
    """
    Get existing conversation for user or create a new one.

    Args:
        user_id: ID of the user
        session: Database session

    Returns:
        Conversation object
    """
    # Try to find an existing conversation
    conversation = session.query(Conversation).filter(
        Conversation.user_id == user_id
    ).order_by(Conversation.updated_at.desc()).first()

    # If no conversation exists, create a new one
    if not conversation:
        conversation = Conversation(
            user_id=user_id,
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow()
        )
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
    else:
        # Update the conversation's last updated time
        conversation.updated_at = datetime.datetime.utcnow()
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

    return conversation