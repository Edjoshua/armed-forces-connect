
CREATE TABLE public.dependents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  relationship text NOT NULL DEFAULT 'Son',
  date_of_birth date NOT NULL,
  school text DEFAULT 'Not yet assigned',
  savings_goal numeric NOT NULL DEFAULT 1000000,
  fund_balance numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dependents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own dependents"
  ON public.dependents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dependents"
  ON public.dependents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dependents"
  ON public.dependents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_dependents_updated_at
  BEFORE UPDATE ON public.dependents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
