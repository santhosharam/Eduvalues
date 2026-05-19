-- Table: public.certificates
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    unique_code TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, course_id)
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Enable insert for service role only" ON public.certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role only" ON public.certificates FOR UPDATE USING (true);
