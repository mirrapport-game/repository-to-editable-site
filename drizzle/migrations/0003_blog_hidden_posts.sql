CREATE TABLE public.blog_hidden_posts (post_id text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.blog_hidden_posts TO anon, authenticated;
GRANT INSERT, DELETE ON public.blog_hidden_posts TO authenticated;
GRANT ALL ON public.blog_hidden_posts TO service_role;
ALTER TABLE public.blog_hidden_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads hidden posts" ON public.blog_hidden_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins hide posts" ON public.blog_hidden_posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins unhide posts" ON public.blog_hidden_posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));