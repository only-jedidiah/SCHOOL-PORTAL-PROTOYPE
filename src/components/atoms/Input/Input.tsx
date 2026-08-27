import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isMono?: boolean;
  hasError?: boolean;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ isMono, hasError, leftIcon, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={twMerge(
            clsx(
              'w-full bg-surface-base border rounded-xl py-2.5 text-xs text-text-primary outline-none transition-all',
              'focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 focus:bg-surface-card',
              leftIcon ? 'pl-10 pr-3.5' : 'px-3.5',
              isMono && 'font-mono',
              hasError
                ? 'border-accent-rose focus:ring-accent-rose/20 focus:border-accent-rose'
                : 'border-border-default',
              className
            )
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
