import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpenCheck, Home, ArrowRight, Sparkles } from 'lucide-react';
import { UserRole } from '@/types/portal';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Badge } from '@/components/atoms/Badge/Badge';
import { LoginModal } from '@/components/organisms/LoginModal/LoginModal';

export const LandingView: React.FC = () => {
  const [modalRole, setModalRole] = useState<UserRole | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <section className="space-y-8 py-8 text-center max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        <Badge variant="brand" size="md" className="uppercase tracking-wider font-bold">
          <Sparkles size={12} className="inline mr-1 text-brand-700" /> Official School Gateway
        </Badge>
        <Typography variant="hero-title" className="text-text-primary">
          Welcome to Gracefield Montessori School
        </Typography>
        <Typography variant="body-lg" className="max-w-2xl mx-auto">
          Select your portal role below to sign into your administrative workspace, academic gradebooks, or parent financial account.
        </Typography>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left"
      >
        {/* Administrator Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.02 }}
          onClick={() => setModalRole('admin')}
          className="bg-surface-card p-8 rounded-2xl border border-border-default shadow-sm hover:shadow-xl hover:border-brand-600 transition-all cursor-pointer group text-center space-y-4"
        >
          <div className="w-16 h-16 bg-brand-50 text-brand-700 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-brand-700 group-hover:text-white transition-colors duration-300 shadow-sm">
            <Shield size={28} />
          </div>
          <div>
            <Typography variant="h3" className="group-hover:text-brand-700 transition-colors">
              Administrator
            </Typography>
            <Typography variant="caption" className="mt-1 block text-text-secondary">
              Manage staff, classes, dynamic fee overrides, inventory & excursions
            </Typography>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-700 group-hover:translate-x-1 transition-transform">
            <span>Login to Portal</span>
            <ArrowRight size={14} />
          </div>
        </motion.div>

        {/* Staff / Teacher Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.02 }}
          onClick={() => setModalRole('teacher')}
          className="bg-surface-card p-8 rounded-2xl border border-border-default shadow-sm hover:shadow-xl hover:border-accent-purple transition-all cursor-pointer group text-center space-y-4"
        >
          <div className="w-16 h-16 bg-accent-purple-subtle text-accent-purple rounded-2xl flex items-center justify-center mx-auto group-hover:bg-accent-purple group-hover:text-white transition-colors duration-300 shadow-sm">
            <BookOpenCheck size={28} />
          </div>
          <div>
            <Typography variant="h3" className="group-hover:text-accent-purple transition-colors">
              Staff / Teacher
            </Typography>
            <Typography variant="caption" className="mt-1 block text-text-secondary">
              Gradebooks, subjects, scheme of work & student registration
            </Typography>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-accent-purple group-hover:translate-x-1 transition-transform">
            <span>Login to Portal</span>
            <ArrowRight size={14} />
          </div>
        </motion.div>

        {/* Parent Portal Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.02 }}
          onClick={() => setModalRole('parent')}
          className="bg-surface-card p-8 rounded-2xl border border-border-default shadow-sm hover:shadow-xl hover:border-accent-emerald transition-all cursor-pointer group text-center space-y-4"
        >
          <div className="w-16 h-16 bg-accent-emerald-subtle text-accent-emerald rounded-2xl flex items-center justify-center mx-auto group-hover:bg-accent-emerald group-hover:text-white transition-colors duration-300 shadow-sm">
            <Home size={28} />
          </div>
          <div>
            <Typography variant="h3" className="group-hover:text-accent-emerald transition-colors">
              Parent Portal
            </Typography>
            <Typography variant="caption" className="mt-1 block text-text-secondary">
              View results, pay fees in installments & track completion %
            </Typography>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-accent-emerald group-hover:translate-x-1 transition-transform">
            <span>Login to Portal</span>
            <ArrowRight size={14} />
          </div>
        </motion.div>
      </motion.div>

      {modalRole && (
        <LoginModal
          isOpen={Boolean(modalRole)}
          onClose={() => setModalRole(null)}
          initialRole={modalRole}
        />
      )}
    </section>
  );
};
