import React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/atoms/Badge/Badge';

export interface CurriculumSectionProps {
  onAddSubject: () => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({
  onAddSubject,
}) => {
  const { subjects, activeTeacherClass, updateCurriculum } = useSchoolPortal();
  const filteredSubjects = subjects.filter(s => s.classAssigned === activeTeacherClass);

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border-subtle pb-4">
        <div>
          <Typography variant="h3">Subjects & Scheme of Work</Typography>
          <Typography variant="body-sm" className="mt-0.5">
            Manage subjects and input weekly schemes of work for{' '}
            <span className="font-bold text-brand-700">{activeTeacherClass}</span>.
          </Typography>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onAddSubject}
          leftIcon={<Plus size={16} />}
        >
          Add Subject
        </Button>
      </div>

      {filteredSubjects.length === 0 ? (
        <div className="p-8 text-center bg-surface-subtle/60 rounded-xl border border-border-subtle space-y-2">
          <BookOpen className="mx-auto text-text-muted" size={32} />
          <Typography variant="h4" className="text-text-muted">
            No subjects registered yet for {activeTeacherClass}
          </Typography>
          <Typography variant="body-sm">
            Click 'Add Subject' above to start creating course syllabi.
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubjects.map(sub => (
            <div
              key={sub.id}
              className="border border-border-default rounded-xl p-5 bg-surface-subtle/30 space-y-3 hover:border-brand-200 transition-colors shadow-sm"
            >
              <div className="flex justify-between items-start">
                <Badge variant="brand" size="sm">
                  {sub.classAssigned}
                </Badge>
                <span className="text-xs font-mono text-text-muted">Code: {sub.id}</span>
              </div>
              <Typography variant="h3" className="text-text-primary">
                {sub.name}
              </Typography>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
                  Scheme of Work Breakdown:
                </label>
                <textarea
                  rows={4}
                  defaultValue={sub.curriculum}
                  onBlur={e => updateCurriculum(sub.id, e.target.value)}
                  className="w-full text-xs font-mono bg-surface-card border border-border-default rounded-lg p-3 text-text-primary outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition"
                  placeholder="Enter weekly curriculum breakdown..."
                />
                <span className="text-[10px] text-text-muted block text-right">
                  Changes save automatically on blur
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
