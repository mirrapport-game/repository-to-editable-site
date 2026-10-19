create table public.facilitators (
  slug text primary key, name text not null, city_slug text not null, city text not null,
  created_at timestamptz not null default now()
);
grant select on public.facilitators to anon, authenticated;
grant insert, update, delete on public.facilitators to authenticated;
grant all on public.facilitators to service_role;
alter table public.facilitators enable row level security;
create policy "Facilitators are public" on public.facilitators for select to anon, authenticated using (true);
create policy "Admins manage facilitators" on public.facilitators for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.facilitators (slug,name,city_slug,city) values ('natalya-kireeva','Наталья Киреева','irkutsk','Иркутск'), ('artem-efimov','Артём Ефимов','spb','Санкт-Петербург') on conflict do nothing;
create table public.game_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  facilitator_slug text not null references public.facilitators(slug),
  game text not null check (char_length(game) between 2 and 100),
  event_type text not null check (char_length(event_type) between 2 and 100),
  preferred_date text not null default '' check (char_length(preferred_date) <= 100),
  contact text not null check (char_length(contact) between 3 and 150),
  comment text not null default '' check (char_length(comment) <= 1000),
  status text not null default 'new' check (status in ('new','confirmed','completed','cancelled')),
  amount_rub integer, payment_id text, payment_status text not null default 'none', paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.game_orders to authenticated;
grant all on public.game_orders to service_role;
alter table public.game_orders enable row level security;
create policy "Users read own orders" on public.game_orders for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Users create own orders" on public.game_orders for insert to authenticated with check (user_id = auth.uid() and status = 'new');
create policy "Admins update orders" on public.game_orders for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "Admins delete orders" on public.game_orders for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create table public.facilitator_reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.game_orders(id) on delete cascade,
  user_id uuid not null,
  facilitator_slug text not null references public.facilitators(slug),
  author_name text not null check (char_length(author_name) between 2 and 80),
  rating int not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 3 and 2000),
  created_at timestamptz not null default now()
);
grant select on public.facilitator_reviews to anon, authenticated;
grant insert, delete on public.facilitator_reviews to authenticated;
grant all on public.facilitator_reviews to service_role;
alter table public.facilitator_reviews enable row level security;
create policy "Reviews are public" on public.facilitator_reviews for select to anon, authenticated using (true);
create policy "Review after completed game" on public.facilitator_reviews for insert to authenticated with check (
  user_id = auth.uid() and exists (select 1 from public.game_orders o where o.id = order_id and o.user_id = auth.uid() and o.status = 'completed' and o.facilitator_slug = facilitator_reviews.facilitator_slug)
);
create policy "Admins delete reviews" on public.facilitator_reviews for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create table public.member_profiles (
  user_id uuid primary key,
  display_name text not null check (char_length(display_name) between 2 and 80),
  account_type text not null default 'single' check (account_type in ('single','couple','family')),
  status text not null default 'free' check (status in ('free','couple','family')),
  city text not null default '' check (char_length(city) <= 80),
  about text not null default '' check (char_length(about) <= 1000),
  photo_path text,
  is_adult boolean not null check (is_adult),
  is_blocked boolean not null default false,
  gender text not null default '' check (gender in ('', 'male', 'female')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.member_profiles to authenticated;
grant all on public.member_profiles to service_role;
alter table public.member_profiles enable row level security;
create table public.member_blocks (
  blocker uuid not null, blocked uuid not null, created_at timestamptz not null default now(),
  primary key (blocker, blocked)
);
grant select, insert, delete on public.member_blocks to authenticated;
grant all on public.member_blocks to service_role;
alter table public.member_blocks enable row level security;
create policy "Own blocks" on public.member_blocks for select to authenticated using (blocker = auth.uid());
create policy "Create own blocks" on public.member_blocks for insert to authenticated with check (blocker = auth.uid() and blocked <> auth.uid());
create policy "Remove own blocks" on public.member_blocks for delete to authenticated using (blocker = auth.uid());
create or replace function public.members_blocked(_a uuid, _b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.member_blocks where (blocker=_a and blocked=_b) or (blocker=_b and blocked=_a))
$$;
create or replace function public.member_can_see(_viewer uuid, _target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.member_profiles v join public.member_profiles t on t.user_id = _target
    where v.user_id = _viewer and _viewer <> _target and not t.is_blocked and not v.is_blocked
      and not public.members_blocked(_viewer,_target)
      and ((v.status='free' and t.status='free') or (v.status in ('couple','family') and t.status in ('couple','family')))
  )
$$;
create policy "Read visible profiles" on public.member_profiles for select to authenticated using (user_id = auth.uid() or public.member_can_see(auth.uid(), user_id) or public.has_role(auth.uid(),'admin'));
create policy "Create own profile" on public.member_profiles for insert to authenticated with check (user_id = auth.uid() and is_blocked = false);
create policy "Update own profile" on public.member_profiles for update to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin')) with check (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Delete own profile" on public.member_profiles for delete to authenticated using (user_id = auth.uid());
create or replace function public.guard_member_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(),'admin') then new.is_blocked := old.is_blocked; end if;
  new.updated_at := now();
  return new;
end $$;
create trigger guard_member_profile before update on public.member_profiles for each row execute function public.guard_member_profile();
create table public.member_likes (
  from_user uuid not null, to_user uuid not null, created_at timestamptz not null default now(),
  primary key (from_user, to_user)
);
grant select, insert, delete on public.member_likes to authenticated;
grant all on public.member_likes to service_role;
alter table public.member_likes enable row level security;
create policy "See likes involving me" on public.member_likes for select to authenticated using (from_user = auth.uid() or to_user = auth.uid());
create policy "Like visible members" on public.member_likes for insert to authenticated with check (from_user = auth.uid() and public.member_can_see(auth.uid(), to_user));
create policy "Unlike" on public.member_likes for delete to authenticated using (from_user = auth.uid());
create or replace function public.members_matched(_a uuid, _b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.member_likes where from_user=_a and to_user=_b)
     and exists (select 1 from public.member_likes where from_user=_b and to_user=_a)
     and not public.members_blocked(_a,_b)
$$;
create table public.member_messages (
  id uuid primary key default gen_random_uuid(),
  sender uuid not null, recipient uuid not null,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index member_messages_pair_idx on public.member_messages (sender, recipient, created_at);
grant select, insert on public.member_messages to authenticated;
grant all on public.member_messages to service_role;
alter table public.member_messages enable row level security;
create policy "Read own conversations" on public.member_messages for select to authenticated using (sender = auth.uid() or recipient = auth.uid());
create policy "Write to matches" on public.member_messages for insert to authenticated with check (sender = auth.uid() and public.members_matched(auth.uid(), recipient));
create table public.member_reports (
  id uuid primary key default gen_random_uuid(),
  reporter uuid not null, reported uuid not null,
  reason text not null check (char_length(reason) between 3 and 1000),
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.member_reports to authenticated;
grant all on public.member_reports to service_role;
alter table public.member_reports enable row level security;
create policy "Create report" on public.member_reports for insert to authenticated with check (reporter = auth.uid());
create policy "Admins read reports" on public.member_reports for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins update reports" on public.member_reports for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "Members upload own photo" on storage.objects for insert to authenticated with check (bucket_id='member-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Members update own photo" on storage.objects for update to authenticated using (bucket_id='member-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Members delete own photo" on storage.objects for delete to authenticated using (bucket_id='member-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Members view visible photos" on storage.objects for select to authenticated using (
  bucket_id='member-photos' and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.member_can_see(auth.uid(), ((storage.foldername(name))[1])::uuid)
    or public.has_role(auth.uid(),'admin')
  )
);
CREATE TABLE public.crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  telegram text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT '',
  stage text NOT NULL DEFAULT 'observer' CHECK (stage IN ('observer','demo','player','intensive','game_purchase','package','investor')),
  amount numeric NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  next_step text NOT NULL DEFAULT '',
  next_date date,
  payment_id text, payment_status text, paid_at timestamptz,
  host_slug text, host_status text NOT NULL DEFAULT 'new',
  marketing_consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_contacts TO authenticated;
GRANT ALL ON public.crm_contacts TO service_role;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage crm" ON public.crm_contacts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.facilitator_telegram (
  facilitator_slug text PRIMARY KEY REFERENCES public.facilitators(slug) ON DELETE CASCADE,
  username text NOT NULL,
  chat_id bigint,
  last_asked_at timestamptz,
  last_reply_at timestamptz,
  first_name text NOT NULL DEFAULT '', utc_offset text NOT NULL DEFAULT '+03:00', time_zone text NOT NULL DEFAULT 'Europe/Moscow',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.facilitator_telegram TO authenticated;
GRANT ALL ON public.facilitator_telegram TO service_role;
ALTER TABLE public.facilitator_telegram ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read facilitator telegram" ON public.facilitator_telegram FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert facilitator telegram" ON public.facilitator_telegram FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update facilitator telegram" ON public.facilitator_telegram FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete facilitator telegram" ON public.facilitator_telegram FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.facilitator_telegram (facilitator_slug, username, first_name, utc_offset, time_zone) VALUES ('natalya-kireeva','nataigrarapport','Наталья','+08:00','Asia/Irkutsk') ON CONFLICT DO NOTHING;
CREATE TABLE public.facilitator_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facilitator_slug text NOT NULL REFERENCES public.facilitators(slug) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  game text NOT NULL DEFAULT '',
  place text NOT NULL DEFAULT '',
  capacity integer NOT NULL DEFAULT 12,
  host_reminded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX facilitator_events_slug_time ON public.facilitator_events (facilitator_slug, starts_at);
GRANT SELECT ON public.facilitator_events TO anon, authenticated;
GRANT INSERT, DELETE ON public.facilitator_events TO authenticated;
GRANT ALL ON public.facilitator_events TO service_role;
ALTER TABLE public.facilitator_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are public" ON public.facilitator_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Hosts add own events" ON public.facilitator_events FOR INSERT TO authenticated WITH CHECK (facilitator_slug = public.my_host_slug());
CREATE POLICY "Hosts delete own events" ON public.facilitator_events FOR DELETE TO authenticated USING (facilitator_slug = public.my_host_slug());
INSERT INTO public.facilitator_events (facilitator_slug, game, place, starts_at)
VALUES ('artem-efimov', 'Раппóрт Живая', 'Санкт-Петербург, лофт «Нежность», центр города · 12:00–15:00 · в перерыве перекус: роллы, фрукты, чай', '2026-10-18 09:00:00+00');
CREATE TABLE public.telegram_updates (
  update_id bigint PRIMARY KEY, chat_id bigint, text text, raw_update jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.telegram_updates TO service_role;
ALTER TABLE public.telegram_updates ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.box_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  game_slug text NOT NULL, contact text NOT NULL, city text NOT NULL,
  address text NOT NULL DEFAULT '',
  amount_rub integer NOT NULL,
  status text NOT NULL DEFAULT 'new',
  payment_id text, payment_status text NOT NULL DEFAULT 'none', paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.box_orders TO authenticated;
GRANT ALL ON public.box_orders TO service_role;
ALTER TABLE public.box_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own box orders" ON public.box_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own box orders" ON public.box_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage box orders" ON public.box_orders FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));