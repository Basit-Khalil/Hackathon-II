'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Task } from '../../lib/types';

export default function DemoPage() {
  const [tasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Complete project proposal',
      description: 'Finish the proposal document and send to stakeholders',
      completed: false,
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      priority: 'high',
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 2 days from now
    },
    {
      id: 2,
      title: 'Team meeting',
      description: 'Weekly team sync meeting at 10 AM',
      completed: false,
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      priority: 'medium',
      due_date: new Date().toISOString().split('T')[0] // today
    },
    {
      id: 3,
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, fruits',
      completed: true,
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      priority: 'low',
      due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // tomorrow
    },
    {
      id: 4,
      title: 'Review quarterly reports',
      description: 'Analyze Q4 financial reports',
      completed: false,
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      priority: 'high',
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 5 days from now
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      {/* Demo Header */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Experience TaskFlow
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            See how easy it is to manage your tasks with our intuitive platform
          </p>
        </div>
      </section>

      {/* Demo Content */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Demo Tasks</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {tasks.filter(t => !t.completed).length} pending, {tasks.filter(t => t.completed).length} completed
              </div>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border flex items-center justify-between ${
                    task.completed
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      disabled
                      className={`h-5 w-5 rounded ${
                        task.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    <div>
                      <h3 className={`font-medium ${
                        task.completed
                          ? 'line-through text-gray-500 dark:text-gray-500'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm ${
                          task.completed
                            ? 'line-through text-gray-500 dark:text-gray-500'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {task.priority && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : task.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {task.priority} priority
                          </span>
                        )}
                        {task.due_date && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" disabled>
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Demo Features</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Create and manage tasks with titles and descriptions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Set priorities (high, medium, low) for better organization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Add due dates to track deadlines</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Mark tasks as complete/incomplete</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Filter and sort tasks by various criteria</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Boost Your Productivity?</h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of users who have transformed their task management workflow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button variant="light" size="lg" className="px-8 py-3 text-lg bg-white text-indigo-600 hover:bg-gray-100">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-white text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}