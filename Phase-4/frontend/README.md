# Todo App Frontend

This is the frontend for the secure Todo web application built with Next.js, featuring a modern dark-mode-first design system.

## Features

- **Authentication**: Secure sign-in and sign-up flows
- **Task Management**: Create, update, and delete tasks
- **Dark Mode**: First-class dark mode support with theme switching
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: WCAG-compliant with proper contrast and keyboard navigation
- **Modern UI**: Clean, minimal interface with intuitive interactions

## Design System

The application follows a comprehensive design system with:

- Consistent color palette (dark mode first with indigo accents)
- Typography scale for clear hierarchy
- Spacing system for consistent layout
- Reusable UI components (buttons, cards, inputs, alerts, etc.)
- Theme context for dark/light mode switching

## Architecture

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: React Context API for theme management
- **Components**: Atomic design principles with reusable UI elements
- **Type Safety**: TypeScript throughout

## Components

- `Button`: Versatile button component with multiple variants and sizes
- `Card`: Container component with elevation and padding options
- `Input`: Flexible input component supporting text and textarea
- `Modal`: Dialog component for overlays
- `Alert`: Notification component with different types
- `ThemeToggle`: Component for switching between themes
- `Header`: Navigation header with user controls
- `Footer`: Site footer with legal links

## Dark Mode Implementation

The application uses a class-based dark mode approach that:
- Persists user preference in localStorage
- Respects system preference by default
- Provides smooth transitions between themes
- Maintains proper contrast ratios in both modes

## Accessibility

- Proper semantic HTML structure
- ARIA attributes where needed
- Sufficient color contrast ratios (WCAG AA compliant)
- Keyboard navigation support
- Screen reader compatibility

## Getting Started

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Visit `http://localhost:3000` to see the application

## Demo

A component demo page is available at `/demo` to showcase the design system components and theme switching functionality.