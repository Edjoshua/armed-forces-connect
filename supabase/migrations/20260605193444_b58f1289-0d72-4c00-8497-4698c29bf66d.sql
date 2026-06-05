CREATE TABLE public.deposits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  reference text,
  source text,
  status text NOT NULL DEFAULT 'pending',
  failure_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  confirmed_at timestamp with time zone
);

GRANT SELECT, INSERT, UPDATE ON public.deposits TO authenticated;
GRANT ALL ON public.deposits TO service_role;

ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own deposits" ON public.deposits
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own deposits" ON public.deposits
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own deposits" ON public.deposits
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_deposits_updated_at
  BEFORE UPDATE ON public.deposits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.deposits REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deposits;