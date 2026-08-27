import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSchoolPortal } from './context/SchoolPortalContext';
import { PortalLayout } from './components/templates/PortalLayout';
import { LandingView } from './components/views/LandingView/LandingView';
import { AdminDashboardView } from './components/views/AdminDashboardView/AdminDashboardView';
import { TeacherDashboardView } from './components/views/TeacherDashboardView/TeacherDashboardView';
import { ParentDashboardView } from './components/views/ParentDashboardView/ParentDashboardView';

export const App: React.FC = () => {
  const { currentRole } = useSchoolPortal();

  return (
    <PortalLayout>
      <AnimatePresence mode="wait">
        {!currentRole && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <LandingView />
          </motion.div>
        )}

        {currentRole === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <AdminDashboardView />
          </motion.div>
        )}

        {currentRole === 'teacher' && (
          <motion.div
            key="teacher"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <TeacherDashboardView />
          </motion.div>
        )}

        {currentRole === 'parent' && (
          <motion.div
            key="parent"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <ParentDashboardView />
          </motion.div>
        )}
      </AnimatePresence>
    </PortalLayout>
  );
};

export default App;
