-- Hotfix: Redirecionar FK de subscriptions.user_id de auth.users para public.profiles
-- Motivo: PostgREST não expõe auth.users publicamente, impedindo joins via API REST
-- sem esta FK direta em public.profiles o query profiles?select=*,subscriptions(...) retorna 400

ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
