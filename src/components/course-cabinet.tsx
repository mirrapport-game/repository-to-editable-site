import { HostOwnReviews } from "@/components/host-reviews";
import { HostChallenge } from "@/components/host-challenge";
import { HostWorkspace } from "@/components/host-workspace";
import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Clock3, Lock, LogOut, Paperclip, PlayCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getVideoSource } from "@/lib/video-reviews";
import { safeFileName, submissionStatusLabels, type CourseLesson, type CourseSubmission, type SubmissionStatus, COURSES, courseLabel } from "@/lib/course";
import { CourseAuthPanel } from "@/components/course-auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type OutlineItem = { id: string; title: string; lesson_position: number; unlocked: boolean; course: string };
const INVITE_KEY = "rapport-course-invite";

export function CourseCabinet() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isStudent, setIsStudent] = useState(false);
  const [invite, setInvite] = useState("");
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [submissions, setSubmissions] = useState<CourseSubmission[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [course, setCourse] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    setUserId(user?.id ?? null); setEmail(user?.email ?? null);
    if (!user) { setLoading(false); return; }
    let { data: student } = await supabase.rpc("is_course_student", { _user_id: user.id });
    const stored = sessionStorage.getItem(INVITE_KEY);
    if (!student && stored) {
      const { data: ok } = await supabase.rpc("redeem_course_invite", { _code: stored });
      sessionStorage.removeItem(INVITE_KEY);
      if (ok) { student = true; toast.success("Доступ к курсу открыт"); } else toast.error("Код приглашения не подошёл или уже использован");
    }
    setIsStudent(Boolean(student));
    if (student) {
      const [{ data: items }, { data: subs }] = await Promise.all([
        supabase.rpc("course_outline_by_game"),
        supabase.from("course_submissions").select("*").eq("user_id", user.id),
      ]);
      const list = (items ?? []) as OutlineItem[];
      setOutline(list); setSubmissions(subs ?? []);
      setActiveId((current) => current && list.some((i) => i.id === current && i.unlocked) ? current : ([...list].reverse().find((i) => i.unlocked)?.id ?? null));
    }
    setLoading(false);
  }

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("invite");
    if (code) { sessionStorage.setItem(INVITE_KEY, code); setInvite(code); }
    void load();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void load();
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function redeem(event: FormEvent) {
    event.preventDefault();
    const { data: ok } = await supabase.rpc("redeem_course_invite", { _code: invite });
    if (!ok) { toast.error("Код приглашения не подошёл или уже использован"); return; }
    toast.success("Доступ к курсу открыт"); await load();
  }

  if (loading) return <div className="py-24 text-center text-muted-foreground">Загрузка…</div>;
  if (!userId) return <CourseAuthPanel title="Вход в кабинет ведущего" note="Войдите или зарегистрируйтесь — доступ к урокам откроется по вашему коду приглашения." returnPath="/course" />;
  if (!isStudent) return <div className="mx-auto max-w-md py-12"><form onSubmit={redeem} className="border border-border bg-card p-7">
    <h2 className="font-display text-4xl">Код приглашения</h2>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">Курс доступен по приглашению. Введите код, который вы получили от Артёма.</p>
    <div className="mt-6 space-y-2"><Label htmlFor="invite-code">Код</Label><Input id="invite-code" value={invite} onChange={(e) => setInvite(e.target.value)} required className="uppercase tracking-widest" /></div>
    <Button className="mt-5 w-full" type="submit">Открыть курс</Button>
    <Button className="mt-3 w-full" type="button" variant="ghost" onClick={() => supabase.auth.signOut()}>Выйти ({email})</Button>
  </form></div>;

  const byLesson = new Map(submissions.map((s) => [s.lesson_id, s]));
  const courseKeys = COURSES.map(([k]) => k).filter((k) => outline.some((i) => i.course === k));
  const current = course && courseKeys.includes(course as never) ? course : (outline.find((i) => i.id === activeId)?.course ?? courseKeys[0]);
  const items = outline.filter((i) => i.course === current);
  const approved = items.filter((i) => byLesson.get(i.id)?.status === "approved").length;

  return <div className="py-10">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm text-muted-foreground">{email}</p><p className="mt-1 font-display text-3xl">Пройдено {approved} из {items.length}{current ? ` · ${courseLabel(current)}` : ""}</p>
        <div className="mt-3 h-1.5 w-64 max-w-full bg-border"><div className="h-full bg-primary transition-all" style={{ width: `${items.length ? (approved / items.length) * 100 : 0}%` }} /></div></div>
      <Button size="icon" variant="outline" onClick={() => supabase.auth.signOut()} aria-label="Выйти"><LogOut /></Button>
    </div>
    <HostWorkspace />
    <HostChallenge />
    <HostOwnReviews />
    {outline.length === 0 ? <p className="border-y border-border py-14 text-center text-muted-foreground">Уроки скоро появятся.</p> :
    <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <nav className="space-y-1.5" aria-label="Уроки курса">{courseKeys.length > 1 && <div className="mb-3 flex flex-wrap gap-1.5">{courseKeys.map((k) => <Button key={k} size="sm" variant={k === current ? "default" : "outline"} onClick={() => { setCourse(k); setActiveId([...outline].reverse().find((i) => i.course === k && i.unlocked)?.id ?? null); }}>{courseLabel(k)}</Button>)}</div>}{items.map((item, index) => {
        const status = byLesson.get(item.id)?.status as SubmissionStatus | undefined;
        const Icon = !item.unlocked ? Lock : status === "approved" ? CheckCircle2 : status === "pending" ? Clock3 : status === "revision" ? RotateCcw : PlayCircle;
        return <button key={item.id} type="button" disabled={!item.unlocked} onClick={() => setActiveId(item.id)}
          className={`flex w-full items-start gap-3 border p-3 text-left text-sm transition-colors ${activeId === item.id ? "border-primary bg-card" : "border-border"} ${item.unlocked ? "hover:bg-card" : "cursor-not-allowed opacity-50"}`}>
          <Icon className={`mt-0.5 size-4 shrink-0 ${status === "approved" ? "text-primary" : ""}`} />
          <span><span className="block text-xs text-muted-foreground">Урок {index + 1}{status ? ` · ${submissionStatusLabels[status]}` : ""}</span>{item.title}</span>
        </button>;
      })}</nav>
      {activeId && userId ? <LessonView key={activeId} lessonId={activeId} userId={userId} submission={byLesson.get(activeId)} onSubmitted={load} /> : <p className="text-muted-foreground">Выберите урок.</p>}
    </div>}
  </div>;
}

function LessonView({ lessonId, userId, submission, onSubmitted }: { lessonId: string; userId: string; submission: CourseSubmission | undefined; onSubmitted: () => Promise<void> }) {
  const [lesson, setLesson] = useState<CourseLesson | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [answer, setAnswer] = useState(submission?.answer_text ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.from("course_lessons").select("*").eq("id", lessonId).maybeSingle();
      setLesson(data);
      if (data?.video_path) {
        const { data: signed } = await supabase.storage.from("course-videos").createSignedUrl(data.video_path, 60 * 60 * 3);
        setVideoSrc(signed?.signedUrl ?? null);
      }
    })();
  }, [lessonId]);

  async function openMyFile() {
    if (!submission?.file_path) return;
    const { data } = await supabase.storage.from("course-homework").createSignedUrl(submission.file_path, 600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!answer.trim() && !file && !submission?.file_path) { toast.error("Напишите ответ или прикрепите файл"); return; }
    setSaving(true);
    let file_path = submission?.file_path ?? null; let file_name = submission?.file_name ?? null;
    if (file) {
      const path = `${userId}/${lessonId}/${safeFileName(file.name)}`;
      const { error } = await supabase.storage.from("course-homework").upload(path, file);
      if (error) { setSaving(false); toast.error("Не удалось загрузить файл (до 50 МБ)"); return; }
      file_path = path; file_name = file.name;
    }
    const payload = { lesson_id: lessonId, user_id: userId, answer_text: answer.trim(), file_path, file_name, status: "pending" };
    const { error } = submission
      ? await supabase.from("course_submissions").update(payload).eq("id", submission.id)
      : await supabase.from("course_submissions").insert(payload);
    setSaving(false);
    if (error) { toast.error("Не удалось отправить задание"); return; }
    toast.success("Задание отправлено на проверку"); setFile(null); await onSubmitted();
  }

  if (!lesson) return <div className="py-16 text-center text-muted-foreground">Загрузка урока…</div>;
  const external = lesson.video_url ? getVideoSource(lesson.video_url) : null;
  const status = submission?.status as SubmissionStatus | undefined;
  const locked = status === "approved";

  return <article className="min-w-0">
    <h2 className="font-display text-4xl leading-tight md:text-5xl">{lesson.title}</h2>
    {lesson.cover_url && <img src={lesson.cover_url} alt={lesson.title} className="mt-6 w-full rounded-lg border border-border" loading="lazy" />}
    {lesson.description && <p className="mt-6 whitespace-pre-line text-lg leading-8">{lesson.description}</p>}
    <div className="mt-6 overflow-hidden bg-foreground/5">
      {videoSrc ? <video src={videoSrc} controls controlsList="nodownload" className="aspect-video w-full bg-foreground" /> :
       external?.kind === "iframe" ? <iframe src={external.src} title={lesson.title} className="aspect-video w-full" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen /> :
       external?.kind === "video" ? <video src={external.src} controls className="aspect-video w-full bg-foreground" /> :
       external ? <a href={external.src} target="_blank" rel="noreferrer" className="flex aspect-video items-center justify-center gap-2 text-primary"><PlayCircle />Открыть видео</a> :
       <p className="p-8 text-center text-muted-foreground">Видео к этому уроку не добавлено.</p>}
    </div>
    <section className="mt-10 border border-border bg-card p-6">
      <p className="eyebrow">Домашнее задание</p>
      <p className="mt-3 whitespace-pre-line leading-7">{lesson.homework_prompt || "Поделитесь мыслями и выводами после урока."}</p>
      {status && <div className={`mt-5 border-l-2 p-4 text-sm ${status === "approved" ? "border-primary" : status === "revision" ? "border-destructive" : "border-border"}`}>
        <p className="font-semibold">{submissionStatusLabels[status]}</p>
        {status === "approved" && <p className="mt-1 text-muted-foreground">Следующий урок открыт.</p>}
        {status === "pending" && <p className="mt-1 text-muted-foreground">Следующий урок откроется после проверки.</p>}
        {submission?.feedback && <p className="mt-2 whitespace-pre-line">Комментарий: {submission.feedback}</p>}
      </div>}
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="space-y-2"><Label htmlFor="hw-answer">Ваш ответ</Label><Textarea id="hw-answer" rows={6} maxLength={5000} value={answer} onChange={(e) => setAnswer(e.target.value)} disabled={locked} /></div>
        <div className="space-y-2"><Label htmlFor="hw-file">Файл или фото (до 50 МБ)</Label><Input id="hw-file" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} disabled={locked} />
          {submission?.file_name && <button type="button" onClick={openMyFile} className="inline-flex items-center gap-1.5 text-sm text-primary"><Paperclip className="size-4" />{submission.file_name}</button>}</div>
        {!locked && <Button type="submit" disabled={saving}>{saving ? "Отправляем…" : submission ? "Отправить повторно" : "Сдать задание"}</Button>}
      </form>
    </section>
  </article>;
}
