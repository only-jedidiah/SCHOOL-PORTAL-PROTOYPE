import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useSchoolPortal();

  const iconMap = {
    success: <CheckCircle2 className="text-accent-emerald shrink-0" size={18} />,
    error: <AlertCircle className="text-accent-rose shrink-0" size={18} />,
    info: <Info className="text-brand-700 shrink-0" size={18} />,
    warning: <AlertTriangle className="text-accent-amber shrink-0" size={18} />,
  };

  const borderMap = {
    success: 'border-emerald-200 bg-emerald-50/90',
    error: 'border-rose-200 bg-rose-50/90',
    info: 'border-brand-200 bg-brand-50/90',
    warning: 'border-amber-200 bg-amber-50/90',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md ${borderMap[toast.type]}`}
          >
            <div className="mt-0.5">{iconMap[toast.type]}</div>
            <div className="flex-1 space-y-0.5">
              <Typography variant="body-sm" className="font-bold text-text-primary">
                {toast.title}
              </Typography>
              {toast.message && (
                <Typography variant="caption" className="text-text-secondary">
                  {toast.message}
                </Typography>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-text-muted hover:text-text-primary p-1 rounded-md transition"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
