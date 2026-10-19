import { getReviewMediaUrl } from "@/lib/review-media.functions";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { submitGuestHostReview } from "@/lib/host-review-guest.functions";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { hostLandings } from "@/data/host-landings";

type HostReview = { id: string; host_slug: string; author_name: string; body: string; video_path: string | null; image_path?: string | null; status: string; created_at: string };

async function signHostMedia(path: string) {
  const { data } = await supabase.storage.from("video-reviews").createSignedUrl(path, 3600);
  if (data?.signedUrl) return data.signedUrl;
  return (await getReviewMediaUrl({ data: { path } })).url;
}

function ReviewImage({ path, alt }: { path: string; alt: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => { void signHostMedia(path).then(setSrc); }, [path]);
  return src ? <img src={src} alt={alt} loading="lazy" className="w-full rounded-lg" onContextMenu={(e) => e.preventDefault()} /> : null;
}

function ReviewVideo({ path }: { path: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => { void signHostMedia(path).then(setSrc); }, [path]);
  return src ? <video src={src} controls controlsList="nodownload" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} preload="metadata" className="aspect-video w-full rounded-lg bg-muted" /> : <div className="aspect-video w-full rounded-lg bg-muted" />;
}

export function HostReviewCard({ r }: { r: HostReview }) {
  return <figure className="game-testimonial space-y-3">
    {r.video_path && <ReviewVideo path={r.video_path} />}
    {r.image_path && <ReviewImage path={r.image_path} alt={`Отзыв: ${r.author_name}`} />}
    {r.body && <blockquote>{r.body}</blockquote>}
    <figcaption>{r.author_name}</figcaption>
  </figure>;
}

export const MALE_NAMES = ["Артём", "Артем", "Андрей", "Евгений", "Сергей", "Александр", "Роман"];
export const hostTitle = (name: string) => name.startsWith("Артём Ефимов") ? "ведущего и автора игр" : MALE_NAMES.includes(name.split(" ")[0] ?? "") && !name.includes(" и ") ? "ведущего" : "ведущей";

export function HostReviews({ slug, name, children }: { slug: string; name: string; children?: ReactNode }) {
  const male = MALE_NAMES.includes(name.split(" ")[0] ?? "") && !name.includes(" и ");
  const [list, setList] = useState<HostReview[]>([]);
  const [mine, setMine] = useState<HostReview[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("host_reviews").select("*").eq("host_slug", slug).eq("status", "approved").order("created_at", { ascending: false });
    setList(data ?? []);
    const { data: u } = await supabase.auth.getUser();
    setUserId(u.user?.id ?? null);
    if (u.user) {
      const { data: m } = await supabase.from("host_reviews").select("*").eq("host_slug", slug).eq("user_id", u.user.id).eq("status", "pending");
      setMine(m ?? []);
    } else setMine([]);
  }
  useEffect(() => { void load(); }, [slug]);

  return <section className="section border-t border-border"><div className="section-inner">
    <p className="eyebrow">Видео и отзывы участников</p>
    <h2 className="section-title">{name.startsWith("«") ? <>Отзывы об игре {name}</> : <>Как проходят игры у {hostTitle(name)} {name}</>}</h2>
    {children}
    {children ? <h3 className="mt-14 font-display text-3xl sm:text-4xl">Отзывы участников</h3> : null}
    {list.length ? <div className="game-testimonials mt-8">{list.map((r) => <HostReviewCard key={r.id} r={r} />)}</div>
      : <p className="mt-6 text-muted-foreground">Отзывов пока нет. Будьте первым!</p>}
    {mine.length > 0 && <p className="mt-6 text-sm text-primary">Ваш отзыв на проверке. Он появится здесь после одобрения.</p>}
    {userId ? <ReviewForm slug={slug} userId={userId} onDone={load} /> : <GuestReviewForm slug={slug} />}
  </div></section>;
}

function ReviewForm({ slug, userId, onDone }: { slug: string; userId: string; onDone: () => void }) {
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!file && body.trim().length < 10) { toast.error("Напишите хотя бы пару предложений или добавьте видео"); return; }
    if (file && file.size > 500 * 1024 * 1024) { toast.error("Видео до 500 МБ"); return; }
    setBusy(true);
    let video_path: string | null = null;
    if (file) {
      const path = `host-reviews/${userId}/${Date.now()}.${file.name.split(".").pop()?.toLowerCase() || "mp4"}`;
      const { error } = await supabase.storage.from("video-reviews").upload(path, file, { contentType: file.type || "video/mp4" });
      if (error) { setBusy(false); toast.error("Не удалось загрузить видео"); return; }
      video_path = path;
    }
    const { error } = await supabase.from("host_reviews").insert({ host_slug: slug, author_name: author.trim(), body: body.trim(), video_path, user_id: userId });
    setBusy(false);
    if (error) { toast.error("Не удалось отправить отзыв"); return; }
    toast.success("Спасибо! Отзыв появится после проверки");
    setAuthor(""); setBody(""); setFile(null); onDone();
  }

  return <form onSubmit={submit} className="mt-10 grid max-w-2xl gap-4 rounded-xl border border-border bg-card p-6">
    <h3 className="font-display text-2xl">Хотите оставить свой отзыв? Заполните форму</h3>
    <div className="space-y-2"><Label htmlFor="hr-name">Ваше имя</Label><Input id="hr-name" value={author} onChange={(e) => setAuthor(e.target.value)} required minLength={2} maxLength={80} /></div>
    <div className="space-y-2"><Label htmlFor="hr-body">Отзыв</Label><Textarea id="hr-body" value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} placeholder="Что вам запомнилось на игре?" /></div>
    <div className="space-y-2"><Label htmlFor="hr-video">Видео (необязательно)</Label><Input id="hr-video" type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /><p className="text-xs text-muted-foreground">MP4, MOV или WEBM, до 500 МБ</p></div>
    <Button type="submit" disabled={busy}>{busy ? "Отправляем…" : "Отправить на проверку"}</Button>
  </form>;
}

export function HostReviewsModeration() {
  const [list, setList] = useState<HostReview[]>([]);
  async function load() {
    const { data } = await supabase.from("host_reviews").select("*").eq("status", "pending").order("created_at");
    setList(data ?? []);
  }
  useEffect(() => { void load(); }, []);
  async function setStatus(id: string, status: "approved" | "rejected") {
    const { error } = await supabase.from("host_reviews").update({ status }).eq("id", id);
    if (error) toast.error("Не удалось сохранить"); else { toast.success(status === "approved" ? "Опубликовано" : "Отклонено"); void load(); }
  }
  return <section className="mt-12">
    <h2 className="font-display text-3xl">Отзывы о ведущих на проверке</h2>
    {list.length === 0 ? <p className="mt-4 text-muted-foreground">Новых отзывов нет.</p>
      : <div className="mt-6 grid gap-6 md:grid-cols-2">{list.map((r) => <div key={r.id} className="space-y-3 rounded-xl border border-border p-4">
        <p className="text-xs uppercase tracking-widest text-primary">Ведущий: {r.host_slug}</p>
        <HostReviewCard r={r} />
        <div className="flex gap-2"><Button size="sm" onClick={() => setStatus(r.id, "approved")}>Опубликовать</Button><Button size="sm" variant="outline" onClick={() => setStatus(r.id, "rejected")}>Отклонить</Button></div>
      </div>)}</div>}
  </section>;
}

export function HostOwnReviews() {
  const [slug, setSlug] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [list, setList] = useState<HostReview[]>([]);
  const [author, setAuthor] = useState(""); const [body, setBody] = useState(""); const [file, setFile] = useState<File | null>(null); const [busy, setBusy] = useState(false);
  async function load() {
    const { data: u } = await supabase.auth.getUser(); if (!u.user) return; setUserId(u.user.id);
    const { data: s } = await supabase.rpc("my_host_slug"); setSlug(s ?? null);
    if (s) { const { data } = await supabase.from("host_reviews").select("*").eq("host_slug", s).eq("user_id", u.user.id).order("created_at", { ascending: false }); setList(data ?? []); }
  }
  useEffect(() => { void load(); }, []);
  if (!slug || !userId) return null;
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!file && body.trim().length < 10) { toast.error("Добавьте текст отзыва, скриншот или видео"); return; }
    if (file && file.size > 500 * 1024 * 1024) { toast.error("Файл до 500 МБ"); return; }
    setBusy(true);
    let video_path: string | null = null, image_path: string | null = null;
    if (file) {
      const path = `host-reviews/${userId}/${Date.now()}.${file.name.split(".").pop()?.toLowerCase() || "jpg"}`;
      const { error } = await supabase.storage.from("video-reviews").upload(path, file, { contentType: file.type });
      if (error) { setBusy(false); toast.error("Не удалось загрузить файл"); return; }
      if (file.type.startsWith("image/")) image_path = path; else video_path = path;
    }
    const { error } = await supabase.from("host_reviews").insert({ host_slug: slug!, author_name: author.trim() || "Участник игры", body: body.trim(), video_path, image_path, user_id: userId!, status: "approved" });
    setBusy(false);
    if (error) { toast.error("Не удалось сохранить отзыв"); return; }
    toast.success("Отзыв опубликован на вашей странице"); setAuthor(""); setBody(""); setFile(null); void load();
  }
  async function remove(id: string) { const { error } = await supabase.from("host_reviews").delete().eq("id", id); if (error) toast.error("Не удалось удалить"); else void load(); }
  return <section className="mb-10 border border-border bg-card p-6">
    <h2 className="font-display text-3xl">Отзывы на моей странице</h2>
    <p className="mt-2 text-sm text-muted-foreground">Добавляйте отзывы участников: текст, скриншот переписки или видео. Они сразу появятся на вашей странице ведущего{hostLandings[slug] ? " и на вашей рекламной странице" : ""}.</p>
    {hostLandings[slug] && <p className="mt-3 text-sm">Ваша рекламная страница: <a className="text-primary underline" href={hostLandings[slug].path} target="_blank" rel="noreferrer">rapportgame.ru{hostLandings[slug].path}</a></p>}
    <form onSubmit={submit} className="mt-6 grid max-w-2xl gap-4">
      <div className="space-y-2"><Label htmlFor="ho-name">Имя участника</Label><Input id="ho-name" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={80} /></div>
      <div className="space-y-2"><Label htmlFor="ho-body">Текст отзыва (необязательно, если есть файл)</Label><Textarea id="ho-body" value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} /></div>
      <div className="space-y-2"><Label htmlFor="ho-file">Скриншот или видео</Label><Input id="ho-file" type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
      <Button type="submit" disabled={busy} className="justify-self-start">{busy ? "Загружаем…" : "Опубликовать отзыв"}</Button>
    </form>
    {list.length > 0 && <div className="game-testimonials mt-8">{list.map((r) => <div key={r.id} className="space-y-2"><HostReviewCard r={r} /><Button size="sm" variant="outline" onClick={() => remove(r.id)}>Удалить</Button></div>)}</div>}
  </section>;
}

function GuestReviewForm({ slug }: { slug: string }) {
  const [author, setAuthor] = useState(""); const [body, setBody] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (body.trim().length < 10) { toast.error("Напишите хотя бы пару предложений"); return; }
    setBusy(true);
    try { await submitGuestHostReview({ data: { hostSlug: slug, authorName: author, body } }); toast.success("Спасибо! Отзыв появится после проверки"); setAuthor(""); setBody(""); }
    catch { toast.error("Не удалось отправить отзыв"); }
    setBusy(false);
  }
  return <form onSubmit={submit} className="mt-10 grid max-w-2xl gap-4 rounded-xl border border-border bg-card p-6">
    <h3 className="font-display text-2xl">Хотите оставить свой отзыв? Заполните форму</h3>
    <div className="space-y-2"><Label htmlFor="gr-name">Ваше имя</Label><Input id="gr-name" value={author} onChange={(e) => setAuthor(e.target.value)} required minLength={2} maxLength={80} /></div>
    <div className="space-y-2"><Label htmlFor="gr-body">Отзыв</Label><Textarea id="gr-body" value={body} onChange={(e) => setBody(e.target.value)} required minLength={10} maxLength={2000} placeholder="Что вам запомнилось на игре?" /></div>
    <Button type="submit" disabled={busy}>{busy ? "Отправляем…" : "Отправить отзыв"}</Button>
  </form>;
}

export function HostLandingReviews({ slug }: { slug: string }) {
  const [list, setList] = useState<HostReview[]>([]);
  useEffect(() => { void supabase.from("host_reviews").select("*").eq("host_slug", slug).eq("status", "approved").order("created_at", { ascending: false }).then(({ data }) => setList(data ?? [])); }, [slug]);
  if (!list.length) return null;
  return <><p className="eyebrow">Отзывы моих участниц</p><div className="game-testimonials mt-6">{list.map((r) => <HostReviewCard key={r.id} r={r} />)}</div></>;
}
