import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  SchoolClass,
  StaffMember,
  ActivityEvent,
  SubjectCurriculum,
  FamilyRecord,
  StudentAccount,
  FeeMetrics,
  ToastMessage,
  UserCredential,
} from '@/types/portal';
import { supabaseService } from '@/services/supabaseService';
import { isSupabaseConfigured } from '@/lib/supabase';

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
  currentUserEmail: string | null;
  activeTeacherClass: string;
  activeChildId: string;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  
  // Data stores
  classes: SchoolClass[];
  staff: StaffMember[];
  activities: ActivityEvent[];
  subjects: SubjectCurriculum[];
  families: Record<string, FamilyRecord>;
  students: Record<string, StudentAccount>;
  toasts: ToastMessage[];

  // Metrics helper
  calculateFeeMetrics: (student: StudentAccount) => FeeMetrics;

  // Auth & Credentials
  validateCredentials: (email: string, password: string, role: UserRole) => { isValid: boolean; mustChangePassword: boolean; error?: string };
  updateUserPassword: (email: string, newPassword: string, role: UserRole) => boolean;

  // Actions
  login: (role: UserRole, teacherClass?: string, email?: string) => void;
  logout: () => void;
  setActiveChildId: (childId: string) => void;
  setActiveTeacherClass: (cls: string) => void;
  
  // Admin actions
  addClass: (name: string, levelRange: string) => void;
  editClass: (id: string, name: string, levelRange: string, teacher?: string) => void;
  deleteClass: (id: string) => void;
  reallocateTeacher: (classId: string, teacherName: string) => void;
  applyFeeOverride: (studentId: string, newOutstanding: number, reason: string) => void;
  recordAdminPayment: (studentId: string, amount: number) => void;
  addStaff: (name: string, role: string, phone?: string) => void;
  editStaff: (id: string, name: string, role: string, phone: string, status: 'Active' | 'On Leave') => void;
  deleteStaff: (id: string) => void;
  addActivity: (name: string, classes: string, date: string) => void;
  editActivity: (id: string, name: string, classes: string, date: string, status: 'Scheduled' | 'Planned' | 'Completed') => void;
  deleteActivity: (id: string) => void;

  // Teacher actions
  addSubject: (name: string, classAssigned: string) => void;
  editSubject: (id: string, name: string, classAssigned: string, curriculum?: string) => void;
  deleteSubject: (id: string) => void;
  updateCurriculum: (subjectId: string, newCurriculum: string) => void;
  enrollStudent: (data: EnrollStudentData) => void;
  editStudent: (id: string, name: string, grade: string, defaultTuition: number) => void;
  deleteStudent: (id: string) => void;
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

const DEFAULT_GENERIC_PASSWORD = '1234567890';

const initialUsers: Record<string, UserCredential> = {
  'admin@gracefield.edu.ng': {
    email: 'admin@gracefield.edu.ng',
    role: 'admin',
    password: DEFAULT_GENERIC_PASSWORD,
    mustChangePassword: true,
  },
  'teacher@gracefield.edu.ng': {
    email: 'teacher@gracefield.edu.ng',
    role: 'teacher',
    password: DEFAULT_GENERIC_PASSWORD,
    mustChangePassword: true,
  },
  'parent@gracefield.edu.ng': {
    email: 'parent@gracefield.edu.ng',
    role: 'parent',
    password: DEFAULT_GENERIC_PASSWORD,
    mustChangePassword: true,
  },
};

const STORAGE_KEYS = {
  ROLE: 'school_portal_current_role',
  USER_EMAIL: 'school_portal_current_email',
  USERS: 'school_portal_user_credentials_store',
  TEACHER_CLASS: 'school_portal_teacher_class',
  CHILD_ID: 'school_portal_active_child_id',
  CLASSES: 'school_portal_classes',
  STAFF: 'school_portal_staff',
  ACTIVITIES: 'school_portal_activities',
  SUBJECTS: 'school_portal_subjects',
  FAMILIES: 'school_portal_families',
  STUDENTS: 'school_portal_students',
};

const SchoolPortalContext = createContext<SchoolPortalContextType | undefined>(undefined);

export const SchoolPortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved === 'admin' || saved === 'teacher' || saved === 'parent') ? (saved as UserRole) : null;
    } catch {
      return null;
    }
  });

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<Record<string, UserCredential>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) {
        return { ...initialUsers, ...JSON.parse(saved) };
      }
      return initialUsers;
    } catch {
      return initialUsers;
    }
  });

  const [activeTeacherClass, setActiveTeacherClass] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TEACHER_CLASS) || 'Grade 3B';
    } catch {
      return 'Grade 3B';
    }
  });

  const [activeChildId, setActiveChildId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CHILD_ID) || 'STU-2026-001';
    } catch {
      return 'STU-2026-001';
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(isSupabaseConfigured);

  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
      return saved ? JSON.parse(saved) : initialClasses;
    } catch {
      return initialClasses;
    }
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : initialStaff;
    } catch {
      return initialStaff;
    }
  });

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : initialActivities;
    } catch {
      return initialActivities;
    }
  });

  const [subjects, setSubjects] = useState<SubjectCurriculum[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : initialSubjects;
    } catch {
      return initialSubjects;
    }
  });

  const [families, setFamilies] = useState<Record<string, FamilyRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAMILIES);
      return saved ? JSON.parse(saved) : initialFamilies;
    } catch {
      return initialFamilies;
    }
  });

  const [students, setStudents] = useState<Record<string, StudentAccount>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync users store to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      if (currentUserEmail) {
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, currentUserEmail);
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
      }
    } catch {}
  }, [currentUserEmail]);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      if (currentRole) {
        localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ROLE);
      }
    } catch {
      // Ignore localStorage write issues
    }
  }, [currentRole]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHER_CLASS, activeTeacherClass);
    } catch {}
  }, [activeTeacherClass]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHILD_ID, activeChildId);
    } catch {}
  }, [activeChildId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    } catch {}
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    } catch {}
  }, [staff]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch {}
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch {}
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAMILIES, JSON.stringify(families));
    } catch {}
  }, [families]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch {}
  }, [students]);

  // Load from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const loadSupabaseData = async () => {
      try {
        const [clsData, stfData, actData, subData, famData, stuData] = await Promise.all([
          supabaseService.getClasses(),
          supabaseService.getStaff(),
          supabaseService.getActivities(),
          supabaseService.getSubjects(),
          supabaseService.getFamilies(),
          supabaseService.getStudents(),
        ]);

        if (clsData && clsData.length > 0) setClasses(clsData);
        if (stfData && stfData.length > 0) setStaff(stfData);
        if (actData && actData.length > 0) setActivities(actData);
        if (subData && subData.length > 0) setSubjects(subData);
        if (famData && Object.keys(famData).length > 0) setFamilies(famData);
        if (stuData && Object.keys(stuData).length > 0) {
          setStudents(stuData);
          const firstStuId = Object.keys(stuData)[0];
          if (firstStuId && !localStorage.getItem(STORAGE_KEYS.CHILD_ID)) {
            setActiveChildId(firstStuId);
          }
        }
        setIsSupabaseConnected(true);
      } catch (err) {
        console.error('Failed to sync with Supabase:', err);
        setIsSupabaseConnected(false);
      }
    };

    loadSupabaseData();
  }, []);

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

  // Auth & Credentials helpers
  const validateCredentials = (email: string, pass: string, role: UserRole) => {
    const normalized = email.trim().toLowerCase();
    const user = users[normalized];

    // If user not in initial registry, support new registration with generic password
    if (!user) {
      if (pass === DEFAULT_GENERIC_PASSWORD) {
        return { isValid: true, mustChangePassword: true };
      }
      return {
        isValid: false,
        mustChangePassword: true,
        error: `Incorrect password for ${role} user. Default initial password is 1234567890.`,
      };
    }

    if (user.password !== pass) {
      return {
        isValid: false,
        mustChangePassword: user.mustChangePassword,
        error: 'Incorrect password entered. Please verify your credentials.',
      };
    }

    return {
      isValid: true,
      mustChangePassword: user.mustChangePassword,
    };
  };

  const updateUserPassword = (email: string, newPass: string, role: UserRole) => {
    const normalized = email.trim().toLowerCase();
    const existing = users[normalized] || {
      email: normalized,
      role,
      password: DEFAULT_GENERIC_PASSWORD,
      mustChangePassword: true,
    };

    setUsers(prev => ({
      ...prev,
      [normalized]: {
        ...existing,
        role: existing.role || role,
        password: newPass,
        mustChangePassword: false,
      },
    }));
    return true;
  };

  const login = (role: UserRole, teacherClass?: string, email?: string) => {
    setIsLoading(true);
    if (teacherClass) {
      setActiveTeacherClass(teacherClass);
      try {
        localStorage.setItem(STORAGE_KEYS.TEACHER_CLASS, teacherClass);
      } catch {}
    }
    if (email) {
      const normalized = email.trim().toLowerCase();
      setCurrentUserEmail(normalized);
      try {
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, normalized);
      } catch {}
    }
    setCurrentRole(role);
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch {}
    showToast('success', `Signed in successfully`, `Logged into the ${role.toUpperCase()} Portal`);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  const logout = () => {
    setIsLoading(true);
    setCurrentRole(null);
    setCurrentUserEmail(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    } catch {}
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
    supabaseService.addClass(newClass);
    showToast('success', 'Class Added', `Successfully created ${name}`);
  };

  const editClass = (id: string, name: string, levelRange: string, teacher?: string) => {
    setClasses(prev =>
      prev.map(c => (c.id === id ? { ...c, name, levelRange, teacher: teacher !== undefined ? teacher : c.teacher } : c))
    );
    const existing = classes.find(c => c.id === id);
    if (existing) {
      supabaseService.updateClass({
        id,
        name,
        levelRange,
        teacher: teacher !== undefined ? teacher : existing.teacher,
      });
    }
    showToast('success', 'Class Updated', `Modified details for ${name}`);
  };

  const deleteClass = (id: string) => {
    const target = classes.find(c => c.id === id);
    setClasses(prev => prev.filter(c => c.id !== id));
    supabaseService.deleteClass(id);
    showToast('info', 'Class Removed', `Deleted class ${target?.name || id}`);
  };

  const reallocateTeacher = (classId: string, teacherName: string) => {
    setClasses(prev =>
      prev.map(c => (c.id === classId ? { ...c, teacher: teacherName } : c))
    );
    supabaseService.updateClassTeacher(classId, teacherName);
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
    supabaseService.updateStudentFeeOverride(studentId, Math.max(0, newOutstanding), reason);
    showToast('success', 'Fee Override Applied', `Updated outstanding balance to ₦${newOutstanding.toLocaleString()}`);
  };

  const recordAdminPayment = (studentId: string, amount: number) => {
    const current = students[studentId];
    if (!current) return;
    const newPaid = current.paidAmount + amount;
    const newOutstanding = Math.max(0, current.manualOutstanding - amount);

    setStudents(prev => ({
      ...prev,
      [studentId]: {
        ...current,
        paidAmount: newPaid,
        manualOutstanding: newOutstanding,
      },
    }));
    supabaseService.updateStudentPayment(studentId, newPaid, newOutstanding);
    showToast('success', 'Payment Recorded', `Successfully logged ₦${amount.toLocaleString()} received.`);
  };

  const addStaff = (name: string, role: string, phone?: string) => {
    const newId = `STF-${String(staff.length + 1).padStart(3, '0')}`;
    const genPhone = phone || `080${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newMember: StaffMember = { id: newId, name, role, phone: genPhone, status: 'Active' };
    setStaff(prev => [...prev, newMember]);
    supabaseService.addStaff(newMember);
    showToast('success', 'Staff Member Added', `${name} added as ${role}`);
  };

  const editStaff = (id: string, name: string, role: string, phone: string, status: 'Active' | 'On Leave') => {
    const updatedMember: StaffMember = { id, name, role, phone, status };
    setStaff(prev => prev.map(s => (s.id === id ? updatedMember : s)));
    supabaseService.updateStaff(updatedMember);
    showToast('success', 'Staff Member Updated', `Saved profile changes for ${name}`);
  };

  const deleteStaff = (id: string) => {
    const target = staff.find(s => s.id === id);
    setStaff(prev => prev.filter(s => s.id !== id));
    supabaseService.deleteStaff(id);
    showToast('info', 'Staff Member Deleted', `Removed ${target?.name || id} from directory`);
  };

  const addActivity = (name: string, targetClasses: string, date: string) => {
    const newId = `ACT-${String(activities.length + 1).padStart(3, '0')}`;
    const newAct: ActivityEvent = { id: newId, name, classes: targetClasses, date: date || 'TBD', status: 'Scheduled' };
    setActivities(prev => [...prev, newAct]);
    supabaseService.addActivity(newAct);
    showToast('success', 'Activity Scheduled', `Created event: ${name}`);
  };

  const editActivity = (
    id: string,
    name: string,
    targetClasses: string,
    date: string,
    status: 'Scheduled' | 'Planned' | 'Completed'
  ) => {
    const updatedAct: ActivityEvent = { id, name, classes: targetClasses, date: date || 'TBD', status };
    setActivities(prev => prev.map(a => (a.id === id ? updatedAct : a)));
    supabaseService.updateActivity(updatedAct);
    showToast('success', 'Activity Updated', `Saved details for ${name}`);
  };

  const deleteActivity = (id: string) => {
    const target = activities.find(a => a.id === id);
    setActivities(prev => prev.filter(a => a.id !== id));
    supabaseService.deleteActivity(id);
    showToast('info', 'Activity Removed', `Deleted event ${target?.name || id}`);
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
    supabaseService.addSubject(newSub);
    showToast('success', 'Subject Added', `${name} created for ${classAssigned}`);
  };

  const editSubject = (id: string, name: string, classAssigned: string, curriculum?: string) => {
    setSubjects(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              name,
              classAssigned,
              curriculum: curriculum !== undefined ? curriculum : s.curriculum,
            }
          : s
      )
    );
    const existing = subjects.find(s => s.id === id);
    if (existing) {
      supabaseService.updateSubject({
        id,
        name,
        classAssigned,
        curriculum: curriculum !== undefined ? curriculum : existing.curriculum,
      });
    }
    showToast('success', 'Subject Updated', `Saved subject info for ${name}`);
  };

  const deleteSubject = (id: string) => {
    const target = subjects.find(s => s.id === id);
    setSubjects(prev => prev.filter(s => s.id !== id));
    supabaseService.deleteSubject(id);
    showToast('info', 'Subject Deleted', `Removed ${target?.name || id}`);
  };

  const updateCurriculum = (subjectId: string, newCurriculum: string) => {
    setSubjects(prev =>
      prev.map(s => (s.id === subjectId ? { ...s, curriculum: newCurriculum } : s))
    );
    supabaseService.updateSubjectCurriculum(subjectId, newCurriculum);
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
      supabaseService.addFamily(newFam);
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
    supabaseService.addStudent(newStudent);

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

  const editStudent = (id: string, name: string, grade: string, defaultTuition: number) => {
    setStudents(prev => {
      const current = prev[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: {
          ...current,
          name,
          grade,
          defaultTuition,
        },
      };
    });
    supabaseService.updateStudent({ id, name, grade, defaultTuition });
    showToast('success', 'Student Record Updated', `Saved changes for ${name}`);
  };

  const deleteStudent = (id: string) => {
    const target = students[id];
    setStudents(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    // Remove from families
    if (target?.parentId) {
      setFamilies(prev => {
        const fam = prev[target.parentId];
        if (!fam) return prev;
        return {
          ...prev,
          [target.parentId]: {
            ...fam,
            childrenIds: fam.childrenIds.filter(cId => cId !== id),
          },
        };
      });
    }

    supabaseService.deleteStudent(id);
    showToast('info', 'Student Record Deleted', `Removed ${target?.name || id}`);
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

      supabaseService.updateStudentGradeScores(studentId, field, value, total, remark);

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

    const newPaid = child.paidAmount + amount;
    const newOutstanding = Math.max(0, child.manualOutstanding - amount);

    setStudents(prev => ({
      ...prev,
      [activeChildId]: {
        ...child,
        paidAmount: newPaid,
        manualOutstanding: newOutstanding,
      },
    }));

    supabaseService.updateStudentPayment(activeChildId, newPaid, newOutstanding);
    showToast('success', 'Payment Successful', `Installment of ₦${amount.toLocaleString()} processed for ${child.name}.`);
    return true;
  };

  return (
    <SchoolPortalContext.Provider
      value={{
        currentRole,
        currentUserEmail,
        activeTeacherClass,
        activeChildId,
        isLoading,
        isSupabaseConnected,
        classes,
        staff,
        activities,
        subjects,
        families,
        students,
        toasts,
        calculateFeeMetrics,
        validateCredentials,
        updateUserPassword,
        login,
        logout,
        setActiveChildId,
        setActiveTeacherClass,
        addClass,
        editClass,
        deleteClass,
        reallocateTeacher,
        applyFeeOverride,
        recordAdminPayment,
        addStaff,
        editStaff,
        deleteStaff,
        addActivity,
        editActivity,
        deleteActivity,
        addSubject,
        editSubject,
        deleteSubject,
        updateCurriculum,
        enrollStudent,
        editStudent,
        deleteStudent,
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
