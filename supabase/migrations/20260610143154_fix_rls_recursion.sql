DROP POLICY IF EXISTS "Admins can manage integrations" ON public.integrations;
CREATE POLICY "Admins can manage integrations" ON public.integrations FOR ALL USING (public.is_super_admin());

DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (public.is_super_admin());
