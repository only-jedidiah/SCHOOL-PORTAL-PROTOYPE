import React from 'react';
import { Plus } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/atoms/Badge/Badge';

export interface StaffDirectoryTableProps {
  onAddStaff: () => void;
}

export const StaffDirectoryTable: React.FC<StaffDirectoryTableProps> = ({
  onAddStaff,
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
                  <Badge variant="emerald" size="sm" dot>
                    {s.status}
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
