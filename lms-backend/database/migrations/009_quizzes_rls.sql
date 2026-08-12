-- Migration 009: Secure quizzes with RLS for Admin/Staff

ALTER TABLE IF EXISTS public.quizzes ENABLE ROW LEVEL SECURITY;

-- 1. READ: Everyone can read quizzes
CREATE POLICY "Select quizzes" 
ON public.quizzes 
FOR SELECT 
USING (true);

-- 2. INSERT: Only authorized staff/admin
CREATE POLICY "Insert quizzes (admin)" 
ON public.quizzes 
FOR INSERT 
TO authenticated
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- 3. UPDATE: Only authorized staff/admin
CREATE POLICY "Update quizzes (admin)" 
ON public.quizzes 
FOR UPDATE 
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- 4. DELETE: Only authorized staff/admin
CREATE POLICY "Delete quizzes (admin)" 
ON public.quizzes 
FOR DELETE 
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
