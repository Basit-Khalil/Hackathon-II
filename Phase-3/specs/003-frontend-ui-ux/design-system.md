# Frontend UI/UX Design System

## Overview
This document outlines the design system for the Todo application frontend, providing guidelines for consistent UI/UX implementation across all components and pages.

## Color Palette
- **Primary**: #4F46E5 (Indigo) - Used for primary buttons, links, and highlights
- **Secondary**: #10B981 (Emerald) - Used for success states and positive actions
- **Danger**: #EF4444 (Red) - Used for delete actions and error states
- **Warning**: #F59E0B (Amber) - Used for warnings and notifications
- **Neutral Background**: #F9FAFB (Gray-50) - Main background color
- **Surface**: #FFFFFF (White) - Card backgrounds and surfaces
- **Text Primary**: #111827 (Gray-900) - Main text color
- **Text Secondary**: #6B7280 (Gray-500) - Secondary text and muted content

## Typography
- **Headings**: Inter, Bold, sizes ranging from 24px (H1) to 16px (H4)
- **Body Text**: Inter, Regular, 16px size with 1.5 line height
- **Captions**: Inter, Regular, 14px size
- **Monospace**: JetBrains Mono, for code snippets and technical content

## Spacing System
- Base unit: 4px
- Spacing scale: 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
- Consistent padding and margins using the spacing scale
- Container max-width: 1200px with 24px horizontal padding

## Component Specifications

### Buttons
- **Primary**: Indigo background, white text, medium padding (12px 24px), rounded-md (4px radius)
- **Secondary**: White background, indigo border, indigo text, medium padding
- **Size Variants**: Small (8px 16px), Medium (12px 24px), Large (16px 32px)
- **States**: Default, Hover (darker shade), Active (pressed effect), Disabled (muted appearance)

### Cards
- **Background**: White with subtle shadow (shadow-sm)
- **Padding**: 24px internal padding
- **Border Radius**: rounded-lg (8px)
- **Borders**: Optional light gray border (border border-gray-200)

### Forms
- **Inputs**: Rounded-md (4px), border-gray-300, focus:ring-indigo-500, focus:border-indigo-500
- **Labels**: Text-sm font-medium text-gray-700
- **Errors**: Red text (#EF4444) with icon indicator
- **Layout**: Vertical stacking with 16px vertical spacing

### Navigation
- **Top Bar**: White background with light shadow, 64px height
- **Links**: Gray-700 default, indigo-600 on hover
- **Active State**: Indigo-600 text with bottom border
- **Mobile Menu**: Slide-in overlay with overlay background

## Responsive Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Responsive Behavior
- **Mobile**: Single column layout, hamburger menu, stacked elements
- **Tablet**: Two-column layouts where appropriate, expanded navigation
- **Desktop**: Multi-column layouts, full navigation, side panels

## Accessibility Guidelines
- **Contrast Ratio**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus rings (focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2)
- **Keyboard Navigation**: Tab order follows visual order, all interactive elements accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels, semantic HTML elements

## Animation Guidelines
- **Duration**: Fast animations (150ms), Medium (300ms), Slow (500ms)
- **Easing**: Ease-in-out for most transitions
- **Micro-interactions**: Button hover effects, loading states, form feedback
- **Motion Reduction**: Respect user preference for reduced motion

## Dark Mode Specifications
- **Background**: #111827 (Gray-900)
- **Surface**: #1F2937 (Gray-800)
- **Text Primary**: #F9FAFB (Gray-50)
- **Text Secondary**: #9CA3AF (Gray-400)
- **Accents**: Adjust colors to maintain contrast ratios in dark context