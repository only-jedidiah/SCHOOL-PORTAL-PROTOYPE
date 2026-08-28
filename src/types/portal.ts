export type UserRole = 'admin' | 'teacher' | 'parent';

export interface SchoolClass {
  id: string;
  name: string;
  levelRange: string;
  teacher: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: 'Active' | 'On Leave';
}

export interface ActivityEvent {
  id: string;
  name: string;
  classes: string;
  date: string;
  status: 'Scheduled' | 'Planned' | 'Completed';
}

export interface SubjectCurriculum {
  id: string;
  name: string;
  classAssigned: string;
  curriculum: string;
}

export interface FamilyRecord {
  parentId: string;
  parentName: string;
  phone: string;
  childrenIds: string[];
}

export interface StudentGrade {
  subject: string;
  t1: number;
  t2: number;
  proj: number;
  exam: number;
  total: number;
  remark: string;
}

export interface StudentAccount {
  id: string;
  parentId: string;
  name: string;
  grade: string;
  defaultTuition: number;
  paidAmount: number;
  manualOutstanding: number;
  overrideReason: string;
  t1: number;
  t2: number;
  proj: number;
  exam: number;
  grades: StudentGrade[];
}

export interface FeeMetrics {
  paid: number;
  outstanding: number;
  effectiveTotal: number;
  completionPct: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
