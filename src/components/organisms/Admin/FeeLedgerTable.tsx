import React from 'react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Badge } from '@/components/atoms/Badge/Badge';
import { ProgressBar } from '@/components/atoms/ProgressBar/ProgressBar';

export const FeeLedgerTable: React.FC = () => {
  const { students, calculateFeeMetrics } = useSchoolPortal();
  const studentIds = Object.keys(students);

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-4">
      <div className="border-b border-border-subtle pb-3">
        <Typography variant="h3">Dynamic Fee Ledger & Completion Status</Typography>
        <Typography variant="body-sm" className="mt-0.5">
          Real-time summary of fees, payments made, dynamic overrides, and completion percentages.
        </Typography>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th className="py-3 px-2">
                <Typography variant="label">Student Name</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Default Fee</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Total Paid</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Current Outstanding</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Effective Total</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Completeness</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Status</Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {studentIds.map(id => {
              const s = students[id];
              const m = calculateFeeMetrics(s);

              let statusVariant: 'emerald' | 'amber' | 'rose' = 'rose';
              let statusText = 'Unpaid';

              if (m.outstanding === 0) {
                statusVariant = 'emerald';
                statusText = 'Completed (100%)';
              } else if (m.paid > 0) {
                statusVariant = 'amber';
                statusText = 'In Progress';
              }

              return (
                <tr key={id} className="hover:bg-surface-subtle/50 transition-colors">
                  <td className="py-3.5 px-2 font-semibold text-text-primary">
                    {s.name}
                    <span className="block text-[11px] text-text-muted font-normal">
                      {s.grade} • {s.id}
                    </span>
                  </td>
                  <td className="py-3.5 px-2">
                    <Typography variant="mono">₦{s.defaultTuition.toLocaleString()}</Typography>
                  </td>
                  <td className="py-3.5 px-2">
                    <Typography variant="mono" className="text-accent-emerald font-semibold">
                      ₦{m.paid.toLocaleString()}
                    </Typography>
                  </td>
                  <td className="py-3.5 px-2">
                    <Typography variant="mono" className="text-accent-rose font-bold">
                      ₦{m.outstanding.toLocaleString()}
                    </Typography>
                  </td>
                  <td className="py-3.5 px-2">
                    <Typography variant="mono" className="text-brand-700 font-semibold">
                      ₦{m.effectiveTotal.toLocaleString()}
                    </Typography>
                  </td>
                  <td className="py-3.5 px-2 min-w-[120px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="font-bold">{m.completionPct}%</span>
                      </div>
                      <ProgressBar
                        value={m.completionPct}
                        colorVariant={m.completionPct === 100 ? 'emerald' : 'brand'}
                        height="0.4rem"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="space-y-1">
                      <Badge variant={statusVariant} size="sm">
                        {statusText}
                      </Badge>
                      {s.overrideReason && (
                        <span
                          className="block text-[10px] text-text-muted italic truncate max-w-[140px]"
                          title={s.overrideReason}
                        >
                          Override: {s.overrideReason}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
