import React, { useState } from 'react';
import { Modal } from '@/components/molecules/Modal/Modal';
import { FormField } from '@/components/molecules/FormField/FormField';
import { Input } from '@/components/atoms/Input/Input';
import { Select } from '@/components/atoms/Select/Select';
import { Button } from '@/components/atoms/Button/Button';
import { useSchoolPortal } from '@/context/SchoolPortalContext';

export type ActionModalType =
  | 'add-class'
  | 'add-staff'
  | 'add-activity'
  | 'add-subject';

export interface ActionModalProps {
  type: ActionModalType | null;
  onClose: () => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({ type, onClose }) => {
  const {
    addClass,
    addStaff,
    addActivity,
    addSubject,
    activeTeacherClass,
  } = useSchoolPortal();

  // Add Class State
  const [className, setClassName] = useState('');
  const [classLevel, setClassLevel] = useState('Grade 1');

  // Add Staff State
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Lead Teacher');
  const [staffPhone, setStaffPhone] = useState('');

  // Add Activity State
  const [actName, setActName] = useState('');
  const [actClasses, setActClasses] = useState('All Classes');
  const [actDate, setActDate] = useState('');

  // Add Subject State
  const [subName, setSubName] = useState('');

  if (!type) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'add-class') {
      if (className) {
        addClass(className, classLevel);
        setClassName('');
      }
    } else if (type === 'add-staff') {
      if (staffName) {
        addStaff(staffName, staffRole, staffPhone);
        setStaffName('');
        setStaffPhone('');
      }
    } else if (type === 'add-activity') {
      if (actName) {
        addActivity(actName, actClasses, actDate);
        setActName('');
      }
    } else if (type === 'add-subject') {
      if (subName) {
        addSubject(subName, activeTeacherClass);
        setSubName('');
      }
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
    'add-staff': {
      title: 'Add New Staff Member',
      subtitle: 'Register new academic or administrative staff in the directory.',
      submitLabel: 'Add Staff Member',
    },
    'add-activity': {
      title: 'Schedule School Event / Excursion',
      subtitle: 'Plan extracurriculars, sports, or field trips.',
      submitLabel: 'Schedule Event',
    },
    'add-subject': {
      title: 'Add New Subject',
      subtitle: `Add an academic subject for ${activeTeacherClass}.`,
      submitLabel: 'Add Subject',
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
        {type === 'add-class' && (
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
          </>
        )}

        {type === 'add-staff' && (
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
          </>
        )}

        {type === 'add-activity' && (
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
          </>
        )}

        {type === 'add-subject' && (
          <>
            <FormField label="Subject Name" required>
              <Input
                required
                placeholder="e.g. French, Basic Science, Music"
                value={subName}
                onChange={e => setSubName(e.target.value)}
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
