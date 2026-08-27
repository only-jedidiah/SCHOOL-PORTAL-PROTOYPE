import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { Typography } from '../../atoms/Typography/Typography';

export interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  theme?: 'brand' | 'purple' | 'emerald' | 'amber' | 'rose';
  subtext?: string;
  className?: string;
}

const themeStyles = {
  brand: {
    iconBg: 'bg-brand-50 text-brand-700 border border-brand-100',
    valueColor: 'text-text-primary',
  },
  purple: {
    iconBg: 'bg-accent-purple-subtle text-accent-purple border border-purple-100',
    valueColor: 'text-text-primary',
  },
  emerald: {
    iconBg: 'bg-accent-emerald-subtle text-accent-emerald border border-emerald-100',
    valueColor: 'text-accent-emerald',
  },
  amber: {
    iconBg: 'bg-accent-amber-subtle text-accent-amber border border-amber-100',
    valueColor: 'text-accent-amber',
  },
  rose: {
    iconBg: 'bg-accent-rose-subtle text-accent-rose border border-rose-100',
    valueColor: 'text-accent-rose',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  theme = 'brand',
  subtext,
  className,
}) => {
  const currentTheme = themeStyles[theme];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={twMerge(
        clsx(
          'bg-surface-card p-5 rounded-2xl border border-border-default shadow-sm hover:shadow-md transition-shadow flex items-center justify-between',
          className
        )
      )}
    >
      <div className="space-y-1">
        <Typography variant="caption" className="uppercase tracking-wider font-bold text-text-muted">
          {label}
        </Typography>
        <Typography variant="stat-value" className={currentTheme.valueColor}>
          {value}
        </Typography>
        {subtext && <Typography variant="caption">{subtext}</Typography>}
      </div>
      <div className={clsx('p-3.5 rounded-xl text-xl flex items-center justify-center shrink-0', currentTheme.iconBg)}>
        {icon}
      </div>
    </motion.div>
  );
};
