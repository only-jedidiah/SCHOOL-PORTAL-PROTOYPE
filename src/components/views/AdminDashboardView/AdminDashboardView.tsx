import React, { useState } from 'react';
import {
  School,
  Users,
  Package,
  Calendar,
  Calculator,
} from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { DashboardShell } from '@/components/templates/DashboardShell';
import { MetricCard } from '@/components/molecules/MetricCard/MetricCard';
import { TabNavigation, TabItem } from '@/components/molecules/TabNavigation/TabNavigation';
import { ClassManagementTable } from '@/components/organisms/Admin/ClassManagementTable';
import { FeeOverrideCard } from '@/components/organisms/Admin/FeeOverrideCard';
import { QuickPaymentCard } from '@/components/organisms/Admin/QuickPaymentCard';
import { FeeLedgerTable } from '@/components/organisms/Admin/FeeLedgerTable';
import { StaffDirectoryTable } from '@/components/organisms/Admin/StaffDirectoryTable';
import { InventoryTrackerTable } from '@/components/organisms/Admin/InventoryTrackerTable';
import { ActivitiesScheduleTable } from '@/components/organisms/Admin/ActivitiesScheduleTable';
import { ActionModal, ActionModalType } from '@/components/organisms/ActionModal/ActionModal';

export const AdminDashboardView: React.FC = () => {
  const { classes, staff, inventory, activities } = useSchoolPortal();
  const [activeTab, setActiveTab] = useState<string>('classes');
  const [actionModalType, setActionModalType] = useState<ActionModalType | null>(null);

  // Compute total inventory value
  const totalInventoryValue = inventory.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const tabs: TabItem[] = [
    { id: 'classes', label: 'Classes & Allocation', icon: <School size={16} /> },
    { id: 'discounts', label: 'Dynamic Fee Overrides & Completion %', icon: <Calculator size={16} /> },
    { id: 'staff', label: 'Staff Directory', icon: <Users size={16} /> },
    { id: 'inventory', label: 'Inventory Tracker', icon: <Package size={16} /> },
    { id: 'activities', label: 'Activities & Excursions', icon: <Calendar size={16} /> },
  ];

  return (
    <DashboardShell>
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Active Classes"
          value={`${classes.length} Classes`}
          icon={<School size={22} />}
          theme="brand"
        />
        <MetricCard
          label="Active Staff"
          value={`${staff.length} Personnel`}
          icon={<Users size={22} />}
          theme="purple"
        />
        <MetricCard
          label="Inventory Value"
          value={`₦${totalInventoryValue.toLocaleString()}`}
          icon={<Package size={22} />}
          theme="emerald"
        />
        <MetricCard
          label="Activities Scheduled"
          value={`${activities.length} Events`}
          icon={<Calendar size={22} />}
          theme="amber"
        />
      </div>

      {/* Admin Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab Content Panels */}
      {activeTab === 'classes' && (
        <ClassManagementTable onAddClass={() => setActionModalType('add-class')} />
      )}

      {activeTab === 'discounts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeeOverrideCard />
            <QuickPaymentCard />
          </div>
          <FeeLedgerTable />
        </div>
      )}

      {activeTab === 'staff' && (
        <StaffDirectoryTable onAddStaff={() => setActionModalType('add-staff')} />
      )}

      {activeTab === 'inventory' && (
        <InventoryTrackerTable onAddItem={() => setActionModalType('add-inventory')} />
      )}

      {activeTab === 'activities' && (
        <ActivitiesScheduleTable onAddActivity={() => setActionModalType('add-activity')} />
      )}

      {/* Action Modal for creating classes, staff, inventory, activities */}
      <ActionModal
        type={actionModalType}
        onClose={() => setActionModalType(null)}
      />
    </DashboardShell>
  );
};
