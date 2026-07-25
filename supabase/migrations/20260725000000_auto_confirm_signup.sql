-- Disable email confirmation requirement for local/dev-friendly signups
-- This ensures signups immediately create active sessions without email link
-- Required for auto-login after signup to dashboard redirect correctly

-- 1. Turn off email confirm on auth schema (Supabase Auth config)
ALTER ROLE authenticator SET pgrst.db_anon_key TO NULL;

-- 2. Update auth.users email confirmation setting via update auth.users email_confirmed_at trigger
-- When a user signs up, auto-confirm their email address.
CREATE OR REPLACE FUNCTION public.auto_confirm_auth_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = auth, public AS $$
BEGIN
  -- Only auto-confirm if not already confirmed (avoid overriding manual confirmation flow set confirmed the email is confirmed at time of sign-up
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at := NOW();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_auto_confirm
BEFORE INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_auth_user();
