CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN public.has_role(auth.uid(), 'admin');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin') ON CONFLICT DO NOTHING;
  RETURN public.has_role(auth.uid(), 'admin');
END;
$$;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE TABLE public.video_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 120),
  participant text NOT NULL DEFAULT 'Участник игры' CHECK (char_length(participant) BETWEEN 2 AND 100),
  video_url text NOT NULL CHECK (char_length(video_url) BETWEEN 10 AND 500),
  thumbnail_url text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.video_reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.video_reviews TO authenticated;
GRANT ALL ON public.video_reviews TO service_role;
ALTER TABLE public.video_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published video reviews are public" ON public.video_reviews FOR SELECT TO anon, authenticated USING (is_published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can add video reviews" ON public.video_reviews FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update video reviews" ON public.video_reviews FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete video reviews" ON public.video_reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX video_reviews_public_order_idx ON public.video_reviews (is_published, sort_order, created_at DESC);
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;
CREATE TABLE public.facilitator_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  city text NOT NULL CHECK (char_length(city) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 30),
  interest text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.facilitator_applications ADD CONSTRAINT facilitator_applications_interest_check CHECK (interest = ANY (ARRAY['Пакет «Ведущий»','Пакет «Под ключ»','Пакет «Инвестор»','Проведение игр','Обучение ведущих','Академия Раппóрт','Индивидуальное сопровождение','Покупка комплекта','Партнёрство','Другое']));
GRANT SELECT, UPDATE, DELETE ON public.facilitator_applications TO authenticated;
GRANT ALL ON public.facilitator_applications TO service_role;
ALTER TABLE public.facilitator_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read facilitator applications" ON public.facilitator_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update facilitator applications" ON public.facilitator_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete facilitator applications" ON public.facilitator_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX facilitator_applications_status_created_idx ON public.facilitator_applications (status, created_at DESC);
CREATE TABLE public.course_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  video_url text,
  video_path text,
  homework_prompt text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  course text NOT NULL DEFAULT 'otnosheniya' CHECK (course IN ('otnosheniya','zhivaya','beauty','business')),
  cover_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.course_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE DEFAULT upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  note text NOT NULL DEFAULT '',
  used_by uuid,
  used_at timestamptz,
  facilitator_slug text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.course_students (
  user_id uuid PRIMARY KEY,
  email text,
  invite_id uuid REFERENCES public.course_invites(id) ON DELETE SET NULL,
  facilitator_slug text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.course_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  answer_text text NOT NULL DEFAULT '',
  file_path text,
  file_name text,
  status text NOT NULL DEFAULT 'pending',
  feedback text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lesson_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_lessons, public.course_invites, public.course_students, public.course_submissions TO authenticated;
GRANT ALL ON public.course_lessons, public.course_invites, public.course_students, public.course_submissions TO service_role;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_submissions ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.is_course_student(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.course_students WHERE user_id = _user_id)
$$;
CREATE OR REPLACE FUNCTION public.course_lesson_unlocked(_user_id uuid, _lesson_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_course_student(_user_id) AND EXISTS (
    SELECT 1 FROM public.course_lessons l
    WHERE l.id = _lesson_id AND l.is_published
      AND NOT EXISTS (
        SELECT 1 FROM public.course_lessons p
        WHERE p.is_published AND p.course = l.course AND (p.position, p.created_at, p.id) < (l.position, l.created_at, l.id)
          AND NOT EXISTS (SELECT 1 FROM public.course_submissions s WHERE s.lesson_id = p.id AND s.user_id = _user_id AND s.status = 'approved')
      )
  )
$$;
CREATE OR REPLACE FUNCTION public.course_outline()
RETURNS TABLE (id uuid, title text, lesson_position integer, unlocked boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT l.id, l.title, l.position, public.course_lesson_unlocked(auth.uid(), l.id)
  FROM public.course_lessons l
  WHERE l.is_published AND public.is_course_student(auth.uid())
  ORDER BY l.position, l.created_at, l.id
$$;
CREATE OR REPLACE FUNCTION public.course_outline_by_game()
RETURNS TABLE(id uuid, title text, lesson_position integer, unlocked boolean, course text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT l.id, l.title, l.position, public.course_lesson_unlocked(auth.uid(), l.id), l.course
  FROM public.course_lessons l
  WHERE l.is_published AND public.is_course_student(auth.uid())
  ORDER BY l.course, l.position, l.created_at, l.id
$$;
CREATE OR REPLACE FUNCTION public.redeem_course_invite(_code text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _invite public.course_invites;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF public.is_course_student(auth.uid()) THEN RETURN true; END IF;
  SELECT * INTO _invite FROM public.course_invites WHERE code = upper(trim(_code)) AND used_by IS NULL FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  UPDATE public.course_invites SET used_by = auth.uid(), used_at = now() WHERE id = _invite.id;
  INSERT INTO public.course_students (user_id, email, invite_id, facilitator_slug) VALUES (auth.uid(), auth.jwt() ->> 'email', _invite.id, _invite.facilitator_slug);
  RETURN true;
END $$;
CREATE OR REPLACE FUNCTION public.my_host_slug()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT facilitator_slug FROM public.course_students WHERE user_id = auth.uid() AND facilitator_slug IS NOT NULL LIMIT 1
$$;
REVOKE EXECUTE ON FUNCTION public.redeem_course_invite(text), public.course_outline(), public.course_outline_by_game(), public.course_lesson_unlocked(uuid, uuid), public.is_course_student(uuid), public.my_host_slug() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.redeem_course_invite(text), public.course_outline(), public.course_outline_by_game(), public.course_lesson_unlocked(uuid, uuid), public.is_course_student(uuid), public.my_host_slug() TO authenticated;
CREATE POLICY "Admins manage lessons" ON public.course_lessons FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students read unlocked lessons" ON public.course_lessons FOR SELECT TO authenticated USING (public.course_lesson_unlocked(auth.uid(), id));
CREATE POLICY "Admins manage invites" ON public.course_invites FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage students" ON public.course_students FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students read own record" ON public.course_students FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage submissions" ON public.course_submissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students read own submissions" ON public.course_submissions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Students submit homework" ON public.course_submissions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.course_lesson_unlocked(auth.uid(), lesson_id));
CREATE POLICY "Students resubmit homework" ON public.course_submissions FOR UPDATE TO authenticated USING (user_id = auth.uid() AND status <> 'approved') WITH CHECK (user_id = auth.uid() AND public.course_lesson_unlocked(auth.uid(), lesson_id));
CREATE OR REPLACE FUNCTION public.guard_course_submission()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status NOT IN ('pending','approved','revision') THEN RAISE EXCEPTION 'invalid status'; END IF;
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := 'pending';
    NEW.feedback := CASE WHEN TG_OP = 'UPDATE' THEN OLD.feedback ELSE '' END;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER guard_course_submission BEFORE INSERT OR UPDATE ON public.course_submissions FOR EACH ROW EXECUTE FUNCTION public.guard_course_submission();
CREATE POLICY "Admins manage course videos" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students watch unlocked videos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'course-videos' AND EXISTS (SELECT 1 FROM public.course_lessons l WHERE l.video_path = storage.objects.name AND public.course_lesson_unlocked(auth.uid(), l.id)));
CREATE POLICY "Admins read homework files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'course-homework' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students upload own homework" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'course-homework' AND (storage.foldername(name))[1] = auth.uid()::text AND public.is_course_student(auth.uid()));
CREATE POLICY "Students read own homework" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'course-homework' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Admins update course students" ON public.course_students FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));