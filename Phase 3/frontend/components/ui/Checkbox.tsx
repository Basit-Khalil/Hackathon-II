// Checkbox component following the design system specifications
'use client';

import React from 'react';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      onChange,
      label,
      error,
      helperText,
      required = false,
      disabled = false,
      className = '',
    },
    ref
  ) => {
    const baseClasses = 'h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500';

    const disabledClasses = disabled
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
      : '';

    const classes = `${baseClasses} ${disabledClasses} ${className}`;

    return (
      <div>
        <div className="flex items-center">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            disabled={disabled}
            required={required}
            className={classes}
          />
          {label && (
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
        </div>
        {helperText && !error && (
          <p className="mt-1 ml-6 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 ml-6 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;