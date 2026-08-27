import React, { useState, useEffect } from 'react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { FormField } from '@/components/molecules/FormField/FormField';
import { Select } from '@/components/atoms/Select/Select';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { CreditCard } from 'lucide-react';

export const QuickPaymentCard: React.FC = () => {
  const { students, recordAdminPayment } = useSchoolPortal();
  const studentIds = Object.keys(students);
  const [selectedStudentId, setSelectedStudentId] = useState(studentIds[0] || '');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!selectedStudentId && studentIds.length > 0) {
      setSelectedStudentId(studentIds[0]);
    }
  }, [studentIds, selectedStudentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !amount) return;
    recordAdminPayment(selectedStudentId, Number(amount));
    setAmount('');
  };

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-4">
      <div className="border-b border-border-subtle pb-3">
        <Typography variant="h3">Record Manual Payment Transaction</Typography>
        <Typography variant="body-sm" className="mt-0.5">
          Record cash/transfer payments which immediately decrease current outstanding balance.
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

        <FormField label="Amount Received (₦)" required>
          <Input
            type="number"
            isMono
            required
            placeholder="e.g. 50000"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </FormField>

        <Button
          type="submit"
          variant="emerald"
          className="w-full"
          leftIcon={<CreditCard size={16} />}
        >
          Record Payment
        </Button>
      </form>
    </div>
  );
};
