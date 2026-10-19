import { ConsentFields } from "@/components/consent-fields";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Ban, Flag, Heart, MessageCircle, Send, UserRound } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clubNotify } from "@/lib/telegram-webapp.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseAuthPanel } from "@/components/course-auth-panel";
import { ClubInvites, InviteButton } from "@/components/club-invites";

type Profile = { user_id: string; gender: string; display_name: string; account_type: string; status: string; city: string; about: string; photo_path: string | null };
type Msg = { id: string; sender: string; recipient: string; body: string; created_at: string };

const statusText: Record<string, string> = { free: "Свободен(на)", couple: "В паре", family: "Семья" };
const genderText: Record<string, string> = { male: "Мужчина", female: "Девушка" };
const typeText: Record<string, string> = { single: "Один человек", couple: "Аккаунт пары", family: "Семья" };

async function photoUrls(paths: (string | null)[]) {
  const list = paths.filter(Boolean) as string[];
  if (!list.length) return {} as Record<string, string>;
  const { data } = await supabase.storage.from("member-photos").createSignedUrls(list, 3600);
  return Object.fromEntries((data ?? []).flatMap((d) => (d.signedUrl && d.path ? [[d.path, d.signedUrl] as const] : []))) as Record<string, string>;
}

export function Community() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [me, setMe] = useState<Profile | null>(null);

  const loadMe = useCallback(async (u: User | null) => {
    if (!u) { setMe(null); return; }
    const { data } = await supabase.from("member_profiles").select("user_id,display_name,account_type,status,city,about,photo_path,gender").eq("user_id", u.id).maybeSingle();
    setMe(data);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => { setUser(data.user); await loadMe(data.user); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setUser(s?.user ?? null); void loadMe(s?.user ?? null); });
    return () => sub.subscription.unsubscribe();
  }, [loadMe]);

  if (!ready) return <p className="py-20 text-center text-muted-foreground">Загрузка…</p>;
  if (!user) return <CourseAuthPanel title="Клуб знакомств «Раппóрт»" note="Войдите, чтобы заполнить анкету, знакомиться с участниками и приглашать друг друга на игры, чтобы узнать друг друга получше. Только для тех, кому есть 18." returnPath="/community" />;
  if (!me) return <ProfileForm user={user} onSaved={() => loadMe(user)} />;

  if (me.status !== "free") return <div className="py-6"><p className="mx-auto max-w-2xl rounded-xl border border-primary/40 bg-secondary p-5 text-sm">Клуб знакомств — только для тех, кто свободен и в поиске. Чтобы знакомиться, отметьте в анкете, что вы свободны.</p><ProfileForm user={user} existing={me} onSaved={() => loadMe(user)} /></div>;

  return <Tabs defaultValue="people" className="py-6">
    <TabsList className="flex-wrap"><TabsTrigger value="people">Знакомства</TabsTrigger><TabsTrigger value="invites">Приглашения на игру</TabsTrigger><TabsTrigger value="matches">Симпатии и сообщения</TabsTrigger><TabsTrigger value="profile">Моя анкета</TabsTrigger></TabsList>
    <TabsContent value="people"><People me={me} /></TabsContent>
    <TabsContent value="invites"><ClubInvites me={me} /></TabsContent>
    <TabsContent value="matches"><Matches me={me} /></TabsContent>
    <TabsContent value="profile"><ProfileForm user={user} existing={me} onSaved={() => loadMe(user)} />
      <Button variant="ghost" className="mt-4" onClick={() => supabase.auth.signOut()}>Выйти</Button></TabsContent>
  </Tabs>;
}

function ProfileForm({ user, existing, onSaved }: { user: User; existing?: Profile; onSaved: () => void }) {
  const [name, setName] = useState(existing?.display_name ?? "");
  const type = "single"; const status = "free";
  const [contact, setContact] = useState("");
  useEffect(() => { void supabase.from("member_contacts").select("contact").eq("user_id", user.id).maybeSingle().then(({ data }) => setContact(data?.contact ?? "")); }, [user.id]);
  const [city, setCity] = useState(existing?.city ?? "");
  const [gender, setGender] = useState(existing?.gender ?? "");
  const [about, setAbout] = useState(existing?.about ?? "");
  const [adult, setAdult] = useState(!!existing);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);


  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!adult) { toast.error("Подтвердите, что вам есть 18 лет"); return; }
    if (!gender) { toast.error("Укажите пол"); return; }
    setBusy(true);
    let photo_path = existing?.photo_path ?? null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setBusy(false); toast.error("Фото до 5 МБ"); return; }
      const path = `${user.id}/${Date.now()}.${file.name.split(".").pop()?.toLowerCase() || "jpg"}`;
      const { error } = await supabase.storage.from("member-photos").upload(path, file, { upsert: true, contentType: file.type });
      if (error) { setBusy(false); toast.error("Не удалось загрузить фото"); return; }
      photo_path = path;
    }
    const row = { user_id: user.id, display_name: name.trim(), account_type: type, status, gender, city: city.trim(), about: about.trim(), photo_path, is_adult: true };
    const { error } = existing ? await supabase.from("member_profiles").update(row).eq("user_id", user.id) : await supabase.from("member_profiles").insert(row);
    if (!error) await supabase.from("member_contacts").upsert({ user_id: user.id, contact: contact.trim().slice(0, 150), updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) { toast.error("Не удалось сохранить анкету"); return; }
    toast.success("Анкета сохранена"); onSaved();
  }

  return <form onSubmit={submit} className="mx-auto mt-6 grid max-w-2xl gap-5 rounded-xl border border-border bg-card p-7">
    <h2 className="font-display text-4xl">{existing ? "Моя анкета" : "Заполните анкету"}</h2>
    <p className="text-sm text-muted-foreground">Клуб знакомств — для тех, кто свободен и в поиске.</p>
    <div className="space-y-2"><Label htmlFor="p-name">Имя</Label><Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} /></div>
    <div className="space-y-2"><Label>Пол</Label><Select value={gender} onValueChange={setGender}><SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger><SelectContent>{Object.entries(genderText).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
    <div className="space-y-2"><Label htmlFor="p-contact">Контакт для связи (Telegram или телефон)</Label><Input id="p-contact" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={150} /><p className="text-xs text-muted-foreground">Виден только тем, с кем совпали ответы в приглашении на игру.</p></div>
    <div className="space-y-2"><Label htmlFor="p-city">Город</Label><Input id="p-city" value={city} onChange={(e) => setCity(e.target.value)} maxLength={80} /></div>
    <div className="space-y-2"><Label htmlFor="p-about">О себе</Label><Textarea id="p-about" value={about} onChange={(e) => setAbout(e.target.value)} maxLength={1000} placeholder="Чем увлекаетесь, кого хотите встретить" /></div>
    <div className="space-y-2"><Label htmlFor="p-photo">Фото</Label><Input id="p-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
    {!existing && <label className="flex items-start gap-3 text-sm"><Checkbox checked={adult} onCheckedChange={(v) => setAdult(v === true)} />Мне есть 18 лет, я согласен(на) с обработкой данных и правилами клуба</label>}
<ConsentFields />
    <Button type="submit" disabled={busy}>Сохранить анкету</Button>
  </form>;
}

function People({ me }: { me: Profile }) {
  const [people, setPeople] = useState<Profile[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    const { data } = await supabase.from("member_profiles").select("user_id,display_name,account_type,status,city,about,photo_path,gender").neq("user_id", me.user_id).order("created_at", { ascending: false }).limit(60);
    setPeople(data ?? []); setPhotos(await photoUrls((data ?? []).map((p) => p.photo_path)));
    const { data: l } = await supabase.from("member_likes").select("to_user").eq("from_user", me.user_id);
    setLiked((l ?? []).map((x) => x.to_user));
  }, [me.user_id]);
  useEffect(() => { void load(); }, [load]);

  async function like(id: string) {
    const { error } = await supabase.from("member_likes").insert({ from_user: me.user_id, to_user: id });
    if (error) { toast.error("Не получилось"); return; }
    void clubNotify({ data: { kind: "like", id } }).catch(() => {});
    const { data } = await supabase.from("member_likes").select("from_user").eq("from_user", id).eq("to_user", me.user_id).maybeSingle();
    toast.success(data ? "Взаимная симпатия! Теперь можно написать" : "Симпатия отправлена");
    setLiked((l) => [...l, id]);
  }
  async function block(id: string) {
    await supabase.from("member_blocks").insert({ blocker: me.user_id, blocked: id });
    toast.success("Пользователь заблокирован"); void load();
  }
  async function report(id: string) {
    const reason = window.prompt("Опишите причину жалобы");
    if (!reason || reason.trim().length < 3) return;
    const { error } = await supabase.from("member_reports").insert({ reporter: me.user_id, reported: id, reason: reason.trim().slice(0, 1000) });
    if (!error) toast.success("Жалоба отправлена модератору");
  }

  const shown = people.filter((p) => p.status === "free");
  const options = me.status === "free" ? ["free"] : ["couple", "family"];

  return <div className="mt-6">
    {options.length > 1 && <div className="mb-6 flex gap-2">{["all", ...options].map((o) => <Button key={o} size="sm" variant={filter === o ? "default" : "outline"} onClick={() => setFilter(o)}>{o === "all" ? "Все" : o === "couple" ? "Пары" : "Семьи"}</Button>)}</div>}
    {shown.length === 0 ? <p className="py-16 text-center text-muted-foreground">Пока здесь никого нет — пригласите друзей в клуб.</p> :
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{shown.map((p) => <article key={p.user_id} className="overflow-hidden rounded-xl border border-border bg-card">
      {p.photo_path && photos[p.photo_path] ? <img src={photos[p.photo_path]} alt={p.display_name} className="aspect-[4/5] w-full object-cover" /> : <div className="flex aspect-[4/5] items-center justify-center bg-secondary"><UserRound className="size-16 text-muted-foreground" /></div>}
      <div className="space-y-2 p-5"><h3 className="font-display text-2xl">{p.display_name}</h3>
        <p className="text-xs uppercase tracking-widest text-primary">{genderText[p.gender] ? `${genderText[p.gender]} · ` : ""}{statusText[p.status]}{p.city && ` · ${p.city}`}</p>
        {p.about && <p className="line-clamp-3 text-sm text-muted-foreground">{p.about}</p>}
        <div className="flex items-center gap-2 pt-2">
          <Button size="sm" disabled={liked.includes(p.user_id)} onClick={() => like(p.user_id)}><Heart />{liked.includes(p.user_id) ? "Симпатия отправлена" : "Симпатия"}</Button>
          <InviteButton me={me} to={p} />
          <Button size="icon" variant="ghost" aria-label="Пожаловаться" onClick={() => report(p.user_id)}><Flag /></Button>
          <Button size="icon" variant="ghost" aria-label="Заблокировать" onClick={() => block(p.user_id)}><Ban /></Button>
        </div></div>
    </article>)}</div>}
  </div>;
}

function Matches({ me }: { me: Profile }) {
  const [matches, setMatches] = useState<Profile[]>([]);
  const [active, setActive] = useState<Profile | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  useEffect(() => { (async () => {
    const { data: likes } = await supabase.from("member_likes").select("from_user,to_user");
    const out = new Set((likes ?? []).filter((l) => l.from_user === me.user_id).map((l) => l.to_user));
    const mutual = (likes ?? []).filter((l) => l.to_user === me.user_id && out.has(l.from_user)).map((l) => l.from_user);
    if (!mutual.length) return;
    const { data } = await supabase.from("member_profiles").select("user_id,display_name,account_type,status,city,about,photo_path,gender").in("user_id", mutual);
    setMatches(data ?? []);
  })(); }, [me.user_id]);

  const loadMsgs = useCallback(async (other: string) => {
    const { data } = await supabase.from("member_messages").select("*").or(`and(sender.eq.${me.user_id},recipient.eq.${other}),and(sender.eq.${other},recipient.eq.${me.user_id})`).order("created_at");
    setMsgs(data ?? []);
  }, [me.user_id]);
  useEffect(() => { if (!active) return; void loadMsgs(active.user_id); const t = setInterval(() => loadMsgs(active.user_id), 5000); return () => clearInterval(t); }, [active, loadMsgs]);

  async function send(e: FormEvent) {
    e.preventDefault(); if (!active || !text.trim()) return;
    const { data: sent, error } = await supabase.from("member_messages").insert({ sender: me.user_id, recipient: active.user_id, body: text.trim().slice(0, 2000) }).select("id").single();
    if (error) { toast.error("Сообщение не отправлено"); return; }
    if (sent) void clubNotify({ data: { kind: "message", id: sent.id } }).catch(() => {});
    setText(""); void loadMsgs(active.user_id);
  }

  if (!matches.length) return <p className="py-16 text-center text-muted-foreground">Взаимных симпатий пока нет. Когда симпатия станет взаимной, здесь откроется переписка.</p>;
  return <div className="mt-6 grid gap-6 md:grid-cols-[16rem_1fr]">
    <div className="space-y-2">{matches.map((m) => <button key={m.user_id} onClick={() => setActive(m)} className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left ${active?.user_id === m.user_id ? "border-primary" : "border-border"}`}><MessageCircle className="size-4 text-primary" />{m.display_name}</button>)}</div>
    <div className="rounded-xl border border-border bg-card p-5">{active ? <>
      <p className="font-display text-2xl">{active.display_name}</p>
      <div className="my-4 max-h-96 space-y-2 overflow-y-auto">{msgs.map((m) => <p key={m.id} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.sender === me.user_id ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary"}`}>{m.body}</p>)}</div>
      <form onSubmit={send} className="flex gap-2"><Input value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder="Сообщение" /><Button type="submit" size="icon" aria-label="Отправить"><Send /></Button></form>
      <p className="mt-3 text-xs text-muted-foreground">Хотите встретиться вживую? Закажите игру для двоих у ведущего в своём городе.</p>
    </> : <p className="text-muted-foreground">Выберите собеседника</p>}</div>
  </div>;
}
