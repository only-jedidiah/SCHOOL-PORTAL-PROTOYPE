import React from 'react';
import { GraduationCap, LogOut, Database, Wifi } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Badge } from '@/components/atoms/Badge/Badge';
import { Button } from '@/components/atoms/Button/Button';

export const Header: React.FC = () => {
  const { currentRole, activeTeacherClass, logout, isSupabaseConnected } = useSchoolPortal();

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
            <div className="flex items-center gap-2">
              <Typography variant="h3" className="leading-none text-text-primary group-hover:text-brand-700 transition-colors">
                Gracefield Montessori School
              </Typography>
            </div>
            <Typography variant="caption" className="mt-1 block">
              HOUSE 8, 12 CRESENT KADO ESTATE, PHASE 1, ABUJA.
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Supabase Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5">
            {isSupabaseConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200" title="Connected to Supabase Cloud Database">
                <Database size={12} className="text-accent-emerald" />
                <span>Supabase Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-subtle text-text-secondary border border-border-default" title="Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to connect live cloud DB">
                <Wifi size={12} className="text-text-muted" />
                <span>Local State Mode</span>
              </span>
            )}
          </div>

          {currentRole && (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
};
