import React from 'react';
import { GraduationCap, LogOut } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Badge } from '@/components/atoms/Badge/Badge';
import { Button } from '@/components/atoms/Button/Button';

export const Header: React.FC = () => {
  const { currentRole, activeTeacherClass, logout } = useSchoolPortal();

  return (
    <header className="bg-surface-card border-b border-border-default sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={currentRole ? logout : undefined}
          title={currentRole ? "Click to return to home" : undefined}
        >
          <div className="bg-brand-700 text-white p-2.5 rounded-xl shadow-sm group-hover:scale-105 transition-transform">
            <GraduationCap size={24} />
          </div>
          <div>
            <Typography variant="h3" className="leading-none text-text-primary group-hover:text-brand-700 transition-colors">
              Gracefield Montessori School
            </Typography>
            <Typography variant="caption" className="mt-1 block">
              12 Gracefield Avenue, Lekki, Lagos, Nigeria
            </Typography>
          </div>
        </div>

        {currentRole && (
          <div className="flex items-center gap-3">
            <Badge variant="brand" size="md">
              Role: {currentRole === 'teacher' ? `Teacher (${activeTeacherClass})` : currentRole.toUpperCase()}
            </Badge>
            <Button
              variant="danger"
              size="sm"
              onClick={logout}
              leftIcon={<LogOut size={14} />}
            >
              Log Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
