-- Add reason and medical documentation to crowdfund campaigns
ALTER TABLE public.crowdfund_campaigns
  ADD COLUMN IF NOT EXISTS reason text,
  ADD COLUMN IF NOT EXISTS documentation_path text,
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'medical';

-- Private storage bucket for medical documentation
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-docs', 'medical-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: users can upload/view their own files (folder = user id)
CREATE POLICY "Users can upload own medical docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'medical-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own medical docs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'medical-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own medical docs"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'medical-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own medical docs"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'medical-docs' AND auth.uid()::text = (storage.foldername(name))[1]);