import React, { useState, useEffect } from 'react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { FormField } from '@/components/molecules/FormField/FormField';
import { Select } from '@/components/atoms/Select/Select';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';

export const FeeOverrideCard: React.FC = () => {
  const { students, calculateFeeMetrics, applyFeeOverride } = useSchoolPortal();
  const studentIds = Object.keys(students);
  const [selectedStudentId, setSelectedStudentId] = useState(studentIds[0] || '');
  const [newAmount, setNewAmount] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!selectedStudentId && studentIds.length > 0) {
      setSelectedStudentId(studentIds[0]);
    }
  }, [studentIds, selectedStudentId]);

  const activeStudent = students[selectedStudentId];
  const metrics = activeStudent ? calculateFeeMetrics(activeStudent) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || newAmount === '') return;
    applyFeeOverride(selectedStudentId, Number(newAmount), reason);
    setNewAmount('');
    setReason('');
  };

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-4">
      <div className="border-b border-border-subtle pb-3">
        <Typography variant="h3">Dynamic Outstanding Balance Override</Typography>
        <Typography variant="body-sm" className="mt-0.5">
          Adjust the remaining balance directly at any point to recalculate payment completeness.
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Select Student Account" required>
          <Select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
          >
            {studentIds.map(id => {
              const s = students[id];
              return (
                <option key={id} value={id}>
                  {s.name} ({s.grade})
                </option>
              );
            })}
          </Select>
        </FormField>

        {activeStudent && metrics && (
          <div className="p-3.5 bg-brand-50/60 rounded-xl border border-brand-200/80 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-text-secondary font-sans">Default Full Fee:</span>
              <span className="font-bold text-text-primary">₦{activeStudent.defaultTuition.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary font-sans">Total Paid:</span>
              <span className="font-bold text-accent-emerald">₦{metrics.paid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary font-sans">Current Outstanding:</span>
              <span className="font-bold text-accent-rose">₦{metrics.outstanding.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary font-sans">Effective Total:</span>
              <span className="font-bold text-text-primary">₦{metrics.effectiveTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-brand-200">
              <span className="text-text-secondary font-sans">Completeness Rate:</span>
              <span className="font-bold text-brand-700">{metrics.completionPct}%</span>
            </div>
          </div>
        )}

        <FormField label="New Target Outstanding Balance (₦)" required>
          <Input
            type="number"
            isMono
            required
            placeholder="e.g. 40000 or 0"
            value={newAmount}
            onChange={e => setNewAmount(e.target.value)}
          />
        </FormField>

        <FormField label="Reason for Override / Agreement Note" required>
          <Input
            type="text"
            required
            placeholder="e.g. Agreed partial payment waiver with parent"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </FormField>

        <Button type="submit" variant="primary" className="w-full">
          Apply Dynamic Override
        </Button>
      </form>
    </div>
  );
};
