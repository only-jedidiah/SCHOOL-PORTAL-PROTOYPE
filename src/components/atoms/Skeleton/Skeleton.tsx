import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rounded',
  width,
  height,
  className,
  style,
  ...props
}) => {
  const variantClasses = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-xl',
  };

  const inlineStyles: React.CSSProperties = {
    width: width,
    height: height,
    ...style,
  };

  return (
    <div
      className={twMerge(
        clsx('skeleton-shimmer shrink-0', variantClasses[variant], className)
      )}
      style={inlineStyles}
      {...props}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => {
  return (
    <div className={twMerge(clsx('space-y-2.5 w-full', className))}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          className={clsx(
            'w-full',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
};

export const SkeletonMetric: React.FC = () => {
  return (
    <div className="bg-surface-card p-5 rounded-2xl border border-border-default shadow-sm flex items-center justify-between">
      <div className="space-y-2 flex-1 pr-4">
        <Skeleton height={12} width="40%" />
        <Skeleton height={28} width="60%" />
      </div>
      <Skeleton variant="rounded" width={48} height={48} className="rounded-xl" />
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 4,
  cols = 4,
}) => {
  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
        <Skeleton height={20} width={180} />
        <Skeleton height={32} width={120} />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 items-center py-2">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton
                key={c}
                height={16}
                className={clsx(
                  'flex-1',
                  c === 0 ? 'w-1/3' : 'w-full'
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={twMerge(
        clsx('bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-4', className)
      )}
    >
      <div className="flex justify-between items-center">
        <Skeleton height={18} width="35%" />
        <Skeleton height={18} width={60} />
      </div>
      <Skeleton height={12} width="80%" />
      <Skeleton height={60} className="rounded-xl" />
    </div>
  );
};
