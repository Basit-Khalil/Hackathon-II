// Centralized API client with JWT handling

import { Task, User, AuthResponse, TaskResponse, TasksResponse, LocalTask } from './types';
import { getAuthToken, removeAuthToken } from './auth';
import { taskStorage } from './taskStorage';


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';


class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Get token from our centralized auth functions
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // If we get a 401 or 403, clear the token and redirect
      if (response.status === 401 || response.status === 403) {
        removeAuthToken(); // Clear token using our auth function
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Authentication failed. Please log in again.');
      }

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      // Handle network errors - fallback to local storage
      if (error instanceof TypeError || (error as Error).message?.includes('Network error') || (error as Error).message?.includes('Failed to fetch')) {
        console.warn(`Network error for ${url}, falling back to local storage:`, error);

        // For certain endpoints, use local storage as fallback
        if (endpoint.startsWith('/tasks')) {
          return this.handleTaskFallback(endpoint, options) as T;
        }
      }

      console.error(`API request error for ${url}:`, error);
      throw error;
    }
  }

  private async handleTaskFallback(endpoint: string, options: RequestInit): Promise<any> {
    const method = options.method || 'GET';
    const pathParts = endpoint.replace('/tasks', '').split('/').filter(p => p);

    if (method === 'GET') {
      if (pathParts.length === 0) {
        // GET /tasks - return all tasks
        const localTasks = taskStorage.getTasks();
        return { tasks: localTasks.map(this.transformLocalTaskToResponse) };
      } else {
        // GET /tasks/:id - return specific task
        const taskId = pathParts[0];
        const localTasks = taskStorage.getTasks();
        const task = localTasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');
        return this.transformLocalTaskToResponse(task);
      }
    } else if (method === 'POST') {
      // POST /tasks - create task
      const body = JSON.parse(options.body as string);
      const newTask = taskStorage.addTask({
        title: body.title,
        description: body.description,
        completed: false,
        priority: body.priority,
        due_date: body.due_date
      });
      return this.transformLocalTaskToResponse(newTask);
    } else if (method === 'PUT') {
      // PUT /tasks/:id - update task
      const taskId = pathParts[0];
      const body = JSON.parse(options.body as string);
      const updatedTask = taskStorage.updateTask(taskId, {
        title: body.title,
        description: body.description,
        completed: body.completed,
        priority: body.priority,
        due_date: body.due_date
      });
      if (!updatedTask) throw new Error('Task not found');
      return { task: this.transformLocalTaskToResponse(updatedTask) };
    } else if (method === 'DELETE') {
      // DELETE /tasks/:id - delete task
      const taskId = pathParts[0];
      const success = taskStorage.deleteTask(taskId);
      if (!success) throw new Error('Task not found');
      return { message: 'Task deleted successfully' };
    } else if (method === 'PATCH' && endpoint.includes('/complete')) {
      // PATCH /tasks/:id/complete - update completion status
      const taskId = pathParts[0];
      const body = JSON.parse(options.body as string);
      const updatedTask = taskStorage.updateTaskCompletion(taskId, body.completed);
      if (!updatedTask) {
        // If the task is not found in local storage, try to find it by other means
        // First, check if taskId is numeric and try to find a local task that might match
        if (!isNaN(Number(taskId))) {
          // This is likely a numeric ID from the UI state but not in local storage
          // We'll create a fallback response with the ID provided
          return {
            task: {
              id: taskId,
              title: 'Task',
              description: undefined,
              completed: body.completed,
              user_id: 'local_user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              priority: undefined,
              due_date: undefined
            }
          };
        }
        throw new Error('Task not found');
      }
      return { task: this.transformLocalTaskToResponse(updatedTask) };
    }

    throw new Error('Unsupported operation');
  }

  private transformLocalTaskToResponse(localTask: LocalTask): TaskResponse {
    return {
      id: localTask.id,
      title: localTask.title,
      description: localTask.description,
      completed: localTask.completed,
      user_id: 'local_user', // Placeholder for fallback
      created_at: localTask.created_at,
      updated_at: localTask.updated_at,
      priority: localTask.priority,
      due_date: localTask.due_date
    };
  }

  // Authentication endpoints - these will be handled by auth.ts now
  // Keeping these for backward compatibility but they should use auth.ts functions directly

  // Task management endpoints
  async getTasks(): Promise<TasksResponse> {
    try {
      const response = await this.request<{ tasks: TaskResponse[] } | TaskResponse[]>('/tasks');

      // Check if response is in the format { tasks: [...] } or just [...]
      const tasksArray = Array.isArray(response) ? response : response.tasks;

      // Transform the response to match the expected format
      const tasks = tasksArray.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        user_id: task.user_id,
        created_at: task.created_at,
        updated_at: task.updated_at,
        priority: task.priority,
        due_date: task.due_date
      }));

      return { tasks };
    } catch (error) {
      // In case of network error, the fallback is already handled in the request method
      throw error;
    }
  }

  async createTask(title: string, description?: string, priority?: 'low' | 'medium' | 'high', due_date?: string): Promise<{ task: Task }> {
    const payload: any = { title, description };
    if (priority) payload.priority = priority;
    if (due_date) payload.due_date = due_date;

    const response = await this.request<{ task: TaskResponse } | TaskResponse>('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // Check if response is in the format { task: {...} } or just {...}
    const taskResponse = ('task' in response) ? response.task : response;

    // Transform the response to match the expected format
    return {
      task: {
        id: taskResponse.id,
        title: taskResponse.title,
        description: taskResponse.description,
        completed: taskResponse.completed,
        user_id: taskResponse.user_id,
        created_at: taskResponse.created_at,
        updated_at: taskResponse.updated_at,
        priority: taskResponse.priority,
        due_date: taskResponse.due_date
      }
    };
  }

  async updateTask(taskId: string | number, title?: string, description?: string, completed?: boolean, priority?: 'low' | 'medium' | 'high', due_date?: string): Promise<{ task: Task }> {
    // Create payload with only defined values to avoid sending undefined
    const payload: any = {};
    if (title !== undefined) payload.title = title;
    if (description !== undefined) payload.description = description;
    if (completed !== undefined) payload.completed = completed;
    if (priority !== undefined) payload.priority = priority;
    if (due_date !== undefined) payload.due_date = due_date;

    const response = await this.request<{ task: TaskResponse } | TaskResponse>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    // Check if response is in the format { task: {...} } or just {...}
    const taskResponse = ('task' in response) ? response.task : response;

    // Transform the response to match the expected format
    return {
      task: {
        id: taskResponse.id,
        title: taskResponse.title,
        description: taskResponse.description,
        completed: taskResponse.completed,
        user_id: taskResponse.user_id,
        created_at: taskResponse.created_at,
        updated_at: taskResponse.updated_at,
        priority: taskResponse.priority,
        due_date: taskResponse.due_date
      }
    };
  }

  async deleteTask(taskId: string | number): Promise<{ message: string }> {
    const response = await this.request<{ message: string } | string>(`/tasks/${taskId}`, {
      method: 'DELETE',
    });

    // Handle response format
    if (typeof response === 'string') {
      return { message: response };
    }
    return response;
  }

  async updateTaskCompletion(taskId: string | number, completed: boolean): Promise<{ task: Task }> {
    const response = await this.request<{ task: TaskResponse } | TaskResponse>(`/tasks/${taskId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });

    // Check if response is in the format { task: {...} } or just {...}
    const taskResponse = ('task' in response) ? response.task : response;

    // Transform the response to match the expected format
    return {
      task: {
        id: taskResponse.id,
        title: taskResponse.title,
        description: taskResponse.description,
        completed: taskResponse.completed,
        user_id: taskResponse.user_id,
        created_at: taskResponse.created_at,
        updated_at: taskResponse.updated_at,
        priority: taskResponse.priority,
        due_date: taskResponse.due_date
      }
    };
  }
}

export const apiClient = new ApiClient();