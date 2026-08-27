import React, { useState } from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { FormField } from '@/components/molecules/FormField/FormField';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';

export const InstallmentPaymentCard: React.FC = () => {
  const { payParentInstallment } = useSchoolPortal();
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(installmentAmount);
    if (amount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      payParentInstallment(amount);
      setInstallmentAmount('');
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-4">
      <div className="border-b border-border-subtle pb-3">
        <Typography variant="h3">Pay Fees in Installments</Typography>
        <Typography variant="body-sm" className="mt-0.5">
          Payments directly reduce your outstanding balance and recalculate your completion percentage in real time.
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Installment Payment Amount (₦)" required>
          <Input
            type="number"
            isMono
            required
            placeholder="e.g. 30000"
            value={installmentAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInstallmentAmount(e.target.value)}
          />
        </FormField>

        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 size={16} className="text-accent-emerald shrink-0 mt-0.5" />
          <span>
            Instant receipt confirmation: Payment records are automatically credited to your child's ledger.
          </span>
        </div>

        <Button
          type="submit"
          variant="emerald"
          size="lg"
          className="w-full"
          isLoading={isProcessing}
          leftIcon={<CreditCard size={18} />}
        >
          Process Installment Payment
        </Button>
      </form>
    </div>
  );
};
