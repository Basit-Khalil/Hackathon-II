import Link from 'next/link';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Streamline Your Tasks, <br />
            <span className="text-indigo-600">Maximize Your Productivity</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            TaskFlow is your personal productivity companion. Organize, prioritize, and accomplish your goals with our intuitive and secure task management platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button variant="primary" size="lg" className="px-8 py-3 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Powerful Features for Ultimate Productivity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Task Management</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create, organize, and prioritize your tasks with ease. Track your progress and stay on top of your goals.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Reminders</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Never miss a deadline with customizable reminders and notifications tailored to your schedule.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your data is protected with industry-leading security measures. Privacy is our top priority.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
            How TaskFlow Works
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 max-w-md">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-4 flex-shrink-0">1</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create Your Account</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 ml-14">
                Sign up in seconds and start organizing your tasks. No credit card required for our free trial.
              </p>
            </div>

            <div className="hidden md:block w-16 h-0.5 bg-gray-300 dark:bg-gray-700"></div>

            <div className="flex-1 max-w-md">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-4 flex-shrink-0">2</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add & Organize Tasks</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 ml-14">
                Create tasks, set priorities, add due dates, and categorize them for better organization.
              </p>
            </div>

            <div className="hidden md:block w-16 h-0.5 bg-gray-300 dark:bg-gray-700"></div>

            <div className="flex-1 max-w-md">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-4 flex-shrink-0">3</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Track & Complete</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 ml-14">
                Monitor your progress, receive reminders, and celebrate achievements as you complete tasks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Productivity?</h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of users who have revolutionized their task management workflow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button variant="light" size="lg" className="px-8 py-3 text-lg bg-white text-indigo-600 hover:bg-gray-100">
                Get Started Free
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-white text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
