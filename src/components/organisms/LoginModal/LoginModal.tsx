import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types/portal';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Modal } from '@/components/molecules/Modal/Modal';
import { FormField } from '@/components/molecules/FormField/FormField';
import { Input } from '@/components/atoms/Input/Input';
import { Select } from '@/components/atoms/Select/Select';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/atoms/Badge/Badge';
import {
  Lock,
  Mail,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  initialRole,
}) => {
  const { login, validateCredentials, updateUserPassword, classes, showToast } = useSchoolPortal();
  
  // Step state: 'login' | 'change-password'
  const [step, setStep] = useState<'login' | 'change-password'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('1234567890');
  const [teacherClass, setTeacherClass] = useState('Grade 3B');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // New password state for individual user setup
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStep('login');
    setErrorMessage(null);
    setNewPassword('');
    setConfirmPassword('');
    setPassword('1234567890');
    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    if (initialRole === 'admin') {
      setUsername('admin@gracefield.edu.ng');
    } else if (initialRole === 'teacher') {
      setUsername('teacher@gracefield.edu.ng');
      if (classes.length > 0) {
        setTeacherClass(classes[2]?.name || classes[0].name);
      }
    } else {
      setUsername('parent@gracefield.edu.ng');
    }
  }, [initialRole, classes, isOpen]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateCredentials(username, password, initialRole);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Invalid credentials. Please verify your password.');
      return;
    }

    if (validation.mustChangePassword) {
      // Direct user to set their own individual personal password
      setStep('change-password');
      return;
    }

    // Already has individual password configured
    setSubmitting(true);
    setTimeout(() => {
      login(initialRole, initialRole === 'teacher' ? teacherClass : undefined, username);
      setSubmitting(false);
      onClose();
    }, 300);
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword === '1234567890') {
      setErrorMessage('You cannot reuse the generic default password. Please choose a custom personal password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('The passwords do not match. Please re-enter.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      // Save individual password for this user
      updateUserPassword(username, newPassword, initialRole);
      showToast('success', 'Personal Password Created', `Your individual password for ${username} is now active.`);
      login(initialRole, initialRole === 'teacher' ? teacherClass : undefined, username);
      setSubmitting(false);
      onClose();
    }, 400);
  };

  const roleTitleMap: Record<UserRole, string> = {
    admin: 'Administrator Portal',
    teacher: 'Staff & Teacher Portal',
    parent: 'Parent Gateway',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'login' ? "Sign in to your Account" : "Security: Set Your Individual Password"}
      subtitle={
        step === 'login'
          ? "Enter your verified credentials to access your portal space."
          : "Create a private, personal password for your individual user account."
      }
      maxWidth="md"
    >
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <Badge variant="brand" size="sm">
            {roleTitleMap[initialRole]}
          </Badge>
          {step === 'change-password' && (
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 inline-flex items-center gap-1">
              <KeyRound size={12} /> First-time Password Setup
            </span>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-fadeIn">
            <AlertTriangle size={16} className="shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {step === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="bg-brand-50/60 p-3 rounded-xl border border-brand-100/80 text-xs text-brand-900 flex items-start gap-2">
              <KeyRound size={15} className="text-brand-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Default Initial Password</p>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  The initial generic password for all accounts is <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-brand-800 border border-brand-200">1234567890</code>. You will be prompted to create your individual password upon logging in.
                </p>
              </div>
            </div>

            <FormField label="Username / Email" required>
              <Input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                leftIcon={<Mail size={16} />}
                placeholder="e.g. user@gracefield.edu.ng"
              />
            </FormField>

            <FormField label="Password" required hint="Default generic password: 1234567890">
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="text-text-muted hover:text-brand-700 focus:outline-none p-1 rounded transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                placeholder="••••••••"
              />
            </FormField>

            {initialRole === 'teacher' && (
              <FormField
                label="Allocated Teaching Class"
                required
                hint="Select active classroom"
              >
                <Select
                  value={teacherClass}
                  onChange={e => setTeacherClass(e.target.value)}
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.levelRange})
                    </option>
                  ))}
                </Select>
              </FormField>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={submitting}
            >
              Access Portal
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertTriangle size={16} className="text-amber-700" />
                <span>Password Change Required</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900/90">
                Account <strong className="font-semibold">{username}</strong> is currently using the default system password (<code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200 font-bold">1234567890</code>).
                Please create your own private personal password to secure your account.
              </p>
            </div>

            <FormField label="New Personal Password" required hint="Minimum 6 characters (cannot be 1234567890)">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(prev => !prev)}
                    className="text-text-muted hover:text-brand-700 focus:outline-none p-1 rounded transition"
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                placeholder="Enter new private password"
                autoFocus
              />
            </FormField>

            <FormField label="Confirm New Password" required hint="Re-enter your new password">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                leftIcon={<CheckCircle2 size={16} />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="text-text-muted hover:text-brand-700 focus:outline-none p-1 rounded transition"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                placeholder="Confirm new private password"
              />
            </FormField>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={submitting}
              >
                Save New Password & Enter Portal
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setStep('login');
                  setErrorMessage(null);
                }}
                leftIcon={<ArrowLeft size={14} />}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

