import React, { useState } from 'react';
import {
  School,
  Users,
  GraduationCap,
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
import { ActivitiesScheduleTable } from '@/components/organisms/Admin/ActivitiesScheduleTable';
import { ActionModal, ActionModalType } from '@/components/organisms/ActionModal/ActionModal';
import { DeleteConfirmModal } from '@/components/organisms/DeleteConfirmModal/DeleteConfirmModal';
import {
  SchoolClass,
  StaffMember,
  ActivityEvent,
  StudentAccount,
} from '@/types/portal';

export const AdminDashboardView: React.FC = () => {
  const {
    classes,
    staff,
    students,
    activities,
    deleteClass,
    deleteStaff,
    deleteActivity,
    deleteStudent,
  } = useSchoolPortal();

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      return localStorage.getItem('school_portal_admin_tab') || 'classes';
    } catch {
      return 'classes';
    }
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    try {
      localStorage.setItem('school_portal_admin_tab', tabId);
    } catch {}
  };

  const [actionModalType, setActionModalType] = useState<ActionModalType | null>(null);
  const [editingItem, setEditingItem] = useState<
    SchoolClass | StaffMember | ActivityEvent | StudentAccount | null
  >(null);

  // Deletion modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemType: string;
    itemName: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    itemType: '',
    itemName: '',
    onConfirm: () => {},
  });

  const studentCount = Object.keys(students).length;

  const tabs: TabItem[] = [
    { id: 'classes', label: 'Classes & Allocation', icon: <School size={16} /> },
    { id: 'discounts', label: 'Dynamic Fee Overrides & Completion %', icon: <Calculator size={16} /> },
    { id: 'staff', label: 'Staff Directory', icon: <Users size={16} /> },
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
          label="Enrolled Pupils"
          value={`${studentCount} Students`}
          icon={<GraduationCap size={22} />}
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
        onChange={handleTabChange}
      />

      {/* Tab Content Panels */}
      {activeTab === 'classes' && (
        <ClassManagementTable
          onAddClass={() => {
            setEditingItem(null);
            setActionModalType('add-class');
          }}
          onEditClass={cls => {
            setEditingItem(cls);
            setActionModalType('edit-class');
          }}
          onDeleteClass={cls => {
            setDeleteModal({
              isOpen: true,
              itemType: 'Class',
              itemName: cls.name,
              onConfirm: () => deleteClass(cls.id),
            });
          }}
        />
      )}

      {activeTab === 'discounts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeeOverrideCard />
            <QuickPaymentCard />
          </div>
          <FeeLedgerTable
            onEditStudent={stu => {
              setEditingItem(stu);
              setActionModalType('edit-student');
            }}
            onDeleteStudent={stu => {
              setDeleteModal({
                isOpen: true,
                itemType: 'Student Account',
                itemName: stu.name,
                onConfirm: () => deleteStudent(stu.id),
              });
            }}
          />
        </div>
      )}

      {activeTab === 'staff' && (
        <StaffDirectoryTable
          onAddStaff={() => {
            setEditingItem(null);
            setActionModalType('add-staff');
          }}
          onEditStaff={member => {
            setEditingItem(member);
            setActionModalType('edit-staff');
          }}
          onDeleteStaff={member => {
            setDeleteModal({
              isOpen: true,
              itemType: 'Staff Member',
              itemName: member.name,
              onConfirm: () => deleteStaff(member.id),
            });
          }}
        />
      )}

      {activeTab === 'activities' && (
        <ActivitiesScheduleTable
          onAddActivity={() => {
            setEditingItem(null);
            setActionModalType('add-activity');
          }}
          onEditActivity={act => {
            setEditingItem(act);
            setActionModalType('edit-activity');
          }}
          onDeleteActivity={act => {
            setDeleteModal({
              isOpen: true,
              itemType: 'Activity Event',
              itemName: act.name,
              onConfirm: () => deleteActivity(act.id),
            });
          }}
        />
      )}

      {/* Action Modal for creating and editing classes, staff, activities, students */}
      <ActionModal
        type={actionModalType}
        initialData={editingItem}
        onClose={() => {
          setActionModalType(null);
          setEditingItem(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        itemType={deleteModal.itemType}
        itemName={deleteModal.itemName}
        onConfirm={deleteModal.onConfirm}
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
      />
    </DashboardShell>
  );
};

