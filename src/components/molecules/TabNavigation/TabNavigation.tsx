import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-surface-card rounded-2xl border border-border-default shadow-sm p-1.5 flex flex-wrap gap-1.5 text-xs font-semibold',
          className
        )
      )}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'relative flex-1 min-w-[140px] py-2.5 px-4 rounded-xl transition-colors duration-200 text-center flex items-center justify-center gap-2 cursor-pointer z-10',
              isActive ? 'text-brand-700 font-bold' : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-brand-50 border border-brand-200/80 rounded-xl -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            {tab.icon && <span className="text-base shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  'text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold',
                  isActive ? 'bg-brand-200/80 text-brand-900' : 'bg-surface-muted text-text-secondary'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
