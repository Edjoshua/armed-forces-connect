
-- Medical crowdfund: tighten visibility to approved/active or owner
DROP POLICY IF EXISTS "Anyone authenticated can view active campaigns" ON public.crowdfund_campaigns;

CREATE POLICY "View approved or live campaigns or own"
ON public.crowdfund_campaigns
FOR SELECT
TO authenticated
USING (status IN ('approved','active') OR auth.uid() = user_id);

-- Education dependents: ensure owner-or-approved (already exists, recreate cleanly)
DROP POLICY IF EXISTS "Anyone authenticated can view approved dependents" ON public.dependents;
DROP POLICY IF EXISTS "Users can view their own dependents" ON public.dependents;

CREATE POLICY "View approved dependents or own"
ON public.dependents
FOR SELECT
TO authenticated
USING (status = 'approved' OR auth.uid() = user_id);

-- Scholarship applications
DROP POLICY IF EXISTS "Anyone authenticated can view approved scholarships" ON public.scholarship_applications;
DROP POLICY IF EXISTS "Users can view their own scholarship applications" ON public.scholarship_applications;

CREATE POLICY "View approved scholarships or own"
ON public.scholarship_applications
FOR SELECT
TO authenticated
USING (status = 'approved' OR auth.uid() = user_id);
