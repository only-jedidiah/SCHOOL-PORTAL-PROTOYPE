import React from 'react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Badge } from '@/components/atoms/Badge/Badge';
import { ProgressBar } from '@/components/atoms/ProgressBar/ProgressBar';
import { AlertCircle } from 'lucide-react';

export const ParentFeeStatusCard: React.FC = () => {
  const { students, activeChildId, calculateFeeMetrics } = useSchoolPortal();
  const child = students[activeChildId] || Object.values(students)[0];

  if (!child) return null;

  const m = calculateFeeMetrics(child);

  let badgeVariant: 'emerald' | 'amber' | 'rose' = 'rose';
  let badgeText = 'Outstanding';

  if (m.outstanding === 0) {
    badgeVariant = 'emerald';
    badgeText = 'Fully Paid (100%)';
  } else if (m.paid > 0) {
    badgeVariant = 'amber';
    badgeText = 'Partially Paid';
  }

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-5">
      <div className="border-b border-border-subtle pb-3">
        <Typography variant="h3">Dynamic Fee & Completion Status</Typography>
      </div>

      {/* Completeness Progress Bar */}
      <div className="space-y-2 bg-brand-50/70 p-4 rounded-xl border border-brand-100">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-text-secondary">Payment Completeness Rate</span>
          <span className="text-brand-700 font-mono text-base font-bold">
            {m.completionPct}%
          </span>
        </div>
        <ProgressBar
          value={m.completionPct}
          colorVariant={m.completionPct === 100 ? 'emerald' : 'brand'}
          height="0.75rem"
        />
      </div>

      {/* Fee Breakdown */}
      <div className="space-y-2.5 text-sm bg-surface-subtle/50 p-4 rounded-xl border border-border-subtle">
        <div className="flex justify-between text-text-secondary">
          <span>Standard Default Fee</span>
          <span className="font-mono font-semibold text-text-primary">
            ₦{child.defaultTuition.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-accent-emerald font-semibold">
          <span>Total Payments Made</span>
          <span className="font-mono">-₦{m.paid.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-brand-700 font-semibold pt-2 border-t border-border-default">
          <span>Effective Total Fee (Calculated)</span>
          <span className="font-mono">₦{m.effectiveTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Current Balance */}
      <div className="flex justify-between items-center pt-1">
        <div>
          <Typography variant="caption">Current Outstanding Balance</Typography>
          <Typography variant="stat-value" className="text-accent-rose font-mono">
            ₦{m.outstanding.toLocaleString()}
          </Typography>
        </div>
        <Badge variant={badgeVariant} size="md" dot>
          {badgeText}
        </Badge>
      </div>

      {/* Override Note if any */}
      {child.overrideReason && (
        <div className="flex items-start gap-2 text-xs text-text-secondary italic bg-amber-50/80 p-3 rounded-xl border border-amber-200">
          <AlertCircle size={16} className="text-accent-amber shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900 not-italic block">
              Administrative Adjustment Note:
            </span>
            <span>"{child.overrideReason}"</span>
          </div>
        </div>
      )}
    </div>
  );
};
