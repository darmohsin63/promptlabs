-- Create a function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'super_admin'
  )
$$;

-- Update prompts RLS policy for admins to exclude super_admin's prompts
DROP POLICY IF EXISTS "Users can update own prompts" ON public.prompts;
CREATE POLICY "Users can update own prompts" ON public.prompts
FOR UPDATE USING (
  (auth.uid() = user_id) OR 
  (has_role(auth.uid(), 'admin') AND NOT is_super_admin(user_id)) OR
  is_super_admin(auth.uid())
);

-- Update user_roles policies - only super_admin can manage admin/pro roles
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Super admin can insert roles" ON public.user_roles
FOR INSERT WITH CHECK (is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Super admin can delete roles" ON public.user_roles
FOR DELETE USING (is_super_admin(auth.uid()));

-- Update profiles delete policy - only super_admin can delete
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Super admin can delete profiles" ON public.profiles
FOR DELETE USING (is_super_admin(auth.uid()));