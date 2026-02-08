// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TaskList from '@/components/tasks/TaskList';
import { getCurrentUser, logoutUser, UserData } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { Task } from '@/lib/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    progressPercentage: 0
  });
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);
  const [productivityBreakdown, setProductivityBreakdown] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const initializeDashboard = async () => {
      const userData = await getCurrentUser();
      if (!userData) {
        router.push('/login'); // redirect if not logged in
        return;
      }

      setUser(userData);

      // Fetch tasks and calculate stats
      try {
        const response = await apiClient.getTasks();
        const tasks: Task[] = Array.isArray(response.tasks) ? response.tasks.filter(task => task && task.id) : [];

        // Calculate basic stats
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        setStats({
          totalTasks,
          completedTasks,
          pendingTasks,
          progressPercentage
        });

        // Calculate weekly progress
        const today = new Date();
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Get the start of the week (Sunday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Adjust to Sunday

        const weeklyData = weekDays.map((day, index) => {
          // Calculate the specific date for this day of the week
          const targetDate = new Date(startOfWeek);
          targetDate.setDate(startOfWeek.getDate() + index);

          // Format the target date to compare with task dates
          const targetDateStr = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD format

          // Count tasks completed on this day (based on when they were marked as completed)
          // Since we don't have a completed_at field, we'll consider completed tasks created on this day
          const completedToday = tasks.filter(task => {
            const taskDateStr = new Date(task.created_at).toISOString().split('T')[0];
            return taskDateStr === targetDateStr && task.completed;
          }).length;

          // Count total tasks created on this day
          const totalToday = tasks.filter(task => {
            const taskDateStr = new Date(task.created_at).toISOString().split('T')[0];
            return taskDateStr === targetDateStr;
          }).length;

          const percentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

          return {
            day,
            completed: completedToday,
            total: totalToday,
            percentage
          };
        });

        setWeeklyProgress(weeklyData);

        // Calculate productivity breakdown by task categories (using tags or descriptions if available)
        // For now, we'll categorize based on title keywords
        const workTasks = tasks.filter(task =>
          task.title.toLowerCase().includes('work') ||
          task.title.toLowerCase().includes('meeting') ||
          task.title.toLowerCase().includes('project')
        ).length;

        const personalTasks = tasks.filter(task =>
          task.title.toLowerCase().includes('personal') ||
          task.title.toLowerCase().includes('home') ||
          task.title.toLowerCase().includes('family')
        ).length;

        const healthTasks = tasks.filter(task =>
          task.title.toLowerCase().includes('health') ||
          task.title.toLowerCase().includes('exercise') ||
          task.title.toLowerCase().includes('workout') ||
          task.title.toLowerCase().includes('doctor')
        ).length;

        const learningTasks = tasks.filter(task =>
          task.title.toLowerCase().includes('learn') ||
          task.title.toLowerCase().includes('study') ||
          task.title.toLowerCase().includes('course') ||
          task.title.toLowerCase().includes('read')
        ).length;

        // Calculate other tasks
        const otherTasks = totalTasks - workTasks - personalTasks - healthTasks - learningTasks;

        // Convert to percentages
        const totalCategorized = workTasks + personalTasks + healthTasks + learningTasks + otherTasks;
        const productivityData = [
          { label: 'Work Tasks', value: totalCategorized > 0 ? Math.round((workTasks / totalCategorized) * 100) : 0, color: 'bg-blue-500' },
          { label: 'Personal', value: totalCategorized > 0 ? Math.round((personalTasks / totalCategorized) * 100) : 0, color: 'bg-purple-500' },
          { label: 'Health', value: totalCategorized > 0 ? Math.round((healthTasks / totalCategorized) * 100) : 0, color: 'bg-green-500' },
          { label: 'Learning', value: totalCategorized > 0 ? Math.round((learningTasks / totalCategorized) * 100) : 0, color: 'bg-yellow-500' },
          { label: 'Other', value: totalCategorized > 0 ? Math.round((otherTasks / totalCategorized) * 100) : 0, color: 'bg-gray-500' },
        ];

        setProductivityBreakdown(productivityData.filter(item => item.value > 0)); // Only show categories with tasks

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values in case of error
        setStats({
          totalTasks: 0,
          completedTasks: 0,
          pendingTasks: 0,
          progressPercentage: 0
        });
        setWeeklyProgress([]);
        setProductivityBreakdown([]);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);

  // Function to fetch and refresh stats when tasks change
  const fetchAndRefreshStats = async () => {
    try {
      const response = await apiClient.getTasks();
      const tasks: Task[] = Array.isArray(response.tasks) ? response.tasks.filter(task => task && task.id) : [];

      // Calculate basic stats
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.completed).length;
      const pendingTasks = totalTasks - completedTasks;
      const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      setStats({
        totalTasks,
        completedTasks,
        pendingTasks,
        progressPercentage
      });

      // Calculate weekly progress
      const today = new Date();
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      // Get the start of the week (Sunday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Adjust to Sunday

      const weeklyData = weekDays.map((day, index) => {
        // Calculate the specific date for this day of the week
        const targetDate = new Date(startOfWeek);
        targetDate.setDate(startOfWeek.getDate() + index);

        // Format the target date to compare with task dates
        const targetDateStr = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD format

        // Count tasks completed on this day (based on when they were marked as completed)
        // Since we don't have a completed_at field, we'll consider completed tasks created on this day
        const completedToday = tasks.filter(task => {
          const taskDateStr = new Date(task.created_at).toISOString().split('T')[0];
          return taskDateStr === targetDateStr && task.completed;
        }).length;

        // Count total tasks created on this day
        const totalToday = tasks.filter(task => {
          const taskDateStr = new Date(task.created_at).toISOString().split('T')[0];
          return taskDateStr === targetDateStr;
        }).length;

        const percentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

        return {
          day,
          completed: completedToday,
          total: totalToday,
          percentage
        };
      });

      setWeeklyProgress(weeklyData);

      // Calculate productivity breakdown by task categories (using tags or descriptions if available)
      // For now, we'll categorize based on title keywords
      const workTasks = tasks.filter(task =>
        task.title.toLowerCase().includes('work') ||
        task.title.toLowerCase().includes('meeting') ||
        task.title.toLowerCase().includes('project')
      ).length;

      const personalTasks = tasks.filter(task =>
        task.title.toLowerCase().includes('personal') ||
        task.title.toLowerCase().includes('home') ||
        task.title.toLowerCase().includes('family')
      ).length;

      const healthTasks = tasks.filter(task =>
        task.title.toLowerCase().includes('health') ||
        task.title.toLowerCase().includes('exercise') ||
        task.title.toLowerCase().includes('workout') ||
        task.title.toLowerCase().includes('doctor')
      ).length;

      const learningTasks = tasks.filter(task =>
        task.title.toLowerCase().includes('learn') ||
        task.title.toLowerCase().includes('study') ||
        task.title.toLowerCase().includes('course') ||
        task.title.toLowerCase().includes('read')
      ).length;

      // Calculate other tasks
      const otherTasks = totalTasks - workTasks - personalTasks - healthTasks - learningTasks;

      // Convert to percentages
      const totalCategorized = workTasks + personalTasks + healthTasks + learningTasks + otherTasks;
      const productivityData = [
        { label: 'Work Tasks', value: totalCategorized > 0 ? Math.round((workTasks / totalCategorized) * 100) : 0, color: 'bg-blue-500' },
        { label: 'Personal', value: totalCategorized > 0 ? Math.round((personalTasks / totalCategorized) * 100) : 0, color: 'bg-purple-500' },
        { label: 'Health', value: totalCategorized > 0 ? Math.round((healthTasks / totalCategorized) * 100) : 0, color: 'bg-green-500' },
        { label: 'Learning', value: totalCategorized > 0 ? Math.round((learningTasks / totalCategorized) * 100) : 0, color: 'bg-yellow-500' },
        { label: 'Other', value: totalCategorized > 0 ? Math.round((otherTasks / totalCategorized) * 100) : 0, color: 'bg-gray-500' },
      ];

      setProductivityBreakdown(productivityData.filter(item => item.value > 0)); // Only show categories with tasks

    } catch (error) {
      console.error('Error refreshing dashboard stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                Todo Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                Welcome, {user?.name || user?.email}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Tasks</h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalTasks}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completedTasks}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pendingTasks}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress</h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.progressPercentage}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress Chart */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Weekly Progress</h3>
            <div className="space-y-4">
              {weeklyProgress.length > 0 ? (
                weeklyProgress.map((dayData, index) => (
                  <div key={index} className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors duration-200">
                    <div className="w-12 text-sm text-gray-600 dark:text-gray-300">{dayData.day}</div>
                    <div className="flex-1 ml-2">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>{dayData.completed}/{dayData.total} tasks</span>
                        <span>{dayData.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${dayData.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No task data available for this week
                </div>
              )}
            </div>
          </Card>

          {/* Productivity Chart */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Productivity Breakdown</h3>
            <div className="space-y-4">
              {productivityBreakdown.length > 0 ? (
                productivityBreakdown.map((item, index) => (
                  <div key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors duration-200">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                      <span className="text-gray-600 dark:text-gray-400">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className={`${item.color} h-2.5 rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No categorized tasks available
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Your Tasks
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage your tasks with priorities, tags, and advanced filtering
                  </p>
                </div>
              </div>

              <TaskList
                onTaskCreated={fetchAndRefreshStats}
                onTaskUpdated={fetchAndRefreshStats}
                onTaskDeleted={fetchAndRefreshStats}
                onTaskCompletionChange={fetchAndRefreshStats}
                onToggleComplete={fetchAndRefreshStats}
              />
            </Card>
          </div>

          <div className="space-y-8">
            {/* Quick Stats */}
            <Card className="hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors duration-200">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Productivity</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{stats.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${stats.progressPercentage}%` }}></div>
                  </div>
                </div>

                <div className="hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors duration-200">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Focus Level</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{stats.completedTasks > 0 ? Math.min(100, Math.round((stats.completedTasks / Math.max(stats.totalTasks, 1)) * 100)) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${stats.completedTasks > 0 ? Math.min(100, Math.round((stats.completedTasks / Math.max(stats.totalTasks, 1)) * 100)) : 0}%` }}></div>
                  </div>
                </div>

                <div className="hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors duration-200">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Completion Rate</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{stats.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${stats.progressPercentage}%` }}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
              <ul className="space-y-3">
                {stats.totalTasks > 0 ? (
                  <>
                    <li className="flex items-start p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      </div>
                      <p className="ml-3 text-sm text-gray-600 dark:text-gray-300">Completed {stats.completedTasks} tasks</p>
                    </li>
                    <li className="flex items-start p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      </div>
                      <p className="ml-3 text-sm text-gray-600 dark:text-gray-300">Added {stats.totalTasks} tasks</p>
                    </li>
                    <li className="flex items-start p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                      </div>
                      <p className="ml-3 text-sm text-gray-600 dark:text-gray-300">{stats.pendingTasks} tasks remaining</p>
                    </li>
                  </>
                ) : (
                  <li className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No recent activity yet
                  </li>
                )}
              </ul>
            </Card>

            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full hover:scale-[1.02] transition-transform duration-200"
                >
                  Add Task
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:scale-[1.02] transition-transform duration-200"
                >
                  Set Reminder
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:scale-[1.02] transition-transform duration-200"
                >
                  Share List
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:scale-[1.02] transition-transform duration-200"
                >
                  Export
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button
              variant="ghost"
              className="mx-auto hover:scale-105 transition-transform duration-200"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
