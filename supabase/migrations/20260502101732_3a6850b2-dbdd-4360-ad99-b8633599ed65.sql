-- Scholarship applications with admin verification
CREATE TABLE public.scholarship_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scholarship_name TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  institution TEXT NOT NULL,
  course_of_study TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'undergraduate',
  amount_requested NUMERIC NOT NULL DEFAULT 0,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scholarship applications"
ON public.scholarship_applications FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scholarship applications"
ON public.scholarship_applications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can withdraw their own pending applications"
ON public.scholarship_applications FOR DELETE TO authenticated
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can update their own applications"
ON public.scholarship_applications FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_scholarship_applications_updated_at
BEFORE UPDATE ON public.scholarship_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();