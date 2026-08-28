import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/atoms/Badge/Badge';
import { StaffMember } from '@/types/portal';

export interface StaffDirectoryTableProps {
  onAddStaff: () => void;
  onEditStaff: (member: StaffMember) => void;
  onDeleteStaff: (member: StaffMember) => void;
}

export const StaffDirectoryTable: React.FC<StaffDirectoryTableProps> = ({
  onAddStaff,
  onEditStaff,
  onDeleteStaff,
}) => {
  const { staff } = useSchoolPortal();

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border-subtle pb-4">
        <div>
          <Typography variant="h3">Academic & Non-Academic Staff Directory</Typography>
          <Typography variant="body-sm" className="mt-0.5">
            Manage teaching roles, contact records, and credentials.
          </Typography>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onAddStaff}
          leftIcon={<Plus size={16} />}
        >
          Add New Staff
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th className="py-3 px-2">
                <Typography variant="label">Staff Name</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Designated Role</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Phone Contact</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Status</Typography>
              </th>
              <th className="py-3 px-2 text-right">
                <Typography variant="label">Actions</Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {staff.map(s => (
              <tr key={s.id} className="hover:bg-surface-subtle/50 transition-colors">
                <td className="py-3.5 px-2 font-semibold text-text-primary">
                  {s.name}
                  <span className="block text-[11px] font-mono text-text-muted font-normal">
                    {s.id}
                  </span>
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="body-sm">{s.role}</Typography>
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="mono">{s.phone}</Typography>
                </td>
                <td className="py-3.5 px-2">
                  <Badge variant={s.status === 'Active' ? 'emerald' : 'amber'} size="sm" dot>
                    {s.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-2 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEditStaff(s)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-brand-700 hover:bg-brand-50 transition"
                      title="Edit Staff Member"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => onDeleteStaff(s)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Staff Member"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

