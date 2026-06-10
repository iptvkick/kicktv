-- 1. Add credentials JSONB DEFAULT '{}'::jsonb to integrations
ALTER TABLE public.integrations ADD COLUMN IF NOT EXISTS credentials JSONB DEFAULT '{}'::jsonb;

-- 2. Create trigger on profiles for 4-hour trial
CREATE OR REPLACE FUNCTION public.give_trial_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.subscriptions (profile_id, status, expires_at)
    VALUES (NEW.id, 'trialing', timezone('utc'::text, now()) + interval '4 hours');
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created_give_trial ON public.profiles;

CREATE TRIGGER on_profile_created_give_trial
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.give_trial_on_signup();

-- 3. Ensure onboarding_steps schema matches requirements
ALTER TABLE public.onboarding_steps ADD COLUMN IF NOT EXISTS youtube_id TEXT;
ALTER TABLE public.onboarding_steps ADD COLUMN IF NOT EXISTS order_index INT;

-- Migrate step_number to order_index if it exists
DO $$
BEGIN
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='onboarding_steps' and column_name='step_number') THEN
      UPDATE public.onboarding_steps SET order_index = step_number::INT WHERE order_index IS NULL;
      ALTER TABLE public.onboarding_steps DROP COLUMN step_number;
  END IF;
END $$;
