from typing import List, Dict, Any
from dataclasses import dataclass
from openai import OpenAI
from ..config.settings import settings
from ..tools.mcp_client import MCPClient
import json


@dataclass
class ToolCall:
    """
    Represents a tool call made by the agent.
    """
    tool_name: str
    parameters: Dict[str, Any]
    result: Dict[str, Any]


@dataclass
class AgentResponse:
    """
    Response from the AI agent.
    """
    response_text: str
    tool_calls: List[ToolCall]


# Initialize OpenAI client
client = OpenAI(api_key=settings.openai_api_key)


async def run_agent(user_id: int, conversation_id: int, user_message: str, session) -> AgentResponse:
    """
    Run the OpenAI agent to process a user message and return a response.

    Args:
        user_id: ID of the user
        conversation_id: ID of the conversation
        user_message: The user's message to process
        session: Database session

    Returns:
        AgentResponse containing the AI response and any tool calls made
    """
    try:
        # Initialize MCP client
        mcp_client = MCPClient(session)

        # Prepare the system message to instruct the agent on available tools
        system_prompt = f"""
        You are a helpful assistant that manages tasks for users. You can use the following tools:
        - add_task: Add a new task for the user
        - list_tasks: List the user's tasks
        - complete_task: Mark a task as completed
        - delete_task: Remove a task
        - update_task: Update an existing task

        When a user wants to perform any of these actions, call the appropriate tool with the required parameters.
        Always confirm actions to the user in your response.
        """

        # Get conversation history for context
        conversation_history = _get_conversation_history(conversation_id, session)

        # Prepare messages for the agent
        messages = [
            {"role": "system", "content": system_prompt},
        ]

        # Add conversation history
        for msg in conversation_history:
            messages.append({"role": msg.role, "content": msg.content})

        # Add the current user message
        messages.append({"role": "user", "content": user_message})

        # Define available tools
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string", "description": "Title of the task"},
                            "description": {"type": "string", "description": "Description of the task"}
                        },
                        "required": ["title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List the user's tasks",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "completed": {"type": "boolean", "description": "Filter by completion status (true for completed, false for incomplete, null for all)"}
                        }
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "complete_task",
                    "description": "Mark a task as completed",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {"type": "integer", "description": "ID of the task to complete"}
                        },
                        "required": ["task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Remove a task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {"type": "integer", "description": "ID of the task to delete"}
                        },
                        "required": ["task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Update an existing task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {"type": "integer", "description": "ID of the task to update"},
                            "title": {"type": "string", "description": "New title for the task"},
                            "description": {"type": "string", "description": "New description for the task"},
                            "completed": {"type": "boolean", "description": "New completion status"}
                        },
                        "required": ["task_id"]
                    }
                }
            }
        ]

        # Call the OpenAI API with tools
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )

        # Extract the response
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        # Process tool calls if any
        processed_tool_calls = []
        if tool_calls:
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)

                # Call the appropriate MCP tool
                if function_name == "add_task":
                    result = await mcp_client.add_task(
                        title=function_args.get("title"),
                        description=function_args.get("description"),
                        user_id=user_id
                    )
                elif function_name == "list_tasks":
                    completed_filter = function_args.get("completed")
                    result = await mcp_client.list_tasks(
                        user_id=user_id,
                        completed=completed_filter
                    )
                elif function_name == "complete_task":
                    result = await mcp_client.complete_task(
                        task_id=function_args.get("task_id"),
                        user_id=user_id
                    )
                elif function_name == "delete_task":
                    result = await mcp_client.delete_task(
                        task_id=function_args.get("task_id"),
                        user_id=user_id
                    )
                elif function_name == "update_task":
                    result = await mcp_client.update_task(
                        task_id=function_args.get("task_id"),
                        user_id=user_id,
                        title=function_args.get("title"),
                        description=function_args.get("description"),
                        completed=function_args.get("completed")
                    )
                else:
                    result = {"success": False, "error": f"Unknown tool: {function_name}"}

                # Add to processed tool calls
                processed_tool_calls.append(ToolCall(
                    tool_name=function_name,
                    parameters=function_args,
                    result=result
                ))

        # Get the response content
        response_text = response_message.content or "I processed your request."

        return AgentResponse(
            response_text=response_text,
            tool_calls=processed_tool_calls
        )

    except Exception as e:
        # Return error response
        return AgentResponse(
            response_text=f"Sorry, I encountered an error processing your request: {str(e)}",
            tool_calls=[]
        )


def _get_conversation_history(conversation_id: int, session):
    """
    Get conversation history from the database.

    Args:
        conversation_id: ID of the conversation
        session: Database session

    Returns:
        List of messages in the conversation
    """
    from ..models.message import Message
    messages = session.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc()).all()
    return messages