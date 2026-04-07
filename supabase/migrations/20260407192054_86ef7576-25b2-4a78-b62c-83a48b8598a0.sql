CREATE TABLE public.crowdfund_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  goal numeric NOT NULL DEFAULT 500000,
  raised numeric NOT NULL DEFAULT 0,
  backers integer NOT NULL DEFAULT 0,
  days_left integer NOT NULL DEFAULT 30,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crowdfund_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view active campaigns"
  ON public.crowdfund_campaigns FOR SELECT
  TO authenticated
  USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns"
  ON public.crowdfund_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
  ON public.crowdfund_campaigns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
  ON public.crowdfund_campaigns FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_crowdfund_campaigns_updated_at
  BEFORE UPDATE ON public.crowdfund_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();