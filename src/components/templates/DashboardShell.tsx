import React from 'react';
import { motion } from 'framer-motion';
import { useSchoolPortal } from '../../context/SchoolPortalContext';
import { SkeletonMetric, SkeletonTable } from '../atoms/Skeleton/Skeleton';

export interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const { isLoading } = useSchoolPortal();

  if (isLoading) {
    return (
      <div className="space-y-6 w-full py-4 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <SkeletonMetric />
          <SkeletonMetric />
          <SkeletonMetric />
          <SkeletonMetric />
        </div>
        <SkeletonTable rows={5} cols={4} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="space-y-6 w-full"
    >
      {children}
    </motion.div>
  );
};
