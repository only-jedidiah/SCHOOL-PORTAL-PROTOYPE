import React, { useState } from 'react';
import { BookOpen, UserPlus, PenSquare } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { DashboardShell } from '@/components/templates/DashboardShell';
import { TabNavigation, TabItem } from '@/components/molecules/TabNavigation/TabNavigation';
import { CurriculumSection } from '@/components/organisms/Teacher/CurriculumSection';
import { StudentEnrollmentCard } from '@/components/organisms/Teacher/StudentEnrollmentCard';
import { GradebookTable } from '@/components/organisms/Teacher/GradebookTable';
import { ActionModal, ActionModalType } from '@/components/organisms/ActionModal/ActionModal';
import { DeleteConfirmModal } from '@/components/organisms/DeleteConfirmModal/DeleteConfirmModal';
import { SubjectCurriculum, StudentAccount } from '@/types/portal';

export const TeacherDashboardView: React.FC = () => {
  const { deleteSubject, deleteStudent } = useSchoolPortal();

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
  const [editingItem, setEditingItem] = useState<SubjectCurriculum | StudentAccount | null>(null);

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
        <CurriculumSection
          onAddSubject={() => {
            setEditingItem(null);
            setActionModalType('add-subject');
          }}
          onEditSubject={sub => {
            setEditingItem(sub);
            setActionModalType('edit-subject');
          }}
          onDeleteSubject={sub => {
            setDeleteModal({
              isOpen: true,
              itemType: 'Subject',
              itemName: sub.name,
              onConfirm: () => deleteSubject(sub.id),
            });
          }}
        />
      )}

      {activeTab === 'enrollment' && <StudentEnrollmentCard />}

      {activeTab === 'scores' && (
        <GradebookTable
          onEditStudent={stu => {
            setEditingItem(stu);
            setActionModalType('edit-student');
          }}
          onDeleteStudent={stu => {
            setDeleteModal({
              isOpen: true,
              itemType: 'Student Record',
              itemName: stu.name,
              onConfirm: () => deleteStudent(stu.id),
            });
          }}
        />
      )}

      {/* Action Modal for creating and editing subjects, students */}
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

