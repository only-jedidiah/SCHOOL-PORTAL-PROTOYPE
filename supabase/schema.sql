-- ==============================================================================
-- GRACEFIELD MONTESSORI SCHOOL PORTAL - DATABASE SCHEMA
-- Execute this SQL in your Supabase Project: Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    level_range TEXT NOT NULL,
    teacher TEXT NOT NULL DEFAULT 'Unassigned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Staff Directory Table
CREATE TABLE IF NOT EXISTS public.staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Activities & Excursions Table
CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    classes TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Subjects & Schemes of Work Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    class_assigned TEXT NOT NULL,
    curriculum TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Family Households Table
CREATE TABLE IF NOT EXISTS public.families (
    parent_id TEXT PRIMARY KEY,
    parent_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Students Account & Fee Ledger Table
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    parent_id TEXT REFERENCES public.families(parent_id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    default_tuition NUMERIC NOT NULL DEFAULT 100000,
    paid_amount NUMERIC NOT NULL DEFAULT 0,
    manual_outstanding NUMERIC NOT NULL DEFAULT 100000,
    override_reason TEXT DEFAULT '',
    t1 NUMERIC DEFAULT 0,
    t2 NUMERIC DEFAULT 0,
    proj NUMERIC DEFAULT 0,
    exam NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Continuous Assessment Student Grades Table
CREATE TABLE IF NOT EXISTS public.student_grades (
    id BIGSERIAL PRIMARY KEY,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    t1 NUMERIC DEFAULT 0,
    t2 NUMERIC DEFAULT 0,
    proj NUMERIC DEFAULT 0,
    exam NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    remark TEXT DEFAULT 'Enrolled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC POLICIES (Demo / Portal Access)
-- ==============================================================================
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read & write for portal demo
CREATE POLICY "Allow public read classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Allow public insert classes" ON public.classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update classes" ON public.classes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete classes" ON public.classes FOR DELETE USING (true);

CREATE POLICY "Allow public read staff" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Allow public insert staff" ON public.staff FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update staff" ON public.staff FOR UPDATE USING (true);
CREATE POLICY "Allow public delete staff" ON public.staff FOR DELETE USING (true);

CREATE POLICY "Allow public read activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert activities" ON public.activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update activities" ON public.activities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete activities" ON public.activities FOR DELETE USING (true);

CREATE POLICY "Allow public read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Allow public insert subjects" ON public.subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update subjects" ON public.subjects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete subjects" ON public.subjects FOR DELETE USING (true);

CREATE POLICY "Allow public read families" ON public.families FOR SELECT USING (true);
CREATE POLICY "Allow public insert families" ON public.families FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update families" ON public.families FOR UPDATE USING (true);
CREATE POLICY "Allow public delete families" ON public.families FOR DELETE USING (true);

CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Allow public delete students" ON public.students FOR DELETE USING (true);

CREATE POLICY "Allow public read student_grades" ON public.student_grades FOR SELECT USING (true);
CREATE POLICY "Allow public insert student_grades" ON public.student_grades FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update student_grades" ON public.student_grades FOR UPDATE USING (true);
CREATE POLICY "Allow public delete student_grades" ON public.student_grades FOR DELETE USING (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================
INSERT INTO public.classes (id, name, level_range, teacher) VALUES
('CLS-001', 'Kindergarten 1', 'Kindergarten', 'Mrs. Sarah Adebayo'),
('CLS-002', 'Grade 1 Alpha', 'Grade 1', 'Mr. David Okon'),
('CLS-003', 'Grade 3B', 'Grade 3', 'Mrs. Sarah Adebayo'),
('CLS-004', 'Grade 6 Honors', 'Grade 6', 'Unassigned')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.staff (id, name, role, phone, status) VALUES
('STF-001', 'Mrs. Sarah Adebayo', 'Lead Teacher', '08031112233', 'Active'),
('STF-002', 'Mr. David Okon', 'Assistant Teacher', '08052223344', 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.activities (id, name, classes, date, status) VALUES
('ACT-001', 'National Museum Field Trip', 'Grade 3B, Grade 6 Honors', '2026-10-14', 'Scheduled'),
('ACT-002', 'Inter-House Sports Competition', 'All Classes (KG - Grade 6)', '2026-11-20', 'Planned')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.subjects (id, name, class_assigned, curriculum) VALUES
('SUB-01', 'Mathematics', 'Grade 3B', 'Week 1: Fractions & Decimals\nWeek 2: Long Division\nWeek 3: Basic Geometry'),
('SUB-02', 'English Language', 'Grade 3B', 'Week 1: Parts of Speech\nWeek 2: Creative Essay Writing\nWeek 3: Reading Comprehension')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.families (parent_id, parent_name, phone) VALUES
('PAR-001', 'Mr. & Mrs. Okafor', '08021234567')
ON CONFLICT (parent_id) DO NOTHING;

INSERT INTO public.students (id, parent_id, name, grade, default_tuition, paid_amount, manual_outstanding, override_reason, t1, t2, proj, exam) VALUES
('STU-2026-001', 'PAR-001', 'Abigail Okafor', 'Grade 3B', 100000, 0, 100000, '', 9, 8, 15, 51),
('STU-2026-002', 'PAR-001', 'Chidimma Okafor', 'Kindergarten 1', 110000, 50000, 60000, '', 10, 9, 18, 55)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.student_grades (student_id, subject, t1, t2, proj, exam, total, remark) VALUES
('STU-2026-001', 'Mathematics', 9, 8, 15, 51, 83, 'Excellent'),
('STU-2026-001', 'English Language', 8, 9, 16, 48, 81, 'Very Good'),
('STU-2026-002', 'Elementary Math', 10, 9, 18, 55, 92, 'Outstanding')
ON CONFLICT DO NOTHING;
