import { TelegramLogin } from "@/components/telegram-login";
import { useEffect, useState, type FormEvent } from "react";
import { LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import type { VideoReview } from "@/lib/video-reviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type FormState = { title: string; participant: string; video_url: string; thumbnail_url: string; sort_order: number; is_published: boolean };
const emptyForm: FormState = { title: "", participant: "Участник игры", video_url: "", thumbnail_url: "", sort_order: 0, is_published: false };

export function VideoReviewsManager() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reviews, setReviews] = useState<VideoReview[]>([]);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);

  async function uploadVideo(file: File) {
    if (file.size > 500 * 1024 * 1024) { toast.error("Файл больше 500 МБ"); return; }
    setUploading(1);
    const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("video-reviews").upload(path, file, { contentType: file.type || "video/mp4" });
    setUploading(0);
    if (error) { toast.error(error.message); return; }
    setForm((f) => ({ ...f, video_url: `upload:${path}` }));
    toast.success("Видео загружено — нажмите «Сохранить»");
  }

  async function loadManager() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    setUserEmail(user?.email ?? null);
    if (!user) { setIsAdmin(false); setReviews([]); setLoading(false); return; }
    const { data: claimed, error: claimError } = await supabase.rpc("claim_first_admin");
    if (claimError || !claimed) { setIsAdmin(false); setLoading(false); return; }
    setIsAdmin(true);
    const { data, error } = await supabase.from("video_reviews").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) toast.error("Не удалось загрузить ролики");
    setReviews(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void loadManager();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void loadManager();
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function submitAuth(event: FormEvent) {
    event.preventDefault();
    const result = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (result.error) { toast.error(result.error.message); return; }
    if (mode === "signup" && !result.data.session) toast.success("Проверьте почту и подтвердите регистрацию");
  }

  async function signInGoogle() {
    const redirect = `${window.location.origin}/manage-reviews`;
    // On Lovable hosting use managed Google sign-in; on a self-hosted server use the backend's own Google provider.
    if (!/(lovable\.app|lovableproject\.com|lovable\.dev)$/.test(window.location.hostname)) {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: redirect } });
      if (error) toast.error(error.message);
      return;
    }
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: redirect });
    if (result.error) toast.error(result.error.message);
    if (!result.redirected) window.location.href = "/manage-reviews";
  }

  function openCreate() { setEditingId(null); setForm({ ...emptyForm, sort_order: reviews.length }); setDialogOpen(true); }
  function openEdit(review: VideoReview) {
    setEditingId(review.id);
    setForm({ title: review.title, participant: review.participant, video_url: review.video_url, thumbnail_url: review.thumbnail_url ?? "", sort_order: review.sort_order, is_published: review.is_published });
    setDialogOpen(true);
  }

  async function saveReview(event: FormEvent) {
    event.preventDefault(); setSaving(true);
    const payload = { ...form, thumbnail_url: form.thumbnail_url.trim() || null, updated_at: new Date().toISOString() };
    const request = editingId ? supabase.from("video_reviews").update(payload).eq("id", editingId) : supabase.from("video_reviews").insert(payload);
    const { error } = await request;
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editingId ? "Видеоотзыв обновлён" : "Видеоотзыв добавлен");
    setDialogOpen(false); await loadManager();
  }

  async function togglePublished(review: VideoReview) {
    const { error } = await supabase.from("video_reviews").update({ is_published: !review.is_published, updated_at: new Date().toISOString() }).eq("id", review.id);
    if (error) { toast.error(error.message); return; }
    toast.success(review.is_published ? "Ролик снят с публикации" : "Ролик опубликован"); await loadManager();
  }

  async function removeReview(review: VideoReview) {
    if (!window.confirm(`Удалить «${review.title}»?`)) return;
    const { error } = await supabase.from("video_reviews").delete().eq("id", review.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Видеоотзыв удалён"); await loadManager();
  }

  if (loading) return <div className="py-24 text-center text-muted-foreground">Загрузка…</div>;
  if (!userEmail) return <div className="mx-auto max-w-md py-16">
    <div className="border border-border bg-card p-7"><h2 className="font-display text-4xl">Вход для владельца</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Войдите через Telegram аккаунтом владельца сайта.</p>
      <div className="mt-7"><TelegramLogin /></div>
    </div></div>;
  if (!isAdmin) return <div className="mx-auto max-w-xl py-20 text-center"><h2 className="font-display text-4xl">Нет доступа</h2><p className="mt-4 text-muted-foreground">Аккаунт {userEmail} не является владельцем этой страницы.</p><Button className="mt-6" variant="outline" onClick={()=>supabase.auth.signOut()}><LogOut/>Выйти</Button></div>;

  return <div className="py-12"><div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-muted-foreground">{userEmail}</p><h2 className="font-display text-4xl">Видеоотзывы</h2></div><div className="flex gap-2"><Button onClick={openCreate}><Plus/>Добавить ролик</Button><Button size="icon" variant="outline" onClick={()=>supabase.auth.signOut()} aria-label="Выйти"><LogOut/></Button></div></div>
    <div className="divide-y divide-border border-y border-border">{reviews.length === 0 && <p className="py-12 text-center text-muted-foreground">Пока нет видео. Добавьте первый ролик.</p>}{reviews.map(review=><article key={review.id} className="grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"><div><div className="flex flex-wrap items-center gap-3"><h3 className="font-display text-2xl">{review.title}</h3><span className={`text-xs font-semibold uppercase ${review.is_published ? "text-primary" : "text-muted-foreground"}`}>{review.is_published ? "Опубликован" : "Черновик"}</span></div><p className="mt-1 text-sm text-muted-foreground">{review.participant} · порядок {review.sort_order}</p><p className="mt-2 truncate text-xs text-muted-foreground">{review.video_url}</p></div><div className="flex items-center gap-2"><Label htmlFor={`publish-${review.id}`} className="mr-1">Показывать</Label><Switch id={`publish-${review.id}`} checked={review.is_published} onCheckedChange={()=>togglePublished(review)} /><Button size="icon" variant="outline" onClick={()=>openEdit(review)} aria-label="Редактировать"><Pencil/></Button><Button size="icon" variant="outline" onClick={()=>removeReview(review)} aria-label="Удалить"><Trash2/></Button></div></article>)}</div>
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent className="max-h-[90svh] overflow-y-auto"><DialogHeader><DialogTitle>{editingId ? "Редактировать видеоотзыв" : "Новый видеоотзыв"}</DialogTitle><DialogDescription>Загрузите видео с компьютера или телефона — или вставьте ссылку YouTube, Rutube, VK Video.</DialogDescription></DialogHeader><form onSubmit={saveReview} className="space-y-4"><div className="space-y-2"><Label htmlFor="review-title">Название</Label><Input id="review-title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required minLength={2} maxLength={120}/></div><div className="space-y-2"><Label htmlFor="review-person">Подпись</Label><Input id="review-person" value={form.participant} onChange={(e)=>setForm({...form,participant:e.target.value})} required maxLength={100}/></div><div className="space-y-2 border border-dashed border-primary/50 p-4"><Label htmlFor="review-file">Загрузить видео с устройства</Label><Input id="review-file" type="file" accept="video/*" disabled={uploading > 0} onChange={(e)=>{ const f = e.target.files?.[0]; if (f) void uploadVideo(f); }}/><p className="text-xs text-muted-foreground">{uploading ? "Загружаем видео… не закрывайте окно" : form.video_url.startsWith("upload:") ? "✓ Видео загружено на сайт" : "MP4, MOV или WEBM, до 500 МБ"}</p></div><div className="space-y-2"><Label htmlFor="review-url">…или ссылка на видео</Label><Input id="review-url" type="text" value={form.video_url} onChange={(e)=>setForm({...form,video_url:e.target.value})} required/></div><div className="space-y-2"><Label htmlFor="review-cover">Ссылка на обложку (необязательно)</Label><Input id="review-cover" type="url" value={form.thumbnail_url} onChange={(e)=>setForm({...form,thumbnail_url:e.target.value})}/></div><div className="grid grid-cols-2 items-end gap-4"><div className="space-y-2"><Label htmlFor="review-order">Порядок</Label><Input id="review-order" type="number" min={0} value={form.sort_order} onChange={(e)=>setForm({...form,sort_order:Number(e.target.value)})}/></div><div className="flex h-9 items-center gap-3"><Switch id="review-published" checked={form.is_published} onCheckedChange={(checked)=>setForm({...form,is_published:checked})}/><Label htmlFor="review-published">Опубликовать</Label></div></div><DialogFooter><Button type="button" variant="outline" onClick={()=>setDialogOpen(false)}>Отмена</Button><Button type="submit" disabled={saving || uploading > 0}>{saving ? "Сохраняем…" : "Сохранить"}</Button></DialogFooter></form></DialogContent></Dialog>
  </div>;
}