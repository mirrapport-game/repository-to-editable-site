-- Host directory: read only by admins (public pages use the typed catalogue)
DROP POLICY IF EXISTS "Facilitators are public" ON public.facilitators;

-- Host events: visitors see only upcoming games; hosts see their own; admins see all
DROP POLICY IF EXISTS "Events are public" ON public.facilitator_events;
CREATE POLICY "Upcoming events are public" ON public.facilitator_events
  FOR SELECT TO anon, authenticated USING (starts_at > now() - interval '12 hours');
CREATE POLICY "Hosts read own events" ON public.facilitator_events
  FOR SELECT TO authenticated USING (facilitator_slug = public.my_host_slug());
CREATE POLICY "Admins read events" ON public.facilitator_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Reviews: public text exposed through a narrow function (no user/order ids); table rows only to author and admins
DROP POLICY IF EXISTS "Reviews are public" ON public.facilitator_reviews;
CREATE POLICY "Authors read own reviews" ON public.facilitator_reviews
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins read reviews" ON public.facilitator_reviews
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.facilitator_public_reviews(_slug text)
RETURNS TABLE(id uuid, author_name text, rating integer, body text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT r.id, r.author_name, r.rating, r.body, r.created_at
  FROM public.facilitator_reviews r
  WHERE r.facilitator_slug = _slug
  ORDER BY r.created_at DESC
  LIMIT 200
$$;
REVOKE ALL ON FUNCTION public.facilitator_public_reviews(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.facilitator_public_reviews(text) TO anon, authenticated;

-- Channel posts: server-only (written and read by backend code)
DROP POLICY IF EXISTS "Anyone reads channel posts" ON public.channel_posts;
CREATE POLICY "Admins read channel posts" ON public.channel_posts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Hidden blog posts: filtering happens on the server; only admins read the list
DROP POLICY IF EXISTS "Anyone reads hidden posts" ON public.blog_hidden_posts;
CREATE POLICY "Admins read hidden posts" ON public.blog_hidden_posts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Article audio: private bucket, played through short-lived signed links from the server
DROP POLICY IF EXISTS "Anyone can read article audio" ON storage.objects;
CREATE POLICY "Admins can read article audio" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'article-audio' AND public.has_role(auth.uid(), 'admin'));