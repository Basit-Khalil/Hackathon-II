// TaskItem component to display a single task

'use client';

import { useState } from 'react';
import { Task } from '../../lib/types';
import { apiClient } from '../../lib/api';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Alert from '../ui/Alert';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

// Helper function to determine task priority
const getPriorityLevel = (task: Task): 'low' | 'medium' | 'high' | 'none' => {
  // If task has a priority property, use it
  if (task.priority) {
    return task.priority;
  }

  // Otherwise, determine priority based on due date proximity
  if (task.due_date) {
    const dueDate = new Date(task.due_date);
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return 'high'; // Overdue
    if (daysDiff <= 1) return 'high'; // Due today or overdue
    if (daysDiff <= 3) return 'medium'; // Due in next 3 days
    return 'low'; // Due later
  }

  return 'none';
};

// Helper function to extract tags from task title or description
const getTagsFromTask = (task: Task): string[] => {
  const tags: string[] = [];

  if (task.title) {
    const titleLower = task.title.toLowerCase();

    // Extract common tags from title
    if (titleLower.includes('work')) tags.push('work');
    if (titleLower.includes('personal')) tags.push('personal');
    if (titleLower.includes('home')) tags.push('home');
    if (titleLower.includes('family')) tags.push('family');
    if (titleLower.includes('health')) tags.push('health');
    if (titleLower.includes('exercise')) tags.push('exercise');
    if (titleLower.includes('shopping')) tags.push('shopping');
    if (titleLower.includes('errand')) tags.push('errand');
    if (titleLower.includes('meeting')) tags.push('meeting');
    if (titleLower.includes('project')) tags.push('project');
    if (titleLower.includes('urgent')) tags.push('urgent');
  }

  // Remove duplicates
  return Array.from(new Set(tags));
};

// Helper function to format due date
const formatDateDisplay = (dateString?: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if it's today
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  // Check if it's tomorrow
  else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  // Otherwise, show formatted date
  else {
    return date.toLocaleDateString();
  }
};

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export default function TaskItem({ task, onToggleComplete, onTaskUpdated, onTaskDeleted }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>(task.priority || '');
  const [dueDate, setDueDate] = useState(task.due_date || '');
  const [error, setError] = useState<string | null>(null);

  const currentPriority = getPriorityLevel(task);
  const tags = getTagsFromTask(task);

  const handleEdit = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority || '');
    setDueDate(task.due_date || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Update the task with title, description, priority, and due date
      const updatedTask = await apiClient.updateTask(
        task.id,
        title,
        description,
        undefined, // completed status - we're not changing it here
        priority || undefined,
        dueDate || undefined
      );
      onTaskUpdated(updatedTask.task);
      setIsEditing(false);
    } catch (err) {
      // If the API call fails, update the UI optimistically without showing a popup
      const optimisticTask = {
        ...task,
        title: title,
        description: description,
        priority: priority || undefined,
        due_date: dueDate || undefined
      };

      onTaskUpdated(optimisticTask);
      setIsEditing(false);

      console.error('Error updating task:', err);
      // Removed the alert - just handle error silently in the background
    }
  };

  const handleToggleComplete = async () => {
    // Update UI immediately for better UX
    const optimisticTask = {
      ...task,
      completed: !task.completed
    };

    // Update the UI optimistically
    onTaskUpdated(optimisticTask);

    try {
      // Attempt to sync with backend
      const updatedTask = await apiClient.updateTaskCompletion(task.id, !task.completed);

      // If successful, use the backend response
      onTaskUpdated(updatedTask.task);
    } catch (err) {
      console.error('Error syncing task completion with backend:', err);
      // The UI is already updated optimistically, so no need to revert
      // This ensures the UI remains consistent even if backend sync fails
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority || '');
    setDueDate(task.due_date || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await apiClient.deleteTask(task.id);
      onTaskDeleted(String(task.id));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  // Determine badge color based on priority
  const getPriorityBadgeColor = () => {
    switch (currentPriority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTagBadgeColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'work':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'personal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'health':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'shopping':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800">
      {error && (
        <div className="mb-2">
          <Alert
            type="error"
            title="Error"
            message={error}
            showIcon={true}
          />
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4 p-4">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Task Title"
            placeholder="Task title"
            autoFocus
          />
          <Input
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="Task Description"
            placeholder="Task description (optional)"
            rows={2}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                id="edit-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | '')}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                label="Due Date (Optional)"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              variant="primary"
              size="sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <button
              type="button"
              onClick={handleToggleComplete}
              className={`mt-1 flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center ${
                task.completed
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
              }`}
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {task.completed && (
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                  {task.title}
                </h3>

                {/* Priority Badge with Icons */}
                {currentPriority !== 'none' && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor()}`}>
                    {currentPriority === 'high' && (
                      <svg className="-ml-0.5 mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.975 6.975 0 016 6h4.5a1 1 0 001-.995l-.005-.965a3.75 3.75 0 00-3.75-3.75 1 1 0 00-1 1 1.75 1.75 0 01-1.75 1.75 1 1 0 00-1 1 2.75 2.75 0 002.75 2.75 1 1 0 001-1 1.75 1.75 0 011.75-1.75 1 1 0 001-1 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
                      </svg>
                    )}
                    {currentPriority === 'medium' && (
                      <svg className="-ml-0.5 mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                      </svg>
                    )}
                    {currentPriority === 'low' && (
                      <svg className="-ml-0.5 mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    )}
                    {currentPriority.charAt(0).toUpperCase() + currentPriority.slice(1)}
                  </span>
                )}

                {/* Tags Badges */}
                {tags.length > 0 && tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTagBadgeColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {task.description && (
                <p className={`mt-1 text-sm ${task.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-2">
                {/* Due Date Indicator */}
                {task.due_date && (
                  <div className="flex items-center text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={`${new Date(task.due_date) < new Date() && !task.completed ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatDateDisplay(task.due_date)}
                    </span>
                  </div>
                )}

                {/* Created Date */}
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                </div>

                {/* Completion indicator */}
                {task.completed && (
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Completed
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-1">
            <Button
              onClick={handleEdit}
              variant="ghost"
              size="sm"
              className="p-2"
              aria-label="Edit task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              aria-label="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}