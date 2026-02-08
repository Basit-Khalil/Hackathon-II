// API routes for tasks management

import { NextRequest, NextResponse } from 'next/server';

// Mock task database
let mockTasks: Array<{
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}> = [
  {
    id: '1',
    title: 'Sample Task',
    description: 'This is a sample task',
    completed: false,
    createdAt: new Date().toISOString(),
    userId: '1'
  }
];

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Check if user is authenticated by checking the authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    // In a real app, you would verify the JWT here and extract the user ID
    // For this mock, we'll just proceed
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (pathname.endsWith('/api/tasks')) {
      // Get all tasks for the authenticated user
      // In a real app, you would filter by the user ID extracted from the token
      return NextResponse.json({
        tasks: mockTasks // In a real app, filter by userId
      });
    }

    // Extract task ID from the URL for specific task endpoints
    const taskIdMatch = pathname.match(/\/api\/tasks\/([^\/\?]+)/);
    if (taskIdMatch) {
      const taskId = taskIdMatch[1];

      const task = mockTasks.find(t => t.id === taskId);
      if (!task) {
        return NextResponse.json(
          { message: 'Task not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        task
      });
    }

    return NextResponse.json(
      { message: 'Invalid endpoint' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Tasks API GET error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (pathname.endsWith('/api/tasks')) {
      // Create a new task
      const { title, description } = await request.json();

      if (!title || title.trim() === '') {
        return NextResponse.json(
          { message: 'Title is required' },
          { status: 400 }
        );
      }

      const newTask = {
        id: Date.now().toString(), // In a real app, use UUID
        title: title.trim(),
        description: description?.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        userId: '1' // In a real app, extract from token
      };

      mockTasks.push(newTask);

      return NextResponse.json({
        task: newTask
      }, { status: 201 });
    }

    return NextResponse.json(
      { message: 'Invalid endpoint' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Tasks API POST error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Extract task ID from the URL
    const taskIdMatch = pathname.match(/\/api\/tasks\/([^\/\?]+)/);
    if (!taskIdMatch) {
      return NextResponse.json(
        { message: 'Task ID required' },
        { status: 400 }
      );
    }

    const taskId = taskIdMatch[1];
    const taskIndex = mockTasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    const { title, description, completed } = await request.json();

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 }
      );
    }

    // Update the task
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      title: title.trim(),
      description: description?.trim(),
      completed: completed ?? mockTasks[taskIndex].completed
    };

    return NextResponse.json({
      task: mockTasks[taskIndex]
    });
  } catch (error) {
    console.error('Tasks API PUT error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Extract task ID from the URL
    const taskIdMatch = pathname.match(/\/api\/tasks\/([^\/\?]+)\/complete/);
    if (!taskIdMatch) {
      return NextResponse.json(
        { message: 'Task ID required' },
        { status: 400 }
      );
    }

    const taskId = taskIdMatch[1];
    const taskIndex = mockTasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    const { completed } = await request.json();

    if (typeof completed !== 'boolean') {
      return NextResponse.json(
        { message: 'Completed status is required and must be a boolean' },
        { status: 400 }
      );
    }

    // Update the task completion status
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      completed
    };

    return NextResponse.json({
      task: mockTasks[taskIndex]
    });
  } catch (error) {
    console.error('Tasks API PATCH error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Extract task ID from the URL
    const taskIdMatch = pathname.match(/\/api\/tasks\/([^\/\?]+)/);
    if (!taskIdMatch) {
      return NextResponse.json(
        { message: 'Task ID required' },
        { status: 400 }
      );
    }

    const taskId = taskIdMatch[1];
    const taskIndex = mockTasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    // Remove the task
    const deletedTask = mockTasks.splice(taskIndex, 1)[0];

    return NextResponse.json({
      message: 'Task deleted successfully',
      task: deletedTask
    });
  } catch (error) {
    console.error('Tasks API DELETE error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}