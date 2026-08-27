import React from 'react';
import { Plus } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/atoms/Badge/Badge';

export interface ActivitiesScheduleTableProps {
  onAddActivity: () => void;
}

export const ActivitiesScheduleTable: React.FC<ActivitiesScheduleTableProps> = ({
  onAddActivity,
}) => {
  const { activities } = useSchoolPortal();

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border-subtle pb-4">
        <div>
          <Typography variant="h3">Extracurricular Activities & Excursions</Typography>
          <Typography variant="body-sm" className="mt-0.5">
            Schedule field trips, inter-house sports, and school activities.
          </Typography>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onAddActivity}
          leftIcon={<Plus size={16} />}
        >
          Schedule Event
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th className="py-3 px-2">
                <Typography variant="label">Event Description</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Target Classes</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Scheduled Date</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Status</Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {activities.map(act => (
              <tr key={act.id} className="hover:bg-surface-subtle/50 transition-colors">
                <td className="py-3.5 px-2 font-semibold text-text-primary">
                  {act.name}
                  <span className="block text-[11px] font-mono text-text-muted font-normal">
                    {act.id}
                  </span>
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="body-sm">{act.classes}</Typography>
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="mono">{act.date}</Typography>
                </td>
                <td className="py-3.5 px-2">
                  <Badge
                    variant={act.status === 'Scheduled' ? 'amber' : 'purple'}
                    size="sm"
                    dot
                  >
                    {act.status}
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
