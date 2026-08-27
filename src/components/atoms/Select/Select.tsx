import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  hasError?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, hasError, className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={twMerge(
            clsx(
              'w-full bg-surface-base border rounded-xl px-3.5 py-2.5 text-xs text-text-primary outline-none transition-all appearance-none cursor-pointer',
              'focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 focus:bg-surface-card',
              hasError
                ? 'border-accent-rose focus:ring-accent-rose/20 focus:border-accent-rose'
                : 'border-border-default',
              className
            )
          )}
          {...props}
        >
          {options
            ? options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-text-muted">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
