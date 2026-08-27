import React from 'react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Badge } from '@/components/atoms/Badge/Badge';

export const AcademicGradesTable: React.FC = () => {
  const { students, activeChildId } = useSchoolPortal();
  const child = students[activeChildId] || Object.values(students)[0];

  if (!child) return null;

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-4">
      <div className="border-b border-border-subtle pb-3">
        <Typography variant="h3">Term Assessment Results</Typography>
        <Typography variant="body-sm" className="mt-0.5">
          Official Continuous Assessment and End of Term Examination results.
        </Typography>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th className="py-3 px-2">
                <Typography variant="label">Subject</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">1st Test (10)</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">2nd Test (10)</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Project (20)</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Exam (60)</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Total Score (100)</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Teacher Remark</Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {child.grades.map((g, idx) => (
              <tr key={idx} className="hover:bg-surface-subtle/50 transition-colors">
                <td className="py-3.5 px-2 font-semibold text-text-primary">
                  {g.subject}
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="mono">{g.t1}</Typography>
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="mono">{g.t2}</Typography>
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="mono">{g.proj}</Typography>
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="mono">{g.exam}</Typography>
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="mono" className="font-bold text-brand-700 text-base">
                    {g.total}
                  </Typography>
                </td>
                <td className="py-3.5 px-2">
                  <Badge
                    variant={
                      g.total >= 80
                        ? 'emerald'
                        : g.total >= 65
                        ? 'brand'
                        : 'amber'
                    }
                    size="sm"
                  >
                    {g.remark}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
