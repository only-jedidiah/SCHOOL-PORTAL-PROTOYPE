import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'emerald' | 'amber';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs px-4 py-2.5 gap-2',
    lg: 'text-sm px-6 py-3 gap-2.5 font-bold',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-brand-700 hover:bg-brand-800 text-white shadow-sm hover:shadow focus:ring-brand-700',
    secondary:
      'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 focus:ring-brand-500',
    outline:
      'bg-transparent hover:bg-surface-subtle text-text-primary border border-border-default hover:border-border-strong focus:ring-brand-700',
    ghost:
      'bg-transparent hover:bg-surface-subtle text-text-secondary hover:text-text-primary focus:ring-brand-500',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 focus:ring-rose-500',
    emerald:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow focus:ring-emerald-600',
    amber:
      'bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow focus:ring-amber-600',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
