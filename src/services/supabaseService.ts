import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  SchoolClass,
  StaffMember,
  ActivityEvent,
  SubjectCurriculum,
  FamilyRecord,
  StudentAccount,
} from '@/types/portal';

export const supabaseService = {
  // 1. Classes
  async getClasses(): Promise<SchoolClass[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('Error fetching classes:', error);
      return null;
    }
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      levelRange: item.level_range,
      teacher: item.teacher,
    }));
  },

  async addClass(cls: SchoolClass): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('classes').insert({
      id: cls.id,
      name: cls.name,
      level_range: cls.levelRange,
      teacher: cls.teacher,
    });
    return !error;
  },

  async updateClassTeacher(classId: string, teacher: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase
      .from('classes')
      .update({ teacher })
      .eq('id', classId);
    return !error;
  },

  // 2. Staff
  async getStaff(): Promise<StaffMember[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('Error fetching staff:', error);
      return null;
    }
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      phone: item.phone,
      status: item.status,
    }));
  },

  async addStaff(member: StaffMember): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('staff').insert({
      id: member.id,
      name: member.name,
      role: member.role,
      phone: member.phone,
      status: member.status,
    });
    return !error;
  },

  // 3. Activities
  async getActivities(): Promise<ActivityEvent[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('date', { ascending: true });
    if (error) {
      console.error('Error fetching activities:', error);
      return null;
    }
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      classes: item.classes,
      date: item.date,
      status: item.status,
    }));
  },

  async addActivity(act: ActivityEvent): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('activities').insert({
      id: act.id,
      name: act.name,
      classes: act.classes,
      date: act.date,
      status: act.status,
    });
    return !error;
  },

  // 4. Subjects
  async getSubjects(): Promise<SubjectCurriculum[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('Error fetching subjects:', error);
      return null;
    }
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      classAssigned: item.class_assigned,
      curriculum: item.curriculum,
    }));
  },

  async addSubject(sub: SubjectCurriculum): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('subjects').insert({
      id: sub.id,
      name: sub.name,
      class_assigned: sub.classAssigned,
      curriculum: sub.curriculum,
    });
    return !error;
  },

  async updateSubjectCurriculum(id: string, curriculum: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase
      .from('subjects')
      .update({ curriculum })
      .eq('id', id);
    return !error;
  },

  // 5. Families & Students
  async getFamilies(): Promise<Record<string, FamilyRecord> | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.from('families').select('*');
    if (error) return null;

    const result: Record<string, FamilyRecord> = {};
    for (const fam of data) {
      result[fam.parent_id] = {
        parentId: fam.parent_id,
        parentName: fam.parent_name,
        phone: fam.phone,
        childrenIds: [],
      };
    }
    return result;
  },

  async getStudents(): Promise<Record<string, StudentAccount> | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data: studentsData, error: stuError } = await supabase
      .from('students')
      .select('*, student_grades(*)');
    if (stuError) return null;

    const result: Record<string, StudentAccount> = {};
    for (const s of studentsData) {
      result[s.id] = {
        id: s.id,
        parentId: s.parent_id,
        name: s.name,
        grade: s.grade,
        defaultTuition: Number(s.default_tuition),
        paidAmount: Number(s.paid_amount),
        manualOutstanding: Number(s.manual_outstanding),
        overrideReason: s.override_reason || '',
        t1: Number(s.t1 || 0),
        t2: Number(s.t2 || 0),
        proj: Number(s.proj || 0),
        exam: Number(s.exam || 0),
        grades: (s.student_grades || []).map((g: any) => ({
          subject: g.subject,
          t1: Number(g.t1 || 0),
          t2: Number(g.t2 || 0),
          proj: Number(g.proj || 0),
          exam: Number(g.exam || 0),
          total: Number(g.total || 0),
          remark: g.remark || '',
        })),
      };
    }
    return result;
  },

  async addFamily(fam: FamilyRecord): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('families').insert({
      parent_id: fam.parentId,
      parent_name: fam.parentName,
      phone: fam.phone,
    });
    return !error;
  },

  async addStudent(stu: StudentAccount): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error: sErr } = await supabase.from('students').insert({
      id: stu.id,
      parent_id: stu.parentId,
      name: stu.name,
      grade: stu.grade,
      default_tuition: stu.defaultTuition,
      paid_amount: stu.paidAmount,
      manual_outstanding: stu.manualOutstanding,
      override_reason: stu.overrideReason,
      t1: stu.t1,
      t2: stu.t2,
      proj: stu.proj,
      exam: stu.exam,
    });

    if (sErr) return false;

    if (stu.grades && stu.grades.length > 0) {
      await supabase.from('student_grades').insert(
        stu.grades.map(g => ({
          student_id: stu.id,
          subject: g.subject,
          t1: g.t1,
          t2: g.t2,
          proj: g.proj,
          exam: g.exam,
          total: g.total,
          remark: g.remark,
        }))
      );
    }
    return true;
  },

  async updateStudentFeeOverride(
    id: string,
    manualOutstanding: number,
    overrideReason: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase
      .from('students')
      .update({
        manual_outstanding: manualOutstanding,
        override_reason: overrideReason,
      })
      .eq('id', id);
    return !error;
  },

  async updateStudentPayment(
    id: string,
    paidAmount: number,
    manualOutstanding: number
  ): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase
      .from('students')
      .update({
        paid_amount: paidAmount,
        manual_outstanding: manualOutstanding,
      })
      .eq('id', id);
    return !error;
  },

  async updateStudentGradeScores(
    studentId: string,
    field: 't1' | 't2' | 'proj' | 'exam',
    value: number,
    total: number,
    remark: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    await supabase
      .from('students')
      .update({ [field]: value })
      .eq('id', studentId);

    await supabase
      .from('student_grades')
      .update({
        [field]: value,
        total,
        remark,
      })
      .eq('student_id', studentId);

    return true;
  },
};
