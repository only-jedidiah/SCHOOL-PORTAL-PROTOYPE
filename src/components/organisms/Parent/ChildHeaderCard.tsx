import React from 'react';
import { Users } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Select } from '@/components/atoms/Select/Select';

export const ChildHeaderCard: React.FC = () => {
  const { students, activeChildId, setActiveChildId } = useSchoolPortal();
  const currentChild = students[activeChildId] || Object.values(students)[0];
  const allStudentIds = Object.keys(students);

  if (!currentChild) return null;

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm flex flex-wrap justify-between items-center gap-4">
      <div>
        <Typography variant="label" className="text-brand-700">
          Active Child Report
        </Typography>
        <Typography variant="h2" className="mt-0.5">
          {currentChild.name}
        </Typography>
        <Typography variant="body-sm" className="mt-0.5">
          Grade: <span className="font-semibold text-text-primary">{currentChild.grade}</span>{' '}
          | Student ID: <span className="font-mono text-text-secondary">{currentChild.id}</span>
        </Typography>
      </div>

      <div className="flex items-center space-x-3 bg-surface-subtle p-2 rounded-xl border border-border-default">
        <Users size={16} className="text-text-muted shrink-0 ml-1" />
        <span className="text-xs font-semibold text-text-secondary">Switch Ward:</span>
        <div className="min-w-[180px]">
          <Select
            value={activeChildId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setActiveChildId(e.target.value)}
          >
            {allStudentIds.map(id => {
              const s = students[id];
              return (
                <option key={id} value={id}>
                  {s.name} ({s.grade})
                </option>
              );
            })}
          </Select>
        </div>
      </div>
    </div>
  );
};
