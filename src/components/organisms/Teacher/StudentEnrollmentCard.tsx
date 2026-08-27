import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { FormField } from '@/components/molecules/FormField/FormField';
import { Input } from '@/components/atoms/Input/Input';
import { Select } from '@/components/atoms/Select/Select';
import { Button } from '@/components/atoms/Button/Button';

export const StudentEnrollmentCard: React.FC = () => {
  const { families, classes, enrollStudent } = useSchoolPortal();
  const familyKeys = Object.keys(families);

  const [parentMode, setParentMode] = useState<'existing' | 'new'>('existing');
  const [selectedParentId, setSelectedParentId] = useState(familyKeys[0] || 'PAR-001');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState(classes[2]?.name || 'Grade 3B');
  const [tuitionFee, setTuitionFee] = useState('100000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentGrade) return;

    enrollStudent({
      mode: parentMode,
      parentId: parentMode === 'existing' ? selectedParentId : undefined,
      newParentName: parentMode === 'new' ? newParentName : undefined,
      newParentPhone: parentMode === 'new' ? newParentPhone : undefined,
      studentName,
      grade: studentGrade,
      defaultTuition: Number(tuitionFee) || 100000,
    });

    setStudentName('');
    if (parentMode === 'new') {
      setNewParentName('');
      setNewParentPhone('');
    }
  };

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-6">
      <div className="border-b border-border-subtle pb-3">
        <Typography variant="h3">Register Parents & Wards</Typography>
        <Typography variant="body-sm" className="mt-0.5">
          Register new students under your assigned class roster or family household.
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Parent Association Selection */}
        <div className="space-y-3">
          <Typography variant="label">1. Parent / Household Association</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                parentMode === 'existing'
                  ? 'bg-brand-50/50 border-brand-700 shadow-sm'
                  : 'bg-surface-base border-border-default hover:bg-surface-subtle'
              }`}
            >
              <input
                type="radio"
                name="parentMode"
                value="existing"
                checked={parentMode === 'existing'}
                onChange={() => setParentMode('existing')}
                className="text-brand-700 focus:ring-brand-700"
              />
              <div>
                <Typography variant="h4" className="text-sm">
                  Attach to Existing Parent Profile
                </Typography>
                <Typography variant="caption">
                  Assign multiple children under an existing parent
                </Typography>
              </div>
            </label>

            <label
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                parentMode === 'new'
                  ? 'bg-brand-50/50 border-brand-700 shadow-sm'
                  : 'bg-surface-base border-border-default hover:bg-surface-subtle'
              }`}
            >
              <input
                type="radio"
                name="parentMode"
                value="new"
                checked={parentMode === 'new'}
                onChange={() => setParentMode('new')}
                className="text-brand-700 focus:ring-brand-700"
              />
              <div>
                <Typography variant="h4" className="text-sm">
                  Create New Parent Record
                </Typography>
                <Typography variant="caption">
                  Register a brand new household profile
                </Typography>
              </div>
            </label>
          </div>
        </div>

        {/* Existing Parent Dropdown */}
        {parentMode === 'existing' ? (
          <FormField label="Select Existing Family Household" required>
            <Select
              value={selectedParentId}
              onChange={e => setSelectedParentId(e.target.value)}
            >
              {familyKeys.map(key => (
                <option key={key} value={key}>
                  {families[key].parentName} ({families[key].childrenIds.length} Wards) — {families[key].phone}
                </option>
              ))}
            </Select>
          </FormField>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-50/40 p-4 rounded-xl border border-brand-100">
            <FormField label="Parent Full Name" required>
              <Input
                required
                placeholder="e.g. Dr. Emeka Okafor"
                value={newParentName}
                onChange={e => setNewParentName(e.target.value)}
              />
            </FormField>
            <FormField label="Parent Phone Number" required>
              <Input
                type="tel"
                required
                placeholder="e.g. 08066222892"
                value={newParentPhone}
                onChange={e => setNewParentPhone(e.target.value)}
              />
            </FormField>
          </div>
        )}

        {/* Ward Details */}
        <div className="space-y-4 pt-4 border-t border-border-subtle">
          <Typography variant="label">2. Ward Details</Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Child Full Name" required>
              <Input
                required
                placeholder="e.g. Abigail Okafor"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
              />
            </FormField>

            <FormField label="Class Grade" required>
              <Select
                value={studentGrade}
                onChange={e => setStudentGrade(e.target.value)}
              >
                {classes.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Default Tuition Fee (₦)" required>
              <Input
                type="number"
                isMono
                required
                value={tuitionFee}
                onChange={e => setTuitionFee(e.target.value)}
              />
            </FormField>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<UserCheck size={16} />}
          >
            Register Student
          </Button>
        </div>
      </form>
    </div>
  );
};
