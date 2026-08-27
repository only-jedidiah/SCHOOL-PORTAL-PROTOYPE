import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
  value: number; // 0 - 100
  colorVariant?: 'brand' | 'emerald' | 'amber' | 'rose' | 'purple';
  height?: number | string;
  className?: string;
}

const colorMap = {
  brand: 'bg-brand-700',
  emerald: 'bg-accent-emerald',
  amber: 'bg-accent-amber',
  rose: 'bg-accent-rose',
  purple: 'bg-accent-purple',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  colorVariant = 'brand',
  height = '0.75rem',
  className,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={twMerge(
        clsx('w-full bg-surface-muted rounded-full overflow-hidden', className)
      )}
      style={{ height }}
    >
      <motion.div
        className={clsx('h-full rounded-full transition-colors', colorMap[colorVariant])}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
};
