// Custom hook for managing tasks

import { useState, useEffect } from 'react';
import { Task } from '../lib/types';
import { apiClient } from '../lib/api';

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks for the user
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getTasks();
        setTasks(response.tasks);
      } catch (err) {
        setError('Failed to load tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Create a new task
  const createTask = async (title: string, description?: string) => {
    try {
      setLoading(true);
      const response = await apiClient.createTask(title, description);
      setTasks([...tasks, response.task]);
      return response.task;
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing task
  const updateTask = async (taskId: string, title: string, description?: string, completed?: boolean) => {
    try {
      setLoading(true);
      const response = await apiClient.updateTask(taskId, title, description, completed);
      setTasks(tasks.map(task =>
        task.id === taskId ? response.task : task
      ));
      return response.task;
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      await apiClient.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      setLoading(true);
      const response = await apiClient.updateTaskCompletion(taskId, !task.completed);
      setTasks(tasks.map(t =>
        t.id === taskId ? response.task : t
      ));
      return response.task;
    } catch (err) {
      setError('Failed to update task completion');
      console.error('Error updating task completion:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
};

export default useTasks;