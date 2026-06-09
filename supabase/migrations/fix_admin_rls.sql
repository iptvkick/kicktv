-- 1. Promove o seu usuário a Admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@kicktv.com';

-- 2. Corrige o bug de Recursão Infinita no RLS da tabela Profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Cria uma função SECURITY DEFINER (Roda com privilégios de root, bypassando o RLS para evitar o loop)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role public.user_role;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recria a política usando a função segura
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR ALL USING (
  public.is_admin()
);
