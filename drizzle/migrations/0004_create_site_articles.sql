CREATE TABLE public.site_articles(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Статьи',
  date text NOT NULL DEFAULT '',
  published_at date,
  read_time text NOT NULL DEFAULT '',
  intro text NOT NULL DEFAULT '',
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  author text NOT NULL DEFAULT '',
  author_bio text NOT NULL DEFAULT '',
  author_telegram text,
  author_channel text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_articles TO authenticated;
GRANT ALL ON public.site_articles TO service_role;

ALTER TABLE public.site_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are public"
ON public.site_articles FOR SELECT
TO anon, authenticated
USING (is_published);

CREATE POLICY "Admins read all articles"
ON public.site_articles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert articles"
ON public.site_articles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update articles"
ON public.site_articles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete articles"
ON public.site_articles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));