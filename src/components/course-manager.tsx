import { useEffect, useState, type FormEvent } from "react";
import { Copy, LogOut, Paperclip, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { safeFileName, submissionStatusLabels, type CourseInvite, type CourseLesson, type CourseSubmission, type SubmissionStatus, COURSES, courseLabel } from "@/lib/course";
import { CourseAuthPanel } from "@/components/course-auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type LessonForm = { title: string; description: string; homework_prompt: string; video_url: string; video_path: string | null; position: number; is_published: boolean; course: string };
const emptyLesson: LessonForm = { title: "", description: "", homework_prompt: "", video_url: "", video_path: null, position: 0, is_published: false, course: "otnosheniya" };
type Student = { user_id: string; email: string | null; facilitator_slug?: string | null };

export function CourseManager() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [submissions, setSubmissions] = useState<CourseSubmission[]>([]);
  const [invites, setInvites] = useState<CourseInvite[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [dialog, setDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LessonForm>(emptyLesson);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [inviteNote, setInviteNote] = useState("");
  const [course, setCourse] = useState<string>("otnosheniya");

  async function load() {
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    setEmail(data.user?.email ?? null);
    if (!data.user) { setLoading(false); return; }
    const { data: admin } = await supabase.rpc("claim_first_admin");
    setIsAdmin(Boolean(admin));
    if (admin) {
      const [l, s, i, st] = await Promise.all([
        supabase.from("course_lessons").select("*").order("position").order("created_at"),
        supabase.from("course_submissions").select("*").order("updated_at", { ascending: false }),
        supabase.from("course_invites").select("*").order("created_at", { ascending: false }),
        supabase.from("course_students").select("user_id,email,facilitator_slug"),
      ]);
      setLessons(l.data ?? []); setSubmissions(s.data ?? []); setInvites(i.data ?? []); setStudents(st.data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void load();
    });
    return () => data.subscription.unsubscribe();
  }, []);

  function openCreate() { setEditingId(null); setForm({ ...emptyLesson, course, position: lessons.filter((x) => x.course === course).length + 1 }); setVideoFile(null); setDialog(true); }
  function openEdit(l: CourseLesson) {
    setEditingId(l.id); setVideoFile(null);
    setForm({ title: l.title, description: l.description, homework_prompt: l.homework_prompt, video_url: l.video_url ?? "", video_path: l.video_path, position: l.position, is_published: l.is_published, course: l.course });
    setDialog(true);
  }

  async function saveLesson(event: FormEvent) {
    event.preventDefault(); setSaving(true);
    let video_path = form.video_path;
    if (videoFile) {
      const path = `lessons/${safeFileName(videoFile.name)}`;
      const { error } = await supabase.storage.from("course-videos").upload(path, videoFile, { contentType: videoFile.type });
      if (error) { setSaving(false); toast.error(`Не удалось загрузить видео: ${error.message}`); return; }
      if (form.video_path) await supabase.storage.from("course-videos").remove([form.video_path]);
      video_path = path;
    }
    const payload = { ...form, video_path, video_url: form.video_url.trim() || null, updated_at: new Date().toISOString() };
    const { error } = editingId ? await supabase.from("course_lessons").update(payload).eq("id", editingId) : await supabase.from("course_lessons").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editingId ? "Урок обновлён" : "Урок добавлен"); setDialog(false); await load();
  }

  async function removeLesson(l: CourseLesson) {
    if (!window.confirm(`Удалить урок «${l.title}» вместе с домашними заданиями?`)) return;
    if (l.video_path) await supabase.storage.from("course-videos").remove([l.video_path]);
    const { error } = await supabase.from("course_lessons").delete().eq("id", l.id);
    if (error) toast.error(error.message); else await load();
  }

  async function togglePublish(l: CourseLesson) {
    const { error } = await supabase.from("course_lessons").update({ is_published: !l.is_published }).eq("id", l.id);
    if (error) toast.error(error.message); else await load();
  }

  async function createInvite() {
    const { error } = await supabase.from("course_invites").insert({ note: inviteNote.trim() });
    if (error) { toast.error(error.message); return; }
    setInviteNote(""); toast.success("Приглашение создано"); await load();
  }

  async function removeInvite(i: CourseInvite) {
    const { error } = await supabase.from("course_invites").delete().eq("id", i.id);
    if (error) toast.error(error.message); else await load();
  }

  function copyInvite(code: string) {
    void navigator.clipboard.writeText(`${window.location.origin}/course?invite=${code}`);
    toast.success("Ссылка скопирована");
  }

  if (loading) return <div className="py-24 text-center text-muted-foreground">Загрузка…</div>;
  if (!email) return <CourseAuthPanel title="Вход для владельца" note="Войдите аккаунтом владельца сайта, чтобы управлять курсом." returnPath="/manage-course" />;
  if (!isAdmin) return <div className="mx-auto max-w-xl py-20 text-center"><h2 className="font-display text-4xl">Нет доступа</h2><p className="mt-4 text-muted-foreground">Управление курсом доступно только владельцу сайта.</p><Button className="mt-6" variant="outline" onClick={() => supabase.auth.signOut()}><LogOut />Выйти</Button></div>;

  const pending = submissions.filter((s) => s.status === "pending").length;
  const lessonTitle = new Map(lessons.map((l) => [l.id, l.title]));
  const studentEmail = new Map(students.map((s) => [s.user_id, s.email ?? "Ведущий"]));

  return <div className="py-10">
    <div className="mb-6 flex items-center justify-between gap-4"><p className="text-sm text-muted-foreground">{email}</p><Button size="icon" variant="outline" onClick={() => supabase.auth.signOut()} aria-label="Выйти"><LogOut /></Button></div>
    <Tabs defaultValue="lessons">
      <TabsList className="flex h-auto flex-wrap"><TabsTrigger value="lessons">Уроки ({lessons.length})</TabsTrigger><TabsTrigger value="homework">Домашние задания{pending ? ` · ${pending} новых` : ""}</TabsTrigger><TabsTrigger value="invites">Приглашения</TabsTrigger></TabsList>

      <TabsContent value="lessons" className="mt-6">
        <div className="mb-4 flex flex-wrap gap-2">{COURSES.map(([k, t]) => <Button key={k} size="sm" variant={course === k ? "default" : "outline"} onClick={() => setCourse(k)}>{t} ({lessons.filter((x) => x.course === k).length})</Button>)}</div>
        <Button onClick={openCreate}><Plus />Добавить урок в «{courseLabel(course)}»</Button>
        <div className="mt-6 divide-y divide-border border-y border-border">{lessons.filter((x) => x.course === course).length === 0 && <p className="py-12 text-center text-muted-foreground">В этом курсе уроков пока нет.</p>}
          {lessons.filter((x) => x.course === course).map((l) => <article key={l.id} className="grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div><p className="text-xs text-muted-foreground">Порядок {l.position} · {l.video_path ? "видео загружено" : l.video_url ? "видео по ссылке" : "без видео"}</p><h3 className="font-display text-2xl">{l.title}</h3></div>
            <div className="flex items-center gap-2"><Label htmlFor={`pub-${l.id}`}>Опубликован</Label><Switch id={`pub-${l.id}`} checked={l.is_published} onCheckedChange={() => togglePublish(l)} /><Button size="icon" variant="outline" onClick={() => openEdit(l)} aria-label="Редактировать"><Pencil /></Button><Button size="icon" variant="outline" onClick={() => removeLesson(l)} aria-label="Удалить"><Trash2 /></Button></div>
          </article>)}</div>
      </TabsContent>

      <TabsContent value="homework" className="mt-6 space-y-4">
        {submissions.length === 0 && <p className="border-y border-border py-12 text-center text-muted-foreground">Домашних заданий пока нет.</p>}
        {submissions.map((s) => <SubmissionReview key={s.id} submission={s} lessonTitle={(() => { const l = lessons.find((x) => x.id === s.lesson_id); return l ? `${courseLabel(l.course)} · ${l.title}` : "Урок"; })()} student={studentEmail.get(s.user_id) ?? "Ведущий"} onDone={load} />)}
      </TabsContent>

      <TabsContent value="invites" className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row"><Input placeholder="Для кого (например, Анна, Казань)" value={inviteNote} onChange={(e) => setInviteNote(e.target.value)} maxLength={120} /><Button onClick={createInvite}><Plus />Создать приглашение</Button></div>
        <p className="mt-3 text-sm text-muted-foreground">Каждый код можно использовать один раз. Отправьте ведущему ссылку — после регистрации курс откроется автоматически.</p>
        <div className="mt-6 divide-y divide-border border-y border-border">{invites.map((i) => <div key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div><p className="font-mono text-lg tracking-widest">{i.code}</p><p className="text-sm text-muted-foreground">{i.note || "Без подписи"} · {i.used_by ? `использован: ${studentEmail.get(i.used_by) ?? "ведущий"}` : "свободен"}</p></div>
          <div className="flex gap-2">{!i.used_by && <Button size="sm" variant="outline" onClick={() => copyInvite(i.code)}><Copy />Ссылка</Button>}<Button size="icon" variant="outline" onClick={() => removeInvite(i)} aria-label="Удалить приглашение"><Trash2 /></Button></div>
        </div>)}</div>
        <StudentHostLinks students={students} onDone={load} />
      </TabsContent>
    </Tabs>

    <Dialog open={dialog} onOpenChange={setDialog}><DialogContent className="max-h-[90svh] overflow-y-auto"><DialogHeader><DialogTitle>{editingId ? "Редактировать урок" : "Новый урок"}</DialogTitle><DialogDescription>Загрузите видеофайл или вставьте ссылку YouTube, Rutube, VK.</DialogDescription></DialogHeader>
      <form onSubmit={saveLesson} className="space-y-4">
        <div className="space-y-2"><Label htmlFor="l-course">Курс</Label><select id="l-course" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>{COURSES.map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select></div>
        <div className="space-y-2"><Label htmlFor="l-title">Название</Label><Input id="l-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={160} /></div>
        <div className="space-y-2"><Label htmlFor="l-desc">Описание урока</Label><Textarea id="l-desc" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="space-y-2"><Label htmlFor="l-file">Видеофайл</Label><Input id="l-file" type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} />{form.video_path && !videoFile && <p className="text-xs text-muted-foreground">Видео уже загружено. Выберите новый файл, чтобы заменить.</p>}</div>
        <div className="space-y-2"><Label htmlFor="l-url">или ссылка на видео</Label><Input id="l-url" type="url" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} /></div>
        <div className="space-y-2"><Label htmlFor="l-hw">Домашнее задание</Label><Textarea id="l-hw" rows={4} value={form.homework_prompt} onChange={(e) => setForm({ ...form, homework_prompt: e.target.value })} required /></div>
        <div className="grid grid-cols-2 items-end gap-4"><div className="space-y-2"><Label htmlFor="l-pos">Порядок</Label><Input id="l-pos" type="number" value={form.position} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} /></div><div className="flex h-9 items-center gap-3"><Switch id="l-pub" checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} /><Label htmlFor="l-pub">Опубликовать</Label></div></div>
        <DialogFooter><Button type="button" variant="outline" onClick={() => setDialog(false)}>Отмена</Button><Button type="submit" disabled={saving}>{saving ? (videoFile ? "Загружаем видео…" : "Сохраняем…") : "Сохранить"}</Button></DialogFooter>
      </form></DialogContent></Dialog>
  </div>;
}

function SubmissionReview({ submission, lessonTitle, student, onDone }: { submission: CourseSubmission; lessonTitle: string; student: string; onDone: () => Promise<void> }) {
  const [feedback, setFeedback] = useState(submission.feedback);
  const status = submission.status as SubmissionStatus;

  async function decide(next: SubmissionStatus) {
    const { error } = await supabase.from("course_submissions").update({ status: next, feedback: feedback.trim() }).eq("id", submission.id);
    if (error) { toast.error(error.message); return; }
    toast.success(next === "approved" ? "Принято — следующий урок открыт" : "Отправлено на доработку"); await onDone();
  }
  async function openFile() {
    if (!submission.file_path) return;
    const { data } = await supabase.storage.from("course-homework").createSignedUrl(submission.file_path, 600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  }

  return <article className={`border bg-card p-5 ${status === "pending" ? "border-primary" : "border-border"}`}>
    <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-display text-2xl">{lessonTitle}</h3><span className="text-xs font-semibold uppercase text-muted-foreground">{submissionStatusLabels[status]}</span></div>
    <p className="text-sm text-muted-foreground">{student} · {new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(submission.updated_at))}</p>
    {submission.answer_text && <p className="mt-4 whitespace-pre-line leading-7">{submission.answer_text}</p>}
    {submission.file_name && <button type="button" onClick={openFile} className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary"><Paperclip className="size-4" />{submission.file_name}</button>}
    <Textarea className="mt-4" rows={3} placeholder="Комментарий для ведущего" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
    <div className="mt-3 flex flex-wrap gap-2"><Button onClick={() => decide("approved")}>Принять</Button><Button variant="outline" onClick={() => decide("revision")}>На доработку</Button></div>
  </article>;
}

function StudentHostLinks({ students, onDone }: { students: Student[]; onDone: () => void }) {
  const [hosts, setHosts] = useState<{ slug: string; name: string; city: string }[]>([]);
  useEffect(() => { void supabase.from("facilitators").select("slug,name,city").order("name").then(({ data }) => setHosts(data ?? [])); }, []);
  async function link(userId: string, slug: string) {
    const { error } = await supabase.from("course_students").update({ facilitator_slug: slug === "none" ? null : slug }).eq("user_id", userId);
    if (error) toast.error("Не удалось сохранить"); else { toast.success("Сохранено"); onDone(); }
  }
  return <div className="mt-10"><h3 className="font-display text-2xl">Страницы ведущих</h3><p className="mt-2 text-sm text-muted-foreground">Выберите, чья страница принадлежит ведущему — тогда он сможет сам добавлять отзывы из кабинета.</p>
    <div className="mt-4 divide-y divide-border border-y border-border">{students.map((s) => <div key={s.user_id} className="flex flex-wrap items-center justify-between gap-3 py-3"><span>{s.email ?? "Ведущий"}</span>
      <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={s.facilitator_slug ?? "none"} onChange={(e) => link(s.user_id, e.target.value)}><option value="none">— не выбрано —</option>{hosts.map((h) => <option key={h.slug} value={h.slug}>{h.name} · {h.city}</option>)}</select></div>)}</div></div>;
}
