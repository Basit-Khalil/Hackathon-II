// TaskList component to display user's tasks

'use client';

import { useState, useEffect, useRef, DragEvent } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { Task } from '../../lib/types';
import { apiClient } from '../../lib/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface TaskListProps {
  onTaskCreated?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
  onTaskDeleted?: (taskId: string | number) => void;
  onTaskCompletionChange?: (task: Task) => void; // New prop for completion changes
  onToggleComplete?: (task: Task) => void; // Original toggle complete function
}

export default function TaskList({ onTaskCreated: onParentTaskCreated, onTaskUpdated: onParentTaskUpdated, onTaskDeleted: onParentTaskDeleted, onTaskCompletionChange, onToggleComplete: originalOnToggleComplete }: TaskListProps = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title' | 'due_date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getTasks();
      const validTasks = Array.isArray(response.tasks) ? response.tasks.filter(task => task && task.id) : [];
      setTasks(validTasks);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error fetching tasks:', err);
      setTasks([]); // Ensure tasks is always an array even on error
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => {
      const validPrevTasks = (prevTasks || []).filter(task => task && task.id);
      // Only add the new task if it's valid
      const validNewTask = newTask && newTask.id ? newTask : null;
      return validNewTask ? [...validPrevTasks, validNewTask] : validPrevTasks;
    });

    // Notify parent component if callback exists
    if (onParentTaskCreated) {
      onParentTaskCreated(newTask);
    }
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prevTasks => {
      const validPrevTasks = (prevTasks || []).filter(task => task && task.id);
      return validPrevTasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    });

    // Notify parent component if callback exists
    if (onParentTaskUpdated) {
      onParentTaskUpdated(updatedTask);
    }
  };

  const handleTaskDeleted = (taskId: string | number) => {
    setTasks(prevTasks => {
      const validPrevTasks = (prevTasks || []).filter(task => task && task.id);
      return validPrevTasks.filter(task => task.id !== taskId);
    });

    // Notify parent component if callback exists
    if (onParentTaskDeleted) {
      onParentTaskDeleted(taskId);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    // Update UI immediately for better UX
    const optimisticTask = {
      ...task,
      completed: !task.completed
    };

    // Update the UI optimistically
    setTasks(prevTasks => {
      const validPrevTasks = (prevTasks || []).filter(t => t && t.id);
      return validPrevTasks.map(t => t.id === task.id ? optimisticTask : t);
    });

    // Notify parent about completion status change with optimistic update
    if (onParentTaskUpdated) {
      onParentTaskUpdated(optimisticTask);
    }

    // Also call the specific completion change callback if provided
    if (onTaskCompletionChange) {
      onTaskCompletionChange(optimisticTask);
    }

    // Call the original toggle complete function if provided
    if (originalOnToggleComplete) {
      originalOnToggleComplete(optimisticTask);
    }

    try {
      // Attempt to sync with backend
      const updatedTask = await apiClient.updateTaskCompletion(task.id, !task.completed);

      // If successful, update with backend response
      setTasks(prevTasks => {
        const validPrevTasks = (prevTasks || []).filter(t => t && t.id);
        return validPrevTasks.map(t => t.id === updatedTask.task.id ? updatedTask.task : t);
      });

      // Call the original toggle complete function if provided
      if (originalOnToggleComplete) {
        originalOnToggleComplete(updatedTask.task);
      }

      // Notify parent about completion status change
      if (onParentTaskUpdated) {
        onParentTaskUpdated(updatedTask.task);
      }

      // Also call the specific completion change callback if provided
      if (onTaskCompletionChange) {
        onTaskCompletionChange(updatedTask.task);
      }
    } catch (err) {
      console.error('Error syncing task completion with backend:', err);
      // The UI is already updated optimistically, so no need to revert
      // This ensures the UI remains consistent even if backend sync fails
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', task.id.toString());
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-t-2', 'border-blue-500');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.remove('border-t-2', 'border-blue-500');
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetTask: Task) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-t-2', 'border-blue-500');

    if (!draggedTask) return;

    // Update the task order in the state
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      const draggedIndex = newTasks.findIndex(t => t.id === draggedTask.id);
      const targetIndex = newTasks.findIndex(t => t.id === targetTask.id);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Remove the dragged task
        const [dragged] = newTasks.splice(draggedIndex, 1);

        // Insert at the new position
        const newIndex = draggedIndex < targetIndex ? targetIndex : targetIndex;
        newTasks.splice(newIndex, 0, dragged);
      }

      return newTasks;
    });

    setDraggedTask(null);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedTask(null);
  };

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

  // State for showing all tasks
  const [showAllTasks, setShowAllTasks] = useState(false);

  // Apply filters, search, and sorting
  const filteredAndSortedTasks = tasks
    .filter(task => {
      // Status filter
      if (statusFilter === 'active' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;

      // Priority filter
      if (priorityFilter !== 'all') {
        const taskPriority = getPriorityLevel(task);
        if (taskPriority !== priorityFilter) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description?.toLowerCase().includes(query) || false;
        const matchesTags = getTagsFromTask(task).some(tag => tag.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDescription && !matchesTags) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'priority') {
        const priorityValues = { 'high': 3, 'medium': 2, 'low': 1, 'none': 0 };
        const priorityA = priorityValues[getPriorityLevel(a)] || 0;
        const priorityB = priorityValues[getPriorityLevel(b)] || 0;
        return sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
      } else if (sortBy === 'due_date') {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return sortOrder === 'asc' ? 1 : -1;
        if (!b.due_date) return sortOrder === 'asc' ? -1 : 1;

        const dateA = new Date(a.due_date).getTime();
        const dateB = new Date(b.due_date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else { // date (created_at)
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });

  // Limit tasks to 4 if showAllTasks is false and no filters are applied
  const displayTasks = (!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && !showAllTasks)
    ? filteredAndSortedTasks.slice(0, 4)
    : filteredAndSortedTasks;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4">
        <Alert
          type="error"
          title="Error"
          message={error}
          showIcon={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskForm onTaskCreated={handleTaskCreated} />

      {/* Search and Filter Controls */}
      <Card className="p-4 bg-white dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'completed')}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex space-x-2 w-full lg:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'title' | 'due_date')}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
              <option value="due_date">Sort by Due Date</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center"
              title={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
            >
              {sortOrder === 'asc' ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Your Tasks
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {displayTasks.length} of {tasks.length} tasks
            {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && filteredAndSortedTasks.length > 4 && !showAllTasks && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">Limited to 4 tasks</span>
            )}
          </div>
        </div>

        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {displayTasks.length === 0 ? (
              <li className="p-12 text-center">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tasks found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'No tasks match your current filters. Try adjusting your search or filter settings.'
                    : 'Get started by creating your first task.'}
                </p>
              </li>
            ) : (
              displayTasks.map((task, index) => (
                <li
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, task)}
                  onDragEnd={handleDragEnd}
                  className="cursor-move transition-all duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <TaskItem
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                  />
                </li>
              ))
            )}
          </ul>

          {/* Show View All button when there are more than 4 tasks and no filters are applied */}
          {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && filteredAndSortedTasks.length > 4 && !showAllTasks && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={() => setShowAllTasks(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View All Tasks ({filteredAndSortedTasks.length})
              </button>
            </div>
          )}

          {/* Show View Less button when showing all tasks and there are more than 4 tasks */}
          {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && filteredAndSortedTasks.length > 4 && showAllTasks && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={() => setShowAllTasks(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Show Limited (4)
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}