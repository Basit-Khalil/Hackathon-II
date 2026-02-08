// TaskForm component for creating new tasks

'use client';

import { useState } from 'react';
import { Task } from '../../lib/types';
import { apiClient } from '../../lib/api';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Alert from '../ui/Alert';

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the task with title, description, priority, and due date
      const response = await apiClient.createTask(title, description, priority || undefined, dueDate || undefined);

      onTaskCreated(response.task);
      setTitle('');
      setDescription('');
      setPriority('');
      setTags('');
      setDueDate('');
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  // Split tags by commas and remove whitespace
  const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

  return (
    <Card className="bg-white dark:bg-gray-800">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Task</h2>

      {error && (
        <div className="mb-4">
          <Alert
            type="error"
            title="Error"
            message={error}
            showIcon={true}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            label="Title *"
            placeholder="What needs to be done?"
          />
        </div>

        <div>
          <Input
            as="textarea"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="Description (Optional)"
            placeholder="Add details..."
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
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
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              label="Due Date (Optional)"
            />
          </div>
        </div>

        <div>
          <Input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            label="Tags (Optional)"
            placeholder="work, personal, urgent (comma separated)"
          />
        </div>

        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tagList.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating task...' : 'Add Task'}
        </Button>
      </form>
    </Card>
  );
}