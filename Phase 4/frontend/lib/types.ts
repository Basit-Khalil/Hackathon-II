// Type definitions for User and Task entities

export interface User {
  id: number | string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number | string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TaskResponse {
  id: number | string;
  title: string;
  description?: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
}

export interface LocalTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
}

export interface TasksResponse {
  tasks: Task[];
}

