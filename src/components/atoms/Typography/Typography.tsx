import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type TypographyVariant =
  | 'hero-title'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body-lg'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'label'
  | 'mono'
  | 'stat-value';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<TypographyVariant, string> = {
  'hero-title': 'font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary',
  'h1': 'font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary',
  'h2': 'font-display text-xl sm:text-2xl font-bold tracking-tight text-text-primary',
  'h3': 'font-display text-lg sm:text-xl font-bold text-text-primary',
  'h4': 'font-display text-base font-semibold text-text-primary',
  'body-lg': 'font-sans text-base text-text-secondary leading-relaxed',
  'body': 'font-sans text-sm text-text-secondary leading-normal',
  'body-sm': 'font-sans text-xs text-text-secondary',
  'caption': 'font-sans text-[11px] text-text-muted font-medium',
  'label': 'font-sans text-xs font-bold text-text-secondary uppercase tracking-wider',
  'mono': 'font-mono text-xs text-text-primary',
  'stat-value': 'font-display text-2xl sm:text-3xl font-bold tracking-tight',
};

const defaultTagForVariant: Record<TypographyVariant, React.ElementType> = {
  'hero-title': 'h1',
  'h1': 'h1',
  'h2': 'h2',
  'h3': 'h3',
  'h4': 'h4',
  'body-lg': 'p',
  'body': 'p',
  'body-sm': 'p',
  'caption': 'span',
  'label': 'span',
  'mono': 'span',
  'stat-value': 'p',
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  as,
  children,
  className,
  ...props
}) => {
  const Component = as || defaultTagForVariant[variant] || 'p';
  const styles = twMerge(clsx(variantStyles[variant], className));

  return (
    <Component className={styles} {...props}>
      {children}
    </Component>
  );
};
