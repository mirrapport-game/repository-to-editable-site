CREATE TABLE public.marathon_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at timestamptz NOT NULL,
  phase text NOT NULL DEFAULT 'demo' CHECK (phase IN ('demo','paid','intensive')),
  game text NOT NULL,
  theme text NOT NULL DEFAULT '',
  capacity int NOT NULL DEFAULT 6,
  published boolean NOT NULL DEFAULT true,
  announced_at timestamptz,
  host_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT marathon_slots_capacity_check CHECK (capacity BETWEEN 2 AND 150)
);
COMMENT ON COLUMN public.marathon_slots.host_name IS 'Public display name of the scheduled game facilitator';
GRANT SELECT ON public.marathon_slots TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.marathon_slots TO authenticated;
GRANT ALL ON public.marathon_slots TO service_role;
ALTER TABLE public.marathon_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published slots" ON public.marathon_slots FOR SELECT TO anon, authenticated USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage slots" ON public.marathon_slots FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TABLE public.marathon_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid NOT NULL REFERENCES public.marathon_slots(id) ON DELETE CASCADE,
  name text NOT NULL, contact text NOT NULL,
  tg_chat_id bigint, reminded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.marathon_signups TO authenticated;
GRANT ALL ON public.marathon_signups TO service_role;
ALTER TABLE public.marathon_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read signups" ON public.marathon_signups FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete signups" ON public.marathon_signups FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TABLE public.blogger_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, blog_url text NOT NULL, contact text NOT NULL,
  audience text NOT NULL DEFAULT '', topic text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','approved','rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.blogger_applications TO authenticated;
GRANT ALL ON public.blogger_applications TO service_role;
ALTER TABLE public.blogger_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage blogger apps" ON public.blogger_applications FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE OR REPLACE FUNCTION public.marathon_slot_counts()
RETURNS TABLE(slot_id uuid, taken int)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.id, count(m.id)::int FROM public.marathon_slots s
  LEFT JOIN public.marathon_signups m ON m.slot_id = s.id
  WHERE s.published GROUP BY s.id
$$;
GRANT EXECUTE ON FUNCTION public.marathon_slot_counts() TO anon, authenticated;
CREATE OR REPLACE FUNCTION public.marathon_signup(_slot_id uuid, _name text, _contact text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE cap int; n int; new_id uuid;
BEGIN
  IF length(trim(coalesce(_name,''))) < 2 OR length(_name) > 100 THEN RAISE EXCEPTION 'Укажите имя'; END IF;
  IF length(trim(coalesce(_contact,''))) < 3 OR length(_contact) > 100 THEN RAISE EXCEPTION 'Укажите телефон или Telegram'; END IF;
  SELECT capacity INTO cap FROM public.marathon_slots WHERE id = _slot_id AND published AND starts_at > now() FOR UPDATE;
  IF cap IS NULL THEN RAISE EXCEPTION 'Игра недоступна'; END IF;
  SELECT count(*) INTO n FROM public.marathon_signups WHERE slot_id = _slot_id;
  IF n >= cap THEN RAISE EXCEPTION 'Мест нет — выберите другую игру'; END IF;
  INSERT INTO public.marathon_signups(slot_id, name, contact) VALUES (_slot_id, trim(_name), trim(_contact)) RETURNING id INTO new_id;
  RETURN new_id::text;
END $$;
GRANT EXECUTE ON FUNCTION public.marathon_signup(uuid, text, text) TO anon, authenticated;
CREATE OR REPLACE FUNCTION public.submit_blogger_application(_name text, _blog_url text, _contact text, _audience text, _topic text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF length(trim(coalesce(_name,''))) < 2 OR length(_name) > 100 THEN RAISE EXCEPTION 'Укажите имя'; END IF;
  IF length(trim(coalesce(_blog_url,''))) < 4 OR length(_blog_url) > 300 THEN RAISE EXCEPTION 'Укажите ссылку на блог'; END IF;
  IF length(trim(coalesce(_contact,''))) < 3 OR length(_contact) > 100 THEN RAISE EXCEPTION 'Укажите контакт'; END IF;
  INSERT INTO public.blogger_applications(name, blog_url, contact, audience, topic)
  VALUES (trim(_name), trim(_blog_url), trim(_contact), left(coalesce(_audience,''),100), left(coalesce(_topic,''),300));
  RETURN 'ok';
END $$;
GRANT EXECUTE ON FUNCTION public.submit_blogger_application(text, text, text, text, text) TO anon, authenticated;
CREATE TABLE public.minigame_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage text NOT NULL CONSTRAINT minigame_cards_stage_check CHECK (stage IN ('znakomstvo','sposoby','svidanie','vstrechatsya','zhit','sex','usloviya','navyki')),
  gender text NOT NULL CHECK (gender IN ('male','female','any')),
  image_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.minigame_cards TO authenticated;
GRANT ALL ON public.minigame_cards TO service_role;
ALTER TABLE public.minigame_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage minigame cards" ON public.minigame_cards FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.minigame_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount_rub integer NOT NULL DEFAULT 500,
  payment_id text,
  payment_status text NOT NULL DEFAULT 'pending',
  used_at timestamptz, paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.minigame_purchases TO authenticated;
GRANT ALL ON public.minigame_purchases TO service_role;
ALTER TABLE public.minigame_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own purchases" ON public.minigame_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read purchases" ON public.minigame_purchases FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.minigame_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  free boolean NOT NULL DEFAULT false,
  purchase_id uuid REFERENCES public.minigame_purchases(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.minigame_sessions TO authenticated;
GRANT ALL ON public.minigame_sessions TO service_role;
ALTER TABLE public.minigame_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own sessions" ON public.minigame_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read sessions" ON public.minigame_sessions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins upload minigame cards" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'minigame-cards' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read minigame cards" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'minigame-cards' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete minigame cards" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'minigame-cards' AND public.has_role(auth.uid(), 'admin'));
CREATE OR REPLACE FUNCTION public.focus_group_feed()
RETURNS TABLE (first_name text, project text, stage text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT split_part(c.name, ' ', 1), trim(substring(c.source from 'Фокус-группа: (.*)')), c.stage, c.created_at
  FROM public.crm_contacts c WHERE c.source LIKE 'Фокус-группа:%'
  ORDER BY c.created_at DESC LIMIT 30
$$;
GRANT EXECUTE ON FUNCTION public.focus_group_feed() TO anon, authenticated;
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE TABLE public.channel_posts (
  message_id bigint PRIMARY KEY,
  text text NOT NULL,
  vk_post_id bigint,
  posted_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.channel_posts TO anon, authenticated;
GRANT ALL ON public.channel_posts TO service_role;
ALTER TABLE public.channel_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads channel posts" ON public.channel_posts FOR SELECT TO anon, authenticated USING (true);
CREATE OR REPLACE FUNCTION public.announce_marathon_slot() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.published AND NEW.announced_at IS NULL AND NEW.starts_at > now() THEN
    PERFORM net.http_post(
      url := 'https://project--6d6758de-b184-403d-b5b3-b9f603863ce8-dev.lovable.app/api/public/telegram/announce',
      headers := '{"Content-Type":"application/json"}'::jsonb,
      body := jsonb_build_object('slot_id', NEW.id));
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER marathon_slot_announce AFTER INSERT OR UPDATE OF published ON public.marathon_slots
FOR EACH ROW EXECUTE FUNCTION public.announce_marathon_slot();
CREATE POLICY "Admins upload review videos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'video-reviews' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete review videos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'video-reviews' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins view review media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'video-reviews' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners view own review media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'video-reviews' AND owner_id = (select auth.uid()::text));
CREATE POLICY "Users upload own host review videos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'video-reviews' AND (storage.foldername(name))[1] = 'host-reviews' AND (storage.foldername(name))[2] = auth.uid()::text);
CREATE TABLE public.quest_progress (
  user_id uuid PRIMARY KEY,
  levels text[] NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.quest_progress TO authenticated;
GRANT ALL ON public.quest_progress TO service_role;
ALTER TABLE public.quest_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own quest select" ON public.quest_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own quest insert" ON public.quest_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own quest update" ON public.quest_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TABLE public.lead_notify_recipients (
  chat_id bigint PRIMARY KEY, username text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.lead_notify_recipients TO service_role;
ALTER TABLE public.lead_notify_recipients ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.host_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_slug text NOT NULL CHECK (char_length(host_slug) BETWEEN 1 AND 80),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 2 AND 80),
  body text NOT NULL DEFAULT '' CHECK (char_length(body) <= 2000),
  video_path text,
  image_path text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (char_length(body) >= 10 OR video_path IS NOT NULL)
);
GRANT SELECT ON public.host_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.host_reviews TO authenticated;
GRANT ALL ON public.host_reviews TO service_role;
ALTER TABLE public.host_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads approved host reviews" ON public.host_reviews FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "Authors read own host reviews" ON public.host_reviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read host reviews" ON public.host_reviews FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users submit pending host reviews" ON public.host_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Admins update host reviews" ON public.host_reviews FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete host reviews" ON public.host_reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Hosts publish own reviews" ON public.host_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'approved' AND host_slug = public.my_host_slug());
CREATE POLICY "Hosts delete own uploaded reviews" ON public.host_reviews FOR DELETE TO authenticated USING (auth.uid() = user_id AND host_slug = public.my_host_slug());
CREATE INDEX host_reviews_slug_idx ON public.host_reviews (host_slug, status);
CREATE TABLE public.member_contacts (
  user_id uuid PRIMARY KEY,
  contact text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.member_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user uuid NOT NULL, to_user uuid NOT NULL,
  kind text NOT NULL DEFAULT 'group',
  status text NOT NULL DEFAULT 'pending',
  questions text[] NOT NULL, from_answers int[] NOT NULL, to_answers int[],
  amount_rub integer, payment_id text, payment_status text NOT NULL DEFAULT 'none', paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.member_contacts TO authenticated;
GRANT ALL ON public.member_contacts TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.member_invites TO authenticated;
GRANT ALL ON public.member_invites TO service_role;
ALTER TABLE public.member_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_invites ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.invite_matched(_a uuid, _b uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.member_invites WHERE status = 'matched'
    AND ((from_user = _a AND to_user = _b) OR (from_user = _b AND to_user = _a)))
$$;
CREATE POLICY "Own contact" ON public.member_contacts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Matched see contact" ON public.member_contacts FOR SELECT TO authenticated USING (public.invite_matched(auth.uid(), user_id));
CREATE POLICY "Admins read contacts" ON public.member_contacts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Parties read invites" ON public.member_invites FOR SELECT TO authenticated USING (auth.uid() = from_user OR auth.uid() = to_user);
CREATE POLICY "Admins read invites" ON public.member_invites FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Free members invite visible people" ON public.member_invites FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = from_user AND status = 'pending' AND kind IN ('group','individual')
    AND public.member_can_see(auth.uid(), to_user)
    AND EXISTS (SELECT 1 FROM public.member_profiles WHERE user_id = auth.uid() AND status = 'free'));
CREATE POLICY "Invitee answers" ON public.member_invites FOR UPDATE TO authenticated USING (auth.uid() = to_user) WITH CHECK (auth.uid() = to_user);
CREATE OR REPLACE FUNCTION public.guard_member_invite()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE same int := 0; i int;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF array_length(NEW.questions,1) <> 3 OR array_length(NEW.from_answers,1) <> 3 THEN RAISE EXCEPTION 'Нужно ответить на 3 вопроса'; END IF;
    NEW.to_answers := NULL; NEW.payment_id := NULL; NEW.payment_status := 'none'; NEW.paid_at := NULL;
    NEW.amount_rub := CASE WHEN NEW.kind = 'individual' THEN 5000 ELSE NULL END;
    RETURN NEW;
  END IF;
  IF auth.uid() IS NOT NULL THEN
    IF OLD.status <> 'pending' THEN RAISE EXCEPTION 'Приглашение уже обработано'; END IF;
    NEW.from_user := OLD.from_user; NEW.to_user := OLD.to_user; NEW.kind := OLD.kind; NEW.questions := OLD.questions;
    NEW.from_answers := OLD.from_answers; NEW.amount_rub := OLD.amount_rub; NEW.payment_id := OLD.payment_id;
    NEW.payment_status := OLD.payment_status; NEW.paid_at := OLD.paid_at; NEW.created_at := OLD.created_at;
    IF NEW.status = 'declined' THEN NEW.to_answers := NULL;
    ELSE
      IF NEW.to_answers IS NULL OR array_length(NEW.to_answers,1) <> 3 THEN RAISE EXCEPTION 'Ответьте на 3 вопроса'; END IF;
      FOR i IN 1..3 LOOP IF NEW.to_answers[i] = OLD.from_answers[i] THEN same := same + 1; END IF; END LOOP;
      NEW.status := CASE WHEN same >= 2 THEN 'matched' ELSE 'mismatch' END;
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER guard_member_invite BEFORE INSERT OR UPDATE ON public.member_invites FOR EACH ROW EXECUTE FUNCTION public.guard_member_invite();
CREATE TABLE public.landing_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landing text NOT NULL,
  utm_source text NOT NULL DEFAULT '', utm_campaign text NOT NULL DEFAULT '', referrer text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX landing_visits_landing_idx ON public.landing_visits (landing, created_at DESC);
GRANT SELECT ON public.landing_visits TO authenticated;
GRANT ALL ON public.landing_visits TO service_role;
ALTER TABLE public.landing_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read landing visits" ON public.landing_visits FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.host_challenge (
  user_id uuid PRIMARY KEY DEFAULT auth.uid(),
  done text[] NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.host_challenge TO authenticated;
GRANT ALL ON public.host_challenge TO service_role;
ALTER TABLE public.host_challenge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own challenge read" ON public.host_challenge FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own challenge insert" ON public.host_challenge FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own challenge update" ON public.host_challenge FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TABLE public.landing_hosts (landing text PRIMARY KEY, host_slug text NOT NULL);
GRANT ALL ON public.landing_hosts TO service_role;
ALTER TABLE public.landing_hosts ENABLE ROW LEVEL SECURITY;
INSERT INTO public.landing_hosts VALUES ('irkutsk-natalya','natalya-kireeva'),('spb-natalya','natalya-vanyushkina'),('volgograd-marina','marina-kravchenko'),('sochi-yulia','yulia-novitskaya');
CREATE OR REPLACE FUNCTION public.my_host_leads()
RETURNS TABLE(id uuid, name text, contact text, source text, notes text, host_status text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.name, c.phone, c.source, c.notes, c.host_status, c.created_at FROM public.crm_contacts c
  WHERE c.host_slug IS NOT NULL AND c.host_slug = public.my_host_slug() ORDER BY c.created_at DESC LIMIT 200
$$;
CREATE OR REPLACE FUNCTION public.set_my_lead_status(_id uuid, _status text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _status NOT IN ('new','contacted','booked','came','declined') THEN RAISE EXCEPTION 'invalid status'; END IF;
  UPDATE public.crm_contacts SET host_status = _status, updated_at = now() WHERE id = _id AND host_slug IS NOT NULL AND host_slug = public.my_host_slug();
  RETURN FOUND;
END $$;
CREATE OR REPLACE FUNCTION public.my_host_stats(_days int)
RETURNS TABLE(visits bigint, leads bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    (SELECT count(*) FROM public.landing_visits v JOIN public.landing_hosts h ON h.landing = v.landing WHERE h.host_slug = public.my_host_slug() AND v.created_at > now() - make_interval(days => greatest(1, least(_days, 365)))),
    (SELECT count(*) FROM public.crm_contacts c WHERE c.host_slug = public.my_host_slug() AND c.created_at > now() - make_interval(days => greatest(1, least(_days, 365))))
$$;
REVOKE EXECUTE ON FUNCTION public.my_host_leads(), public.set_my_lead_status(uuid,text), public.my_host_stats(int) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.my_host_leads(), public.set_my_lead_status(uuid,text), public.my_host_stats(int) TO authenticated;
CREATE TABLE public.event_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.facilitator_events(id) ON DELETE CASCADE,
  name text NOT NULL, contact text NOT NULL,
  tg_chat_id bigint, reminded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_signups TO authenticated;
GRANT ALL ON public.event_signups TO service_role;
ALTER TABLE public.event_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hosts read own event signups" ON public.event_signups FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.facilitator_events e WHERE e.id = event_id AND e.facilitator_slug = public.my_host_slug()));
CREATE OR REPLACE FUNCTION public.event_signup(_event_id uuid, _name text, _contact text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE cap int; n int; new_id uuid;
BEGIN
  IF length(trim(coalesce(_name,''))) < 2 OR length(_name) > 100 THEN RAISE EXCEPTION 'Укажите имя'; END IF;
  IF length(trim(coalesce(_contact,''))) < 3 OR length(_contact) > 100 THEN RAISE EXCEPTION 'Укажите телефон или Telegram'; END IF;
  SELECT capacity INTO cap FROM public.facilitator_events WHERE id = _event_id AND starts_at > now() FOR UPDATE;
  IF cap IS NULL THEN RAISE EXCEPTION 'Игра недоступна'; END IF;
  SELECT count(*) INTO n FROM public.event_signups WHERE event_id = _event_id;
  IF n >= cap THEN RAISE EXCEPTION 'Мест нет'; END IF;
  INSERT INTO public.event_signups(event_id, name, contact) VALUES (_event_id, trim(_name), trim(_contact)) RETURNING id INTO new_id;
  RETURN new_id::text;
END $$;
CREATE OR REPLACE FUNCTION public.event_seats_taken(_event_ids uuid[])
RETURNS TABLE(event_id uuid, taken int) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.event_id, count(*)::int FROM public.event_signups s WHERE s.event_id = ANY(_event_ids) GROUP BY s.event_id
$$;
GRANT EXECUTE ON FUNCTION public.event_signup(uuid,text,text), public.event_seats_taken(uuid[]) TO anon, authenticated;