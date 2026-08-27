import React from 'react';
import { DashboardShell } from '@/components/templates/DashboardShell';
import { ChildHeaderCard } from '@/components/organisms/Parent/ChildHeaderCard';
import { AcademicGradesTable } from '@/components/organisms/Parent/AcademicGradesTable';
import { ParentFeeStatusCard } from '@/components/organisms/Parent/ParentFeeStatusCard';
import { InstallmentPaymentCard } from '@/components/organisms/Parent/InstallmentPaymentCard';

export const ParentDashboardView: React.FC = () => {
  return (
    <DashboardShell>
      {/* Child Information & Switcher Header */}
      <ChildHeaderCard />

      {/* Academic Continuous Assessment Grades Table */}
      <AcademicGradesTable />

      {/* Dynamic Fee Status & Installment Payment Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ParentFeeStatusCard />
        <InstallmentPaymentCard />
      </div>
    </DashboardShell>
  );
};
