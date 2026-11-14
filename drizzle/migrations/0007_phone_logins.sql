CREATE TABLE public.phone_logins (
  phone text PRIMARY KEY CHECK (phone ~ '^[0-9]{10,15}$'),
  user_id uuid NOT NULL UNIQUE,
  failed_attempts integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.phone_logins TO authenticated;
GRANT ALL ON public.phone_logins TO service_role;
ALTER TABLE public.phone_logins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own phone login" ON public.phone_logins
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins read phone logins" ON public.phone_logins
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));