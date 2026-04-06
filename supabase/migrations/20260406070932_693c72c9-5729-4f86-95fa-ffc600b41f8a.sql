
CREATE OR REPLACE FUNCTION public.rank_from_military_id(mid text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $$
DECLARE
  prefix text;
BEGIN
  IF mid IS NULL OR mid = '' THEN RETURN 'private'; END IF;
  prefix := upper(substring(mid from 1 for 3));
  RETURN CASE prefix
    WHEN 'GEN' THEN 'general'
    WHEN 'COL' THEN 'colonel'
    WHEN 'MAJ' THEN 'major'
    WHEN 'CPT' THEN 'captain'
    WHEN 'LTN' THEN 'lieutenant'
    WHEN 'SGT' THEN 'sergeant'
    WHEN 'CPL' THEN 'corporal'
    ELSE 'private'
  END;
END;
$$;

-- Update the handle_new_user trigger to auto-assign rank from military ID
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, military_id, date_of_birth, military_rank)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'military_id',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'date_of_birth' IS NOT NULL AND NEW.raw_user_meta_data ->> 'date_of_birth' != ''
      THEN (NEW.raw_user_meta_data ->> 'date_of_birth')::date
      ELSE NULL
    END,
    public.rank_from_military_id(NEW.raw_user_meta_data ->> 'military_id')
  );
  RETURN NEW;
END;
$$;

-- Backfill existing profiles
UPDATE public.profiles
SET military_rank = public.rank_from_military_id(military_id)
WHERE military_id IS NOT NULL;
