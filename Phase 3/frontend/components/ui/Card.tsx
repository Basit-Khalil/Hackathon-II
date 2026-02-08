// Card component following the design system specifications
'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  elevation?: 0 | 1 | 2 | 3 | 4;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  bordered?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Card = ({ children, elevation = 1, rounded = 'lg', bordered = false, padding = 'md', className = '' }: CardProps) => {
  // Define elevation classes
  const elevationClasses = {
    0: 'shadow-none',
    1: 'shadow-sm',
    2: 'shadow',
    3: 'shadow-md',
    4: 'shadow-lg',
  };

  // Define rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };

  // Define padding classes
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  // Define border class
  const borderClass = bordered ? 'border border-gray-200' : '';

  const classes = `bg-white ${elevationClasses[elevation]} ${roundedClasses[rounded]} ${paddingClasses[padding]} ${borderClass} ${className}`;

  return <div className={classes}>{children}</div>;
};

export default Card;