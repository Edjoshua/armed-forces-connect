
-- Add funding application fields
ALTER TABLE public.dependents
  ADD COLUMN IF NOT EXISTS cgpa numeric,
  ADD COLUMN IF NOT EXISTS school_year text,
  ADD COLUMN IF NOT EXISTS reason text;

ALTER TABLE public.scholarship_applications
  ADD COLUMN IF NOT EXISTS cgpa numeric,
  ADD COLUMN IF NOT EXISTS school_year text;

ALTER TABLE public.crowdfund_campaigns
  ADD COLUMN IF NOT EXISTS cgpa numeric,
  ADD COLUMN IF NOT EXISTS school_year text,
  ADD COLUMN IF NOT EXISTS beneficiary text,
  ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;

-- Allow all authenticated users to view APPROVED dependents and scholarships (for global Approved Fundings feed)
DROP POLICY IF EXISTS "Anyone authenticated can view approved dependents" ON public.dependents;
CREATE POLICY "Anyone authenticated can view approved dependents"
  ON public.dependents FOR SELECT TO authenticated
  USING (status = 'approved');

DROP POLICY IF EXISTS "Anyone authenticated can view approved scholarships" ON public.scholarship_applications;
CREATE POLICY "Anyone authenticated can view approved scholarships"
  ON public.scholarship_applications FOR SELECT TO authenticated
  USING (status = 'approved');

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'debit', -- debit, credit, withdrawal, funding_received, funding_sent
  category text,                       -- payment, education, medical, scholarship, transfer, etc.
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'completed', -- completed, pending, failed
  reference text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own transactions" ON public.transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own transactions" ON public.transactions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON public.transactions(user_id, created_at DESC);

-- KYC verifications
CREATE TABLE IF NOT EXISTS public.kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  face_image_path text,
  id_card_path text,
  id_type text,            -- passport, national_id, drivers_license
  status text NOT NULL DEFAULT 'pending', -- pending, verified, failed
  admin_note text,
  submitted_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own kyc" ON public.kyc_verifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own kyc" ON public.kyc_verifications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own kyc" ON public.kyc_verifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER kyc_set_updated_at
  BEFORE UPDATE ON public.kyc_verifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for KYC documents (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc', 'kyc', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own kyc files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'kyc' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own kyc files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'kyc' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own kyc files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'kyc' AND auth.uid()::text = (storage.foldername(name))[1]);
