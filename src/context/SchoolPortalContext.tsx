import React, { createContext, useContext, useState } from 'react';
import {
  UserRole,
  SchoolClass,
  StaffMember,
  InventoryItem,
  ActivityEvent,
  SubjectCurriculum,
  FamilyRecord,
  StudentAccount,
  FeeMetrics,
  ToastMessage,
} from '@/types/portal';

interface EnrollStudentData {
  mode: 'existing' | 'new';
  parentId?: string;
  newParentName?: string;
  newParentPhone?: string;
  studentName: string;
  grade: string;
  defaultTuition: number;
}

interface SchoolPortalContextType {
  // Current session
  currentRole: UserRole | null;
  activeTeacherClass: string;
  activeChildId: string;
  isLoading: boolean;
  
  // Data stores
  classes: SchoolClass[];
  staff: StaffMember[];
  inventory: InventoryItem[];
  activities: ActivityEvent[];
  subjects: SubjectCurriculum[];
  families: Record<string, FamilyRecord>;
  students: Record<string, StudentAccount>;
  toasts: ToastMessage[];

  // Metrics helper
  calculateFeeMetrics: (student: StudentAccount) => FeeMetrics;

  // Actions
  login: (role: UserRole, teacherClass?: string) => void;
  logout: () => void;
  setActiveChildId: (childId: string) => void;
  setActiveTeacherClass: (cls: string) => void;
  
  // Admin actions
  addClass: (name: string, levelRange: string) => void;
  reallocateTeacher: (classId: string, teacherName: string) => void;
  applyFeeOverride: (studentId: string, newOutstanding: number, reason: string) => void;
  recordAdminPayment: (studentId: string, amount: number) => void;
  addStaff: (name: string, role: string, phone?: string) => void;
  addInventory: (description: string, category: string, price: number, qty: number) => void;
  addActivity: (name: string, classes: string, date: string) => void;

  // Teacher actions
  addSubject: (name: string, classAssigned: string) => void;
  updateCurriculum: (subjectId: string, newCurriculum: string) => void;
  enrollStudent: (data: EnrollStudentData) => void;
  updateStudentGradeField: (studentId: string, field: 't1' | 't2' | 'proj' | 'exam', value: number) => void;

  // Parent actions
  payParentInstallment: (amount: number) => boolean;

  // Toast actions
  showToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  dismissToast: (id: string) => void;
}

const initialClasses: SchoolClass[] = [
  { id: 'CLS-001', name: 'Kindergarten 1', levelRange: 'Kindergarten', teacher: 'Mrs. Sarah Adebayo' },
  { id: 'CLS-002', name: 'Grade 1 Alpha', levelRange: 'Grade 1', teacher: 'Mr. David Okon' },
  { id: 'CLS-003', name: 'Grade 3B', levelRange: 'Grade 3', teacher: 'Mrs. Sarah Adebayo' },
  { id: 'CLS-004', name: 'Grade 6 Honors', levelRange: 'Grade 6', teacher: 'Unassigned' },
];

const initialStaff: StaffMember[] = [
  { id: 'STF-001', name: 'Mrs. Sarah Adebayo', role: 'Lead Teacher', phone: '08031112233', status: 'Active' },
  { id: 'STF-002', name: 'Mr. David Okon', role: 'Assistant Teacher', phone: '08052223344', status: 'Active' },
];

const initialInventory: InventoryItem[] = [
  { id: 'INV-001', description: 'School Uniform (Pair)', category: 'Apparel', price: 16000, qty: 45 },
  { id: 'INV-002', description: 'School Cardigan', category: 'Apparel', price: 13000, qty: 12 },
  { id: 'INV-003', description: 'Montessori Math Textbooks', category: 'Books', price: 8500, qty: 80 },
];

const initialActivities: ActivityEvent[] = [
  { id: 'ACT-001', name: 'National Museum Field Trip', classes: 'Grade 3B, Grade 6 Honors', date: '2026-10-14', status: 'Scheduled' },
  { id: 'ACT-002', name: 'Inter-House Sports Competition', classes: 'All Classes (KG - Grade 6)', date: '2026-11-20', status: 'Planned' },
];

const initialSubjects: SubjectCurriculum[] = [
  {
    id: 'SUB-01',
    name: 'Mathematics',
    classAssigned: 'Grade 3B',
    curriculum: 'Week 1: Fractions & Decimals\nWeek 2: Long Division\nWeek 3: Basic Geometry',
  },
  {
    id: 'SUB-02',
    name: 'English Language',
    classAssigned: 'Grade 3B',
    curriculum: 'Week 1: Parts of Speech\nWeek 2: Creative Essay Writing\nWeek 3: Reading Comprehension',
  },
];

const initialFamilies: Record<string, FamilyRecord> = {
  'PAR-001': {
    parentId: 'PAR-001',
    parentName: 'Mr. & Mrs. Okafor',
    phone: '08021234567',
    childrenIds: ['STU-2026-001', 'STU-2026-002'],
  },
};

const initialStudents: Record<string, StudentAccount> = {
  'STU-2026-001': {
    id: 'STU-2026-001',
    parentId: 'PAR-001',
    name: 'Abigail Okafor',
    grade: 'Grade 3B',
    defaultTuition: 100000,
    paidAmount: 0,
    manualOutstanding: 100000,
    overrideReason: '',
    t1: 9,
    t2: 8,
    proj: 15,
    exam: 51,
    grades: [
      { subject: 'Mathematics', t1: 9, t2: 8, proj: 15, exam: 51, total: 83, remark: 'Excellent' },
      { subject: 'English Language', t1: 8, t2: 9, proj: 16, exam: 48, total: 81, remark: 'Very Good' },
    ],
  },
  'STU-2026-002': {
    id: 'STU-2026-002',
    parentId: 'PAR-001',
    name: 'Chidimma Okafor',
    grade: 'Kindergarten 1',
    defaultTuition: 110000,
    paidAmount: 50000,
    manualOutstanding: 60000,
    overrideReason: '',
    t1: 10,
    t2: 9,
    proj: 18,
    exam: 55,
    grades: [
      { subject: 'Elementary Math', t1: 10, t2: 9, proj: 18, exam: 55, total: 92, remark: 'Outstanding' },
    ],
  },
};

const SchoolPortalContext = createContext<SchoolPortalContextType | undefined>(undefined);

export const SchoolPortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [activeTeacherClass, setActiveTeacherClass] = useState<string>('Grade 3B');
  const [activeChildId, setActiveChildId] = useState<string>('STU-2026-001');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [classes, setClasses] = useState<SchoolClass[]>(initialClasses);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [activities, setActivities] = useState<ActivityEvent[]>(initialActivities);
  const [subjects, setSubjects] = useState<SubjectCurriculum[]>(initialSubjects);
  const [families, setFamilies] = useState<Record<string, FamilyRecord>>(initialFamilies);
  const [students, setStudents] = useState<Record<string, StudentAccount>>(initialStudents);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fee calculation helper
  const calculateFeeMetrics = (student: StudentAccount): FeeMetrics => {
    const paid = student.paidAmount || 0;
    const outstanding = Math.max(0, student.manualOutstanding);
    const effectiveTotal = paid + outstanding;
    const completionPct = effectiveTotal > 0 ? Math.round((paid / effectiveTotal) * 100) : 100;
    return { paid, outstanding, effectiveTotal, completionPct };
  };

  const showToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = (role: UserRole, teacherClass?: string) => {
    setIsLoading(true);
    if (teacherClass) {
      setActiveTeacherClass(teacherClass);
    }
    setCurrentRole(role);
    showToast('success', `Signed in successfully`, `Logged into the ${role.toUpperCase()} Portal`);
    
    // Simulate brief preloading shimmer for smooth skeleton demonstration
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  const logout = () => {
    setIsLoading(true);
    setCurrentRole(null);
    showToast('info', 'Logged Out', 'You have been safely signed out.');
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // ADMIN ACTIONS
  const addClass = (name: string, levelRange: string) => {
    const newId = `CLS-${String(classes.length + 1).padStart(3, '0')}`;
    const newClass: SchoolClass = { id: newId, name, levelRange, teacher: 'Unassigned' };
    setClasses(prev => [...prev, newClass]);
    showToast('success', 'Class Added', `Successfully created ${name}`);
  };

  const reallocateTeacher = (classId: string, teacherName: string) => {
    setClasses(prev =>
      prev.map(c => (c.id === classId ? { ...c, teacher: teacherName } : c))
    );
    showToast('success', 'Teacher Allocated', `Updated class allocation to ${teacherName}`);
  };

  const applyFeeOverride = (studentId: string, newOutstanding: number, reason: string) => {
    setStudents(prev => {
      const current = prev[studentId];
      if (!current) return prev;
      return {
        ...prev,
        [studentId]: {
          ...current,
          manualOutstanding: Math.max(0, newOutstanding),
          overrideReason: reason,
        },
      };
    });
    showToast('success', 'Fee Override Applied', `Updated outstanding balance to ₦${newOutstanding.toLocaleString()}`);
  };

  const recordAdminPayment = (studentId: string, amount: number) => {
    setStudents(prev => {
      const current = prev[studentId];
      if (!current) return prev;
      const newPaid = current.paidAmount + amount;
      const newOutstanding = Math.max(0, current.manualOutstanding - amount);
      return {
        ...prev,
        [studentId]: {
          ...current,
          paidAmount: newPaid,
          manualOutstanding: newOutstanding,
        },
      };
    });
    showToast('success', 'Payment Recorded', `Successfully logged ₦${amount.toLocaleString()} received.`);
  };

  const addStaff = (name: string, role: string, phone?: string) => {
    const newId = `STF-${String(staff.length + 1).padStart(3, '0')}`;
    const genPhone = phone || `080${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newMember: StaffMember = { id: newId, name, role, phone: genPhone, status: 'Active' };
    setStaff(prev => [...prev, newMember]);
    showToast('success', 'Staff Member Added', `${name} added as ${role}`);
  };

  const addInventory = (description: string, category: string, price: number, qty: number) => {
    const newId = `INV-${String(inventory.length + 1).padStart(3, '0')}`;
    const newItem: InventoryItem = { id: newId, description, category: category || 'General', price, qty };
    setInventory(prev => [...prev, newItem]);
    showToast('success', 'Inventory Updated', `Added ${description} (${qty} units)`);
  };

  const addActivity = (name: string, targetClasses: string, date: string) => {
    const newId = `ACT-${String(activities.length + 1).padStart(3, '0')}`;
    const newAct: ActivityEvent = { id: newId, name, classes: targetClasses, date: date || 'TBD', status: 'Scheduled' };
    setActivities(prev => [...prev, newAct]);
    showToast('success', 'Activity Scheduled', `Created event: ${name}`);
  };

  // TEACHER ACTIONS
  const addSubject = (name: string, classAssigned: string) => {
    const newId = `SUB-${String(subjects.length + 1).padStart(2, '0')}`;
    const newSub: SubjectCurriculum = {
      id: newId,
      name,
      classAssigned,
      curriculum: 'Week 1: Scheme of work topic introduction\nWeek 2: Practical exercises & review',
    };
    setSubjects(prev => [...prev, newSub]);
    showToast('success', 'Subject Added', `${name} created for ${classAssigned}`);
  };

  const updateCurriculum = (subjectId: string, newCurriculum: string) => {
    setSubjects(prev =>
      prev.map(s => (s.id === subjectId ? { ...s, curriculum: newCurriculum } : s))
    );
    showToast('success', 'Curriculum Saved', 'Scheme of work successfully updated.');
  };

  const enrollStudent = (data: EnrollStudentData) => {
    let finalParentId = data.parentId;

    if (data.mode === 'new' && data.newParentName) {
      finalParentId = `PAR-${String(Object.keys(families).length + 1).padStart(3, '0')}`;
      const newFam: FamilyRecord = {
        parentId: finalParentId,
        parentName: data.newParentName,
        phone: data.newParentPhone || '08000000000',
        childrenIds: [],
      };
      setFamilies(prev => ({ ...prev, [finalParentId!]: newFam }));
    }

    if (!finalParentId) {
      finalParentId = Object.keys(families)[0] || 'PAR-001';
    }

    const studentCount = Object.keys(students).length + 1;
    const newStudentId = `STU-2026-${String(studentCount).padStart(3, '0')}`;
    
    const newStudent: StudentAccount = {
      id: newStudentId,
      parentId: finalParentId,
      name: data.studentName,
      grade: data.grade,
      defaultTuition: data.defaultTuition,
      paidAmount: 0,
      manualOutstanding: data.defaultTuition,
      overrideReason: '',
      t1: 0,
      t2: 0,
      proj: 0,
      exam: 0,
      grades: [
        { subject: 'Mathematics', t1: 0, t2: 0, proj: 0, exam: 0, total: 0, remark: 'Enrolled' },
      ],
    };

    setStudents(prev => ({ ...prev, [newStudentId]: newStudent }));

    setFamilies(prev => {
      const fam = prev[finalParentId!];
      if (!fam) return prev;
      return {
        ...prev,
        [finalParentId!]: {
          ...fam,
          childrenIds: [...fam.childrenIds, newStudentId],
        },
      };
    });

    showToast('success', 'Student Enrolled', `${data.studentName} registered under ${data.grade}`);
  };

  const updateStudentGradeField = (studentId: string, field: 't1' | 't2' | 'proj' | 'exam', value: number) => {
    setStudents(prev => {
      const current = prev[studentId];
      if (!current) return prev;
      const updated = { ...current, [field]: value };
      const total = updated.t1 + updated.t2 + updated.proj + updated.exam;
      
      let remark = 'Needs Improvement';
      if (total >= 80) remark = 'Excellent';
      else if (total >= 70) remark = 'Very Good';
      else if (total >= 60) remark = 'Good';
      else if (total >= 50) remark = 'Pass';

      const updatedGrades = current.grades.map(g => ({
        ...g,
        [field]: value,
        total,
        remark,
      }));

      return {
        ...prev,
        [studentId]: {
          ...updated,
          grades: updatedGrades,
        },
      };
    });
  };

  // PARENT ACTIONS
  const payParentInstallment = (amount: number): boolean => {
    if (amount <= 0) return false;
    const child = students[activeChildId];
    if (!child) return false;

    setStudents(prev => {
      const current = prev[activeChildId];
      const newPaid = current.paidAmount + amount;
      const newOutstanding = Math.max(0, current.manualOutstanding - amount);
      return {
        ...prev,
        [activeChildId]: {
          ...current,
          paidAmount: newPaid,
          manualOutstanding: newOutstanding,
        },
      };
    });

    showToast('success', 'Payment Successful', `Installment of ₦${amount.toLocaleString()} processed for ${child.name}.`);
    return true;
  };

  return (
    <SchoolPortalContext.Provider
      value={{
        currentRole,
        activeTeacherClass,
        activeChildId,
        isLoading,
        classes,
        staff,
        inventory,
        activities,
        subjects,
        families,
        students,
        toasts,
        calculateFeeMetrics,
        login,
        logout,
        setActiveChildId,
        setActiveTeacherClass,
        addClass,
        reallocateTeacher,
        applyFeeOverride,
        recordAdminPayment,
        addStaff,
        addInventory,
        addActivity,
        addSubject,
        updateCurriculum,
        enrollStudent,
        updateStudentGradeField,
        payParentInstallment,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </SchoolPortalContext.Provider>
  );
};

export const useSchoolPortal = () => {
  const context = useContext(SchoolPortalContext);
  if (!context) {
    throw new Error('useSchoolPortal must be used within a SchoolPortalProvider');
  }
  return context;
};
