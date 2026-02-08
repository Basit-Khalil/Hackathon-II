// Local storage utility for task management when backend is unavailable

import { LocalTask } from './types';

const TASK_STORAGE_KEY = 'todo_tasks';

export const taskStorage = {
  // Get tasks from local storage
  getTasks(): LocalTask[] {
    try {
      const tasksJson = localStorage.getItem(TASK_STORAGE_KEY);
      if (!tasksJson) return [];

      const tasks = JSON.parse(tasksJson);
      return tasks.map((task: any) => ({
        ...task,
        created_at: task.created_at || new Date().toISOString(),
        updated_at: task.updated_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error reading tasks from localStorage:', error);
      return [];
    }
  },

  // Save tasks to local storage
  saveTasks(tasks: LocalTask[]): void {
    try {
      localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  },

  // Add a new task
  addTask(task: Omit<LocalTask, 'id' | 'created_at' | 'updated_at'>): LocalTask {
    const tasks = this.getTasks();
    const newTask: LocalTask = {
      ...task,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  },

  // Update a task
  updateTask(id: string, updates: Partial<Omit<LocalTask, 'id' | 'created_at'>>): LocalTask | null {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) return null;

    const updatedTask = {
      ...tasks[taskIndex],
      ...Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined)),
      updated_at: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    this.saveTasks(tasks);
    return updatedTask;
  },

  // Delete a task
  deleteTask(id: string): boolean {
    const tasks = this.getTasks();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter(task => task.id !== id);

    if (filteredTasks.length === initialLength) return false; // Task not found

    this.saveTasks(filteredTasks);
    return true;
  },

  // Update task completion status
  updateTaskCompletion(id: string, completed: boolean): LocalTask | null {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) return null;

    const updatedTask = {
      ...tasks[taskIndex],
      completed: completed,
      updated_at: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    this.saveTasks(tasks);
    return updatedTask;
  }
};