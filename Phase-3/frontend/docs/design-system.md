# Todo App Design System

## Overview
This document outlines the design system for the Todo application, including color palettes, typography, spacing, and component specifications.

## Color Palette

### Primary Colors
- **Near-black Background**: `#0a0a0a` (RGB: 10, 10, 10)
- **Charcoal Background**: `#121212` (RGB: 18, 18, 18)
- **Surface**: `#1a1a1a` (RGB: 26, 26, 26)

### Accent Colors
- **Primary Indigo**: `#6366f1` (Light indigo: `#818cf8`, Dark indigo: `#4f46e5`)
- **Success**: `#10b981` (Emerald)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)

### Text Colors
- **Primary Text**: `#f8fafc` (Snow white)
- **Secondary Text**: `#cbd5e1` (Soft gray-blue)
- **Tertiary Text**: `#94a3b8` (Cool gray)

## Typography Scale

| Size | Pixel Value | Usage |
|------|-------------|-------|
| Display | 40px | App title |
| Heading 1 | 32px | Page titles |
| Heading 2 | 24px | Section titles |
| Body Large | 18px | Primary text |
| Body Regular | 16px | Standard text |
| Body Small | 14px | Secondary text |
| Caption | 12px | Helper text |

## Spacing System
- **Base Unit**: 4px (spacing-1)
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

## Component Specifications

### Button Component
- **Primary**: Indigo background (`#6366f1`), white text
- **Secondary**: Transparent with indigo border/text
- **Size Variants**: Small (10px 16px), Medium (12px 24px), Large (16px 32px)
- **States**: Hover (darker shade), Focus (ring), Active (pressed), Disabled (opacity 50%)

### Card Component
- **Background**: Surface color (`#1a1a1a`)
- **Border Radius**: 12px
- **Shadow**: Subtle drop shadow
- **Padding**: 24px standard, 16px compact

### Form Elements
- **Input Fields**: Dark background (`#121212`), indigo border on focus
- **Label**: Body large text with subtle accent
- **Error State**: Red border and message

## Layout Structure

### Landing Page
- App title in header
- Hero section with value proposition
- Primary and secondary CTAs
- Minimal footer

### Authentication Pages
- Centered card layout
- Clear form fields with validation
- Accessible error messages

### Authenticated Dashboard
- Header with app name and user controls
- Main content area for tasks
- Structured task list with actions

## Interaction Design

### Hover States
- Buttons: 10% darker on hover
- Cards: Subtle lift effect
- Interactive elements: Pointer cursor with transition

### Loading States
- Input fields: Skeleton loading
- Buttons: Spinner with reduced opacity
- Sections: Dimmed overlay with spinner

### Empty States
- Centered message with icon
- Clear call-to-action
- Brief explanation

### Error Handling
- Inline validation messages
- Border highlighting
- Accessible error announcements

## Accessibility Features

### Color Contrast
- Text/background ratios meet WCAG AA standards (4.5:1 minimum)
- Interactive elements have sufficient contrast (3:1 minimum)

### Keyboard Navigation
- Logical tab order (header → main → footer)
- Visible focus indicators
- Skip-to-content link

### Screen Reader Support
- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels for icon-only buttons
- Live regions for dynamic content

## Responsive Behavior

### Mobile (320px - 768px)
- Single column layout
- Touch-friendly targets (44px minimum)
- Full-width cards

### Tablet (768px - 1024px)
- Moderate spacing adjustments
- Appropriate layout scaling

### Desktop (1024px+)
- Multi-column layouts
- Advanced interaction patterns

## Dark Mode Implementation

### Color Mapping
- Backgrounds: Black → Charcoal → Lighter surfaces
- Text: White → Light gray → Medium gray
- Accents: Maintain vibrancy with proper contrast

### Transition Effects
- Smooth color transitions (200ms ease-in-out)
- Preserve readability during transitions
- Avoid flashing or jarring changes