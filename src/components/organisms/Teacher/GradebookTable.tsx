import React from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/atoms/Badge/Badge';
import { StudentAccount } from '@/types/portal';

export const GradebookTable: React.FC = () => {
  const {
    students,
    activeTeacherClass,
    updateStudentGradeField,
    showToast,
  } = useSchoolPortal();

  const studentList: StudentAccount[] = (Object.values(students) as StudentAccount[]).filter(
    s => s.grade === activeTeacherClass
  );

  const handleSave = () => {
    showToast('success', 'Gradebook Saved', 'All Continuous Assessment scores updated.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div>
          <Typography variant="h3">Continuous Assessment Gradebook</Typography>
          <Typography variant="body-sm" className="mt-0.5">
            Input assessment test, project, and exam scores for students enrolled in{' '}
            <span className="font-bold text-brand-700">{activeTeacherClass}</span>.
          </Typography>
        </div>
        <Button
          variant="emerald"
          size="sm"
          onClick={handleSave}
          leftIcon={<Save size={16} />}
        >
          Save Scores
        </Button>
      </div>

      <div className="bg-surface-card rounded-2xl border border-border-default shadow-sm overflow-hidden p-6">
        {studentList.length === 0 ? (
          <div className="p-8 text-center text-text-muted space-y-2">
            <AlertCircle className="mx-auto" size={32} />
            <Typography variant="h4" className="text-text-muted">
              No students registered under {activeTeacherClass} yet.
            </Typography>
            <Typography variant="body-sm">
              Use the 'Register Parents & Wards' tab to enroll pupils into this class.
            </Typography>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="py-3 px-2">
                    <Typography variant="label">Student Name</Typography>
                  </th>
                  <th className="py-3 px-2 w-28">
                    <Typography variant="label">1st Test (10)</Typography>
                  </th>
                  <th className="py-3 px-2 w-28">
                    <Typography variant="label">2nd Test (10)</Typography>
                  </th>
                  <th className="py-3 px-2 w-28">
                    <Typography variant="label">Project (20)</Typography>
                  </th>
                  <th className="py-3 px-2 w-28">
                    <Typography variant="label">Exam (60)</Typography>
                  </th>
                  <th className="py-3 px-2 w-28">
                    <Typography variant="label">Total Score</Typography>
                  </th>
                  <th className="py-3 px-2">
                    <Typography variant="label">Remark</Typography>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {studentList.map(s => {
                  const total = s.t1 + s.t2 + s.proj + s.exam;
                  const remark = s.grades[0]?.remark || 'Good';

                  return (
                    <tr key={s.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-3.5 px-2 font-semibold text-text-primary">
                        {s.name}
                        <span className="block text-[11px] text-text-muted font-normal font-mono">
                          {s.id}
                        </span>
                      </td>
                      <td className="py-3.5 px-2">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={s.t1}
                          onChange={e =>
                            updateStudentGradeField(s.id, 't1', Number(e.target.value))
                          }
                          className="w-16 bg-surface-base border border-border-default rounded-lg py-1.5 px-2 text-center font-mono text-xs text-text-primary focus:border-brand-700 outline-none"
                        />
                      </td>
                      <td className="py-3.5 px-2">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={s.t2}
                          onChange={e =>
                            updateStudentGradeField(s.id, 't2', Number(e.target.value))
                          }
                          className="w-16 bg-surface-base border border-border-default rounded-lg py-1.5 px-2 text-center font-mono text-xs text-text-primary focus:border-brand-700 outline-none"
                        />
                      </td>
                      <td className="py-3.5 px-2">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={s.proj}
                          onChange={e =>
                            updateStudentGradeField(s.id, 'proj', Number(e.target.value))
                          }
                          className="w-16 bg-surface-base border border-border-default rounded-lg py-1.5 px-2 text-center font-mono text-xs text-text-primary focus:border-brand-700 outline-none"
                        />
                      </td>
                      <td className="py-3.5 px-2">
                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={s.exam}
                          onChange={e =>
                            updateStudentGradeField(s.id, 'exam', Number(e.target.value))
                          }
                          className="w-16 bg-surface-base border border-border-default rounded-lg py-1.5 px-2 text-center font-mono text-xs text-text-primary focus:border-brand-700 outline-none"
                        />
                      </td>
                      <td className="py-3.5 px-2 font-mono font-bold text-brand-700 text-base">
                        {total}
                      </td>
                      <td className="py-3.5 px-2">
                        <Badge
                          variant={
                            total >= 80
                              ? 'emerald'
                              : total >= 60
                              ? 'brand'
                              : 'amber'
                          }
                          size="sm"
                        >
                          {remark}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
