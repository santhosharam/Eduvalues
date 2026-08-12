-- Migration 008: Secure comic_panels with RLS for Admin/Staff

ALTER TABLE IF EXISTS public.comic_panels ENABLE ROW LEVEL SECURITY;

-- 1. READ: Everyone can read comic panels (including anonymous if needed by public lesson pages, but restricting to authenticated if that's safer)
-- Assuming students need to read panels when viewing a lesson.
CREATE POLICY "Select comic_panels" 
ON public.comic_panels 
FOR SELECT 
USING (true);

-- 2. INSERT: Only authorized staff/admin
CREATE POLICY "Insert comic_panels (admin)" 
ON public.comic_panels 
FOR INSERT 
TO authenticated
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- 3. UPDATE: Only authorized staff/admin
CREATE POLICY "Update comic_panels (admin)" 
ON public.comic_panels 
FOR UPDATE 
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- 4. DELETE: Only authorized staff/admin
CREATE POLICY "Delete comic_panels (admin)" 
ON public.comic_panels 
FOR DELETE 
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
