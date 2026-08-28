import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/atoms/Badge/Badge';
import { ActivityEvent } from '@/types/portal';

export interface ActivitiesScheduleTableProps {
  onAddActivity: () => void;
  onEditActivity: (act: ActivityEvent) => void;
  onDeleteActivity: (act: ActivityEvent) => void;
}

export const ActivitiesScheduleTable: React.FC<ActivitiesScheduleTableProps> = ({
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
}) => {
  const { activities } = useSchoolPortal();

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border-subtle pb-4">
        <div>
          <Typography variant="h3">Extracurricular Activities & Excursions</Typography>
          <Typography variant="body-sm" className="mt-0.5">
            Schedule, modify, and manage field trips, inter-house sports, and school activities.
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
              <th className="py-3 px-2 text-right">
                <Typography variant="label">Actions</Typography>
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
                    variant={
                      act.status === 'Completed'
                        ? 'emerald'
                        : act.status === 'Scheduled'
                        ? 'amber'
                        : 'purple'
                    }
                    size="sm"
                    dot
                  >
                    {act.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-2 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEditActivity(act)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-brand-700 hover:bg-brand-50 transition"
                      title="Edit Event"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => onDeleteActivity(act)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Event"
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

