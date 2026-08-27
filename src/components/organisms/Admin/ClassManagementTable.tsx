import React from 'react';
import { Plus } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { Select } from '@/components/atoms/Select/Select';
import { Badge } from '@/components/atoms/Badge/Badge';

export interface ClassManagementTableProps {
  onAddClass: () => void;
}

export const ClassManagementTable: React.FC<ClassManagementTableProps> = ({
  onAddClass,
}) => {
  const { classes, staff, reallocateTeacher } = useSchoolPortal();

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border-subtle pb-4">
        <div>
          <Typography variant="h3">Class Management & Teacher Allocation</Typography>
          <Typography variant="body-sm" className="mt-0.5">
            Add classes across Kindergarten through Grade 6 and allocate lead teachers.
          </Typography>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onAddClass}
          leftIcon={<Plus size={16} />}
        >
          Add New Class
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th className="py-3 px-2">
                <Typography variant="label">Class Name</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Level Range</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Allocated Lead Teacher</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Status</Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {classes.map(cls => (
              <tr key={cls.id} className="hover:bg-surface-subtle/50 transition-colors">
                <td className="py-3.5 px-2 font-semibold text-text-primary">
                  {cls.name}
                  <span className="block text-[11px] font-mono text-text-muted font-normal">
                    {cls.id}
                  </span>
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="body-sm">{cls.levelRange}</Typography>
                </td>
                <td className="py-3.5 px-2">
                  <div className="max-w-xs">
                    <Select
                      value={cls.teacher}
                      onChange={e => reallocateTeacher(cls.id, e.target.value)}
                    >
                      <option value="Unassigned">Unassigned</option>
                      {staff.map(s => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.role})
                        </option>
                      ))}
                    </Select>
                  </div>
                </td>
                <td className="py-3.5 px-2">
                  <Badge variant="emerald" size="sm" dot>
                    Active
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
