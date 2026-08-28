import React, { useState } from 'react';
import { BookOpen, UserPlus, PenSquare } from 'lucide-react';
import { DashboardShell } from '@/components/templates/DashboardShell';
import { TabNavigation, TabItem } from '@/components/molecules/TabNavigation/TabNavigation';
import { CurriculumSection } from '@/components/organisms/Teacher/CurriculumSection';
import { StudentEnrollmentCard } from '@/components/organisms/Teacher/StudentEnrollmentCard';
import { GradebookTable } from '@/components/organisms/Teacher/GradebookTable';
import { ActionModal, ActionModalType } from '@/components/organisms/ActionModal/ActionModal';

export const TeacherDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      return localStorage.getItem('school_portal_teacher_tab') || 'curriculum';
    } catch {
      return 'curriculum';
    }
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    try {
      localStorage.setItem('school_portal_teacher_tab', tabId);
    } catch {}
  };

  const [actionModalType, setActionModalType] = useState<ActionModalType | null>(null);

  const tabs: TabItem[] = [
    {
      id: 'curriculum',
      label: 'Subjects & Scheme of Work',
      icon: <BookOpen size={16} />,
    },
    {
      id: 'enrollment',
      label: 'Register Parents & Wards',
      icon: <UserPlus size={16} />,
    },
    {
      id: 'scores',
      label: 'Continuous Assessment Gradebook',
      icon: <PenSquare size={16} />,
    },
  ];

  return (
    <DashboardShell>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onChange={handleTabChange}
      />

      {activeTab === 'curriculum' && (
        <CurriculumSection onAddSubject={() => setActionModalType('add-subject')} />
      )}

      {activeTab === 'enrollment' && <StudentEnrollmentCard />}

      {activeTab === 'scores' && <GradebookTable />}

      <ActionModal
        type={actionModalType}
        onClose={() => setActionModalType(null)}
      />
    </DashboardShell>
  );
};
