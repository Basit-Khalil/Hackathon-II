import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { ThemeProvider } from '../contexts/ThemeContext';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A simple todo application with authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            {/* Chat Widget - Will be initialized after page loads */}
            <div id="chat-widget-container"></div>
            <link rel="stylesheet" href="/chat_widget/css/chat_widget.css" />
            <Script
              src="/chat_widget/js/chat_widget.js"
              strategy="beforeInteractive"
            />
            <Script
              id="chat-widget-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.addEventListener('load', function() {
                    // Initialize chat widget with current user ID
                    // In a real implementation, you would get the actual user ID from auth context
                    if (typeof window.ChatWidget !== 'undefined') {
                      // Try to get user ID from a global variable or auth context
                      // Default to 1 for demo purposes if no user is found
                      const userId = window.currentUser ? window.currentUser.id : 1;
                      window.ChatWidget.init(userId);
                    }
                  });
                `
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}