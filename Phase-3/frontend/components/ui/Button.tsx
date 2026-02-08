// Button component following the design system specifications
'use client';

import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline'| 'light';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      icon,
      iconPosition = 'left',
      className = '',
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    // Define base styles
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150';

    // Define size classes
    const sizeClasses = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    };

    // Define variant classes
    const variantClasses = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
      secondary: 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
      outline:'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      light:'bg-white text-indigo-600 border border-gray-200 hover:bg-gray-100 focus:ring-indigo-500 dark:bg-gray-800 dark:text-indigo-400 dark:border-gray-700',

    };

    // Disabled state
    const disabledClasses = disabled
      ? 'opacity-50 cursor-not-allowed'
      : '';

    // Loading state
    const loadingClasses = loading
      ? 'opacity-70 cursor-not-allowed'
      : '';

    const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${loadingClasses} ${className}`;

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {loading ? 'Loading...' : children}
        {icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;