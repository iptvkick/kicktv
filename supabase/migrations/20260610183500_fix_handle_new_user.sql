-- Migration to fix handle_new_user trigger which fails because subscriptions schema changed

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. Create Profile
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'client');

  -- Trial subscription logic was moved to onboarding/asaas flows,
  -- so we remove the insert into subscriptions here.
  -- Inserting into subscriptions here was failing because the columns
  -- profile_id, server_id, starts_at, expires_at were dropped.

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also drop the secondary trigger on profiles which tries to insert into subscriptions using old columns
DROP TRIGGER IF EXISTS on_profile_created_give_trial ON public.profiles;
DROP FUNCTION IF EXISTS public.give_trial_on_signup();

-- Fix potential RLS infinite recursion on profiles table
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR ALL USING (
  public.is_super_admin()
);
