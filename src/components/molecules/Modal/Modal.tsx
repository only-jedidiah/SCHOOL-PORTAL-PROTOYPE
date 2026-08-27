import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Typography } from '../../atoms/Typography/Typography';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full ${maxWidthMap[maxWidth]} bg-surface-card rounded-2xl shadow-xl border border-border-default p-6 space-y-4 z-10`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-subtle transition"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {(title || subtitle) && (
              <div className="space-y-1 pr-6">
                {title && <Typography variant="h3">{title}</Typography>}
                {subtitle && <Typography variant="body-sm">{subtitle}</Typography>}
              </div>
            )}

            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
