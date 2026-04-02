
ALTER TABLE public.profiles 
ADD COLUMN military_id TEXT,
ADD COLUMN date_of_birth DATE,
ADD COLUMN service_status TEXT NOT NULL DEFAULT 'active';
