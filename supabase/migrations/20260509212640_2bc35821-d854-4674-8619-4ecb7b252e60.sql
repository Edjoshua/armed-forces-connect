
CREATE TABLE public.crowdfund_campaign_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL,
  campaign_user_id uuid NOT NULL,
  changed_by uuid,
  field text NOT NULL,
  old_value text,
  new_value text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_cca_campaign ON public.crowdfund_campaign_audit(campaign_id);

ALTER TABLE public.crowdfund_campaign_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view audit for own campaigns"
ON public.crowdfund_campaign_audit
FOR SELECT
TO authenticated
USING (auth.uid() = campaign_user_id);

CREATE OR REPLACE FUNCTION public.log_crowdfund_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.crowdfund_campaign_audit
      (campaign_id, campaign_user_id, changed_by, field, old_value, new_value)
    VALUES
      (NEW.id, NEW.user_id, auth.uid(), 'status', OLD.status, NEW.status);
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.crowdfund_campaign_audit
      (campaign_id, campaign_user_id, changed_by, field, old_value, new_value)
    VALUES
      (NEW.id, NEW.user_id, auth.uid(), 'status', NULL, NEW.status);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_crowdfund_status ON public.crowdfund_campaigns;
CREATE TRIGGER trg_log_crowdfund_status
AFTER INSERT OR UPDATE OF status ON public.crowdfund_campaigns
FOR EACH ROW EXECUTE FUNCTION public.log_crowdfund_status_change();
