-- ==============================================================================
-- MIGRATION: 01_enable_full_crud.sql
-- Run this in your Supabase SQL Editor to enable DELETE and UPDATE operations
-- for all portal modules (Classes, Staff, Activities, Subjects, Families, Students)
-- ==============================================================================

-- 1. Enable DELETE policies for all tables
CREATE POLICY "Allow public delete classes" ON public.classes FOR DELETE USING (true);
CREATE POLICY "Allow public delete staff" ON public.staff FOR DELETE USING (true);
CREATE POLICY "Allow public delete activities" ON public.activities FOR DELETE USING (true);
CREATE POLICY "Allow public delete subjects" ON public.subjects FOR DELETE USING (true);
CREATE POLICY "Allow public delete families" ON public.families FOR DELETE USING (true);
CREATE POLICY "Allow public delete students" ON public.students FOR DELETE USING (true);
CREATE POLICY "Allow public delete student_grades" ON public.student_grades FOR DELETE USING (true);

-- 2. Ensure UPDATE policies are in place for all tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update classes' AND tablename = 'classes') THEN
        CREATE POLICY "Allow public update classes" ON public.classes FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update staff' AND tablename = 'staff') THEN
        CREATE POLICY "Allow public update staff" ON public.staff FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update activities' AND tablename = 'activities') THEN
        CREATE POLICY "Allow public update activities" ON public.activities FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update subjects' AND tablename = 'subjects') THEN
        CREATE POLICY "Allow public update subjects" ON public.subjects FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update families' AND tablename = 'families') THEN
        CREATE POLICY "Allow public update families" ON public.families FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update students' AND tablename = 'students') THEN
        CREATE POLICY "Allow public update students" ON public.students FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update student_grades' AND tablename = 'student_grades') THEN
        CREATE POLICY "Allow public update student_grades" ON public.student_grades FOR UPDATE USING (true);
    END IF;
END $$;
