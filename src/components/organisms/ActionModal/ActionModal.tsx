import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/molecules/Modal/Modal';
import { FormField } from '@/components/molecules/FormField/FormField';
import { Input } from '@/components/atoms/Input/Input';
import { Select } from '@/components/atoms/Select/Select';
import { Button } from '@/components/atoms/Button/Button';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import {
  SchoolClass,
  StaffMember,
  ActivityEvent,
  SubjectCurriculum,
  StudentAccount,
} from '@/types/portal';

export type ActionModalType =
  | 'add-class'
  | 'edit-class'
  | 'add-staff'
  | 'edit-staff'
  | 'add-activity'
  | 'edit-activity'
  | 'add-subject'
  | 'edit-subject'
  | 'edit-student';

export interface ActionModalProps {
  type: ActionModalType | null;
  onClose: () => void;
  initialData?:
    | SchoolClass
    | StaffMember
    | ActivityEvent
    | SubjectCurriculum
    | StudentAccount
    | null;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  type,
  onClose,
  initialData,
}) => {
  const {
    addClass,
    editClass,
    addStaff,
    editStaff,
    addActivity,
    editActivity,
    addSubject,
    editSubject,
    editStudent,
    activeTeacherClass,
    staff,
    classes,
  } = useSchoolPortal();

  // Class State
  const [className, setClassName] = useState('');
  const [classLevel, setClassLevel] = useState('Grade 1');
  const [classTeacher, setClassTeacher] = useState('Unassigned');

  // Staff State
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Lead Teacher');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffStatus, setStaffStatus] = useState<'Active' | 'On Leave'>('Active');

  // Activity State
  const [actName, setActName] = useState('');
  const [actClasses, setActClasses] = useState('All Classes');
  const [actDate, setActDate] = useState('');
  const [actStatus, setActStatus] = useState<'Scheduled' | 'Planned' | 'Completed'>('Scheduled');

  // Subject State
  const [subName, setSubName] = useState('');
  const [subClass, setSubClass] = useState('Grade 3B');

  // Student State
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('Grade 3B');
  const [studentTuition, setStudentTuition] = useState<number>(100000);

  useEffect(() => {
    if (!initialData) {
      setClassName('');
      setClassLevel('Grade 1');
      setClassTeacher('Unassigned');
      setStaffName('');
      setStaffRole('Lead Teacher');
      setStaffPhone('');
      setStaffStatus('Active');
      setActName('');
      setActClasses('All Classes');
      setActDate('');
      setActStatus('Scheduled');
      setSubName('');
      setSubClass(activeTeacherClass);
      setStudentName('');
      setStudentGrade(activeTeacherClass);
      setStudentTuition(100000);
      return;
    }

    if (type === 'edit-class') {
      const c = initialData as SchoolClass;
      setClassName(c.name || '');
      setClassLevel(c.levelRange || 'Grade 1');
      setClassTeacher(c.teacher || 'Unassigned');
    } else if (type === 'edit-staff') {
      const s = initialData as StaffMember;
      setStaffName(s.name || '');
      setStaffRole(s.role || 'Lead Teacher');
      setStaffPhone(s.phone || '');
      setStaffStatus(s.status || 'Active');
    } else if (type === 'edit-activity') {
      const a = initialData as ActivityEvent;
      setActName(a.name || '');
      setActClasses(a.classes || 'All Classes');
      setActDate(a.date || '');
      setActStatus(a.status || 'Scheduled');
    } else if (type === 'edit-subject') {
      const sub = initialData as SubjectCurriculum;
      setSubName(sub.name || '');
      setSubClass(sub.classAssigned || activeTeacherClass);
    } else if (type === 'edit-student') {
      const stu = initialData as StudentAccount;
      setStudentName(stu.name || '');
      setStudentGrade(stu.grade || activeTeacherClass);
      setStudentTuition(stu.defaultTuition || 100000);
    }
  }, [type, initialData, activeTeacherClass]);

  if (!type) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'add-class') {
      if (className) addClass(className, classLevel);
    } else if (type === 'edit-class' && initialData) {
      editClass((initialData as SchoolClass).id, className, classLevel, classTeacher);
    } else if (type === 'add-staff') {
      if (staffName) addStaff(staffName, staffRole, staffPhone);
    } else if (type === 'edit-staff' && initialData) {
      editStaff((initialData as StaffMember).id, staffName, staffRole, staffPhone, staffStatus);
    } else if (type === 'add-activity') {
      if (actName) addActivity(actName, actClasses, actDate);
    } else if (type === 'edit-activity' && initialData) {
      editActivity((initialData as ActivityEvent).id, actName, actClasses, actDate, actStatus);
    } else if (type === 'add-subject') {
      if (subName) addSubject(subName, activeTeacherClass);
    } else if (type === 'edit-subject' && initialData) {
      editSubject((initialData as SubjectCurriculum).id, subName, subClass);
    } else if (type === 'edit-student' && initialData) {
      editStudent((initialData as StudentAccount).id, studentName, studentGrade, Number(studentTuition));
    }

    onClose();
  };

  const modalConfig: Record<
    ActionModalType,
    { title: string; subtitle: string; submitLabel: string }
  > = {
    'add-class': {
      title: 'Add New Class',
      subtitle: 'Create a new class roster level for the school academic year.',
      submitLabel: 'Create Class',
    },
    'edit-class': {
      title: 'Edit Class Details',
      subtitle: 'Modify class name, level range, or assigned lead teacher.',
      submitLabel: 'Save Changes',
    },
    'add-staff': {
      title: 'Add New Staff Member',
      subtitle: 'Register new academic or administrative staff in the directory.',
      submitLabel: 'Add Staff Member',
    },
    'edit-staff': {
      title: 'Edit Staff Profile',
      subtitle: 'Update staff member role, phone contact, or active status.',
      submitLabel: 'Save Changes',
    },
    'add-activity': {
      title: 'Schedule School Event / Excursion',
      subtitle: 'Plan extracurriculars, sports, or field trips.',
      submitLabel: 'Schedule Event',
    },
    'edit-activity': {
      title: 'Edit Event Details',
      subtitle: 'Update scheduled date, participating classes, or event status.',
      submitLabel: 'Save Changes',
    },
    'add-subject': {
      title: 'Add New Subject',
      subtitle: `Add an academic subject for ${activeTeacherClass}.`,
      submitLabel: 'Add Subject',
    },
    'edit-subject': {
      title: 'Edit Subject Details',
      subtitle: 'Update subject name or assigned classroom level.',
      submitLabel: 'Save Changes',
    },
    'edit-student': {
      title: 'Edit Student Account',
      subtitle: 'Modify student name, grade classification, or standard tuition.',
      submitLabel: 'Save Changes',
    },
  };

  const currentConfig = modalConfig[type];

  return (
    <Modal
      isOpen={Boolean(type)}
      onClose={onClose}
      title={currentConfig.title}
      subtitle={currentConfig.subtitle}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {(type === 'add-class' || type === 'edit-class') && (
          <>
            <FormField label="Class Name" required>
              <Input
                required
                placeholder="e.g. Grade 4 Alpha, Kindergarten 2"
                value={className}
                onChange={e => setClassName(e.target.value)}
              />
            </FormField>
            <FormField label="Level Range" required>
              <Select
                value={classLevel}
                onChange={e => setClassLevel(e.target.value)}
              >
                <option value="Playgroup">Playgroup / Creche</option>
                <option value="Kindergarten">Kindergarten (KG1 - KG2)</option>
                <option value="Lower Primary">Lower Primary (Grades 1 - 3)</option>
                <option value="Upper Primary">Upper Primary (Grades 4 - 6)</option>
              </Select>
            </FormField>
            {type === 'edit-class' && (
              <FormField label="Allocated Lead Teacher">
                <Select
                  value={classTeacher}
                  onChange={e => setClassTeacher(e.target.value)}
                >
                  <option value="Unassigned">Unassigned</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </Select>
              </FormField>
            )}
          </>
        )}

        {(type === 'add-staff' || type === 'edit-staff') && (
          <>
            <FormField label="Staff Full Name" required>
              <Input
                required
                placeholder="e.g. Mr. Emmanuel Peters"
                value={staffName}
                onChange={e => setStaffName(e.target.value)}
              />
            </FormField>
            <FormField label="Designated Role" required>
              <Select
                value={staffRole}
                onChange={e => setStaffRole(e.target.value)}
              >
                <option value="Lead Teacher">Lead Teacher</option>
                <option value="Assistant Teacher">Assistant Teacher</option>
                <option value="Subject Specialist">Subject Specialist</option>
                <option value="Administrator">Administrator</option>
              </Select>
            </FormField>
            <FormField label="Phone Contact">
              <Input
                type="tel"
                placeholder="e.g. 08031234567"
                value={staffPhone}
                onChange={e => setStaffPhone(e.target.value)}
              />
            </FormField>
            {type === 'edit-staff' && (
              <FormField label="Employment Status" required>
                <Select
                  value={staffStatus}
                  onChange={e => setStaffStatus(e.target.value as 'Active' | 'On Leave')}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                </Select>
              </FormField>
            )}
          </>
        )}

        {(type === 'add-activity' || type === 'edit-activity') && (
          <>
            <FormField label="Activity / Event Name" required>
              <Input
                required
                placeholder="e.g. Science Fair & Exhibition"
                value={actName}
                onChange={e => setActName(e.target.value)}
              />
            </FormField>
            <FormField label="Target Classes" required>
              <Input
                required
                placeholder="e.g. Grade 1 Alpha, Grade 3B"
                value={actClasses}
                onChange={e => setActClasses(e.target.value)}
              />
            </FormField>
            <FormField label="Scheduled Date" required>
              <Input
                type="date"
                required
                value={actDate}
                onChange={e => setActDate(e.target.value)}
              />
            </FormField>
            {type === 'edit-activity' && (
              <FormField label="Event Status" required>
                <Select
                  value={actStatus}
                  onChange={e =>
                    setActStatus(
                      e.target.value as 'Scheduled' | 'Planned' | 'Completed'
                    )
                  }
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Planned">Planned</option>
                  <option value="Completed">Completed</option>
                </Select>
              </FormField>
            )}
          </>
        )}

        {(type === 'add-subject' || type === 'edit-subject') && (
          <>
            <FormField label="Subject Name" required>
              <Input
                required
                placeholder="e.g. French, Basic Science, Music"
                value={subName}
                onChange={e => setSubName(e.target.value)}
              />
            </FormField>
            {type === 'edit-subject' && (
              <FormField label="Class Assigned" required>
                <Select
                  value={subClass}
                  onChange={e => setSubClass(e.target.value)}
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            )}
          </>
        )}

        {type === 'edit-student' && (
          <>
            <FormField label="Student Full Name" required>
              <Input
                required
                placeholder="e.g. Abigail Okafor"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
              />
            </FormField>
            <FormField label="Class / Grade" required>
              <Select
                value={studentGrade}
                onChange={e => setStudentGrade(e.target.value)}
              >
                {classes.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.levelRange})
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Standard Default Tuition (₦)" required>
              <Input
                type="number"
                required
                value={studentTuition}
                onChange={e => setStudentTuition(Number(e.target.value))}
              />
            </FormField>
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {currentConfig.submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

