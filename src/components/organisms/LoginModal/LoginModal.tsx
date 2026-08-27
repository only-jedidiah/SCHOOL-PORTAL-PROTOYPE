import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types/portal';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Modal } from '@/components/molecules/Modal/Modal';
import { FormField } from '@/components/molecules/FormField/FormField';
import { Input } from '@/components/atoms/Input/Input';
import { Select } from '@/components/atoms/Select/Select';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/atoms/Badge/Badge';
import { Lock, Mail } from 'lucide-react';

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
  const { login, classes } = useSchoolPortal();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123');
  const [teacherClass, setTeacherClass] = useState('Grade 3B');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
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
  }, [initialRole, classes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      login(initialRole, initialRole === 'teacher' ? teacherClass : undefined);
      setSubmitting(false);
      onClose();
    }, 250);
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
      title="Sign in to your Account"
      subtitle="Enter your verified credentials to access your portal space."
      maxWidth="md"
    >
      <div className="space-y-4 pt-1">
        <div>
          <Badge variant="brand" size="sm">
            {roleTitleMap[initialRole]}
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <FormField label="Password" required>
            <Input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
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
      </div>
    </Modal>
  );
};
