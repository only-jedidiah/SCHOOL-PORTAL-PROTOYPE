import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant = 'brand' | 'purple' | 'emerald' | 'amber' | 'rose' | 'neutral' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  purple: 'bg-accent-purple-subtle text-accent-purple border-purple-200',
  emerald: 'bg-accent-emerald-subtle text-accent-emerald border-emerald-200',
  amber: 'bg-accent-amber-subtle text-accent-amber border-amber-200',
  rose: 'bg-accent-rose-subtle text-accent-rose border-rose-200',
  neutral: 'bg-surface-subtle text-text-secondary border-border-default',
  outline: 'bg-transparent text-text-secondary border-border-strong',
};

const dotColors: Record<BadgeVariant, string> = {
  brand: 'bg-brand-700',
  purple: 'bg-accent-purple',
  emerald: 'bg-accent-emerald',
  amber: 'bg-accent-amber',
  rose: 'bg-accent-rose',
  neutral: 'bg-text-secondary',
  outline: 'bg-text-secondary',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'brand',
  size = 'md',
  dot = false,
  children,
  className,
  ...props
}) => {
  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full border transition-colors',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
