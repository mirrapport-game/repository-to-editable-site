import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Music, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/components/site-shell";
import { TelegramLogin } from "@/components/telegram-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  deleteSiteArticle,
  listSiteArticles,
  saveSiteArticle,
  setSiteArticlePublished,
} from "@/lib/site-articles.functions";
import {
  articleSlug,
  estimateReadTime,
  formatRussianDate,
  parseSections,
  todayIso,
  type SiteArticleRow,
} from "@/lib/site-articles";
import { articles as localArticles, type Article } from "@/data/site";

type SectionForm = { heading: string; paragraphs: string; bullets: string };
type Draft = {
  id: string | null;
  slug: string;
  slugTouched: boolean;
  title: string;
  category: string;
  description: string;
  intro: string;
  publishedAt: string;
  readTime: string;
  author: string;
  authorBio: string;
  authorTelegram: string;
  authorChannel: string;
  audioPath: string;
  audioTitle: string;
  isPublished: boolean;
  sections: SectionForm[];
};

const emptyDraft = (): Draft => ({
  id: null,
  slug: "",
  slugTouched: false,
  title: "",
  category: "Статьи",
  description: "",
  intro: "",
  publishedAt: todayIso(),
  readTime: "",
  author: "Артём Ефимов",
  authorBio: "",
  authorTelegram: "",
  authorChannel: "",
  audioPath: "",
  audioTitle: "",
  isPublished: false,
  sections: [{ heading: "", paragraphs: "", bullets: "" }],
});

function toFormSections(value: unknown): SectionForm[] {
  const list = parseSections(value).map((s) => ({
    heading: s.heading ?? "",
    paragraphs: (s.paragraphs ?? []).join("\n\n"),
    bullets: (s.bullets ?? []).join("\n"),
  }));
  return list.length ? list : [{ heading: "", paragraphs: "", bullets: "" }];
}

function fromFormSections(list: SectionForm[]) {
  return list.map((s) => ({
    heading: s.heading.trim(),
    paragraphs: s.paragraphs.split(/\n{2,}/).map((t) => t.trim()).filter(Boolean),
    bullets: s.bullets.split("\n").map((t) => t.trim()).filter(Boolean),
  }));
}

function draftFromRow(row: SiteArticleRow): Draft {
  const publishedAt = row.published_at ? String(row.published_at).slice(0, 10) : "";
  return {
    id: row.id,
    slug: row.slug,
    slugTouched: true,
    title: row.title,
    category: row.category,
    description: row.description,
    intro: row.intro,
    publishedAt: /^\d{4}-\d{2}-\d{2}$/.test(publishedAt) ? publishedAt : "",
    readTime: row.read_time,
    author: row.author,
    authorBio: row.author_bio,
    authorTelegram: row.author_telegram ?? "",
    authorChannel: row.author_channel ?? "",
    audioPath: row.audio_url ?? "",
    audioTitle: row.audio_title ?? "",
    isPublished: row.is_published,
    sections: toFormSections(row.sections),
  };
}

/** Готовая статья из кода -> черновик правки. Сохранение создаёт копию в базе, которая заменяет её на сайте. */
function draftFromArticle(a: Article): Draft {
  return {
    ...emptyDraft(),
    slug: a.slug,
    slugTouched: true,
    title: a.title,
    category: a.category,
    description: a.description,
    intro: a.intro,
    publishedAt: a.publishedAt ?? "",
    readTime: a.readTime,
    author: a.author ?? "",
    authorBio: a.authorBio ?? "",
    authorTelegram: a.authorTelegram ?? "",
    authorChannel: a.authorChannel ?? "",
    isPublished: true,
    sections: toFormSections(a.sections),
  };
}

export function ArticlesManager() {
  const isAdmin = useIsAdmin();
  const [signedIn, setSignedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [rows, setRows] = useState<SiteArticleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchList = useServerFn(listSiteArticles);
  const save = useServerFn(saveSiteArticle);
  const remove = useServerFn(deleteSiteArticle);
  const togglePublish = useServerFn(setSiteArticlePublished);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) {
        setSignedIn(!!data.session);
        setChecking(false);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session));
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function refresh() {
    setLoading(true);
    const result = await fetchList({ data: undefined });
    setRows(result.rows);
    if (result.error) toast.error(result.error);
    setLoading(false);
  }

  useEffect(() => {
    if (isAdmin) void refresh();
  }, [isAdmin]);

  function patch(next: Partial<Draft>) {
    setDraft((current) => (current ? { ...current, ...next } : current));
  }

  function changeTitle(title: string) {
    setDraft((current) => {
      if (!current) return current;
      const slug = current.slugTouched ? current.slug : articleSlug(title);
      return { ...current, title, slug };
    });
  }

  function patchSection(index: number, next: Partial<SectionForm>) {
    setDraft((current) => {
      if (!current) return current;
      const sections = current.sections.map((s, i) => (i === index ? { ...s, ...next } : s));
      return { ...current, sections };
    });
  }

  function addSection() {
    setDraft((current) => (current ? { ...current, sections: [...current.sections, { heading: "", paragraphs: "", bullets: "" }] } : current));
  }

  function removeSection(index: number) {
    setDraft((current) => {
      if (!current) return current;
      const sections = current.sections.filter((_, i) => i !== index);
      return { ...current, sections: sections.length ? sections : [{ heading: "", paragraphs: "", bullets: "" }] };
    });
  }

  function moveSection(index: number, direction: -1 | 1) {
    setDraft((current) => {
      if (!current) return current;
      const target = index + direction;
      if (target < 0 || target >= current.sections.length) return current;
      const sections = [...current.sections];
      const moved = sections.splice(index, 1)[0];
      if (!moved) return current;
      sections.splice(target, 0, moved);
      return { ...current, sections };
    });
  }

  async function uploadAudio(file: File) {
    if (!draft) return;
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "mp3").toLowerCase();
      const path = `articles/${draft.slug || "article"}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("article-audio").upload(path, file, { upsert: true });
      if (error) throw error;
      patch({ audioPath: path, audioTitle: draft.audioTitle.trim() || file.name.replace(/\.[^.]+$/, "") });
      toast.success("Трек загружен — не забудьте сохранить статью");
    } catch {
      toast.error("Не удалось загрузить трек. Попробуйте файл поменьше (до 20 МБ).");
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    if (!draft) return;
    if (draft.title.trim().length < 3) {
      toast.error("Напишите заголовок — минимум 3 символа");
      return;
    }
    if (!draft.slug.trim()) {
      toast.error("Не удалось получить адрес статьи. Впишите его вручную.");
      return;
    }
    const sections = fromFormSections(draft.sections);
    const readTime =
      draft.readTime.trim() ||
      estimateReadTime([
        draft.title,
        draft.intro,
        ...sections.flatMap((s) => [s.heading, ...(s.paragraphs ?? []), ...(s.bullets ?? [])]),
      ]);

    setBusy(true);
    try {
      const result = await save({
        data: {
          id: draft.id,
          slug: draft.slug.trim(),
          title: draft.title.trim(),
          description: draft.description.trim(),
          category: draft.category.trim() || "Статьи",
          publishedAt: draft.publishedAt || null,
          readTime,
          intro: draft.intro.trim(),
          sections,
          author: draft.author.trim(),
          authorBio: draft.authorBio.trim(),
          authorTelegram: draft.authorTelegram.trim(),
          authorChannel: draft.authorChannel.trim(),
          audioPath: draft.audioPath.trim(),
          audioTitle: draft.audioTitle.trim(),
          isPublished: draft.isPublished,
        },
      });
      if (!result.ok) {
        toast.error(result.error ?? "Не удалось сохранить статью");
        return;
      }
      toast.success(draft.isPublished ? "Статья опубликована" : "Черновик сохранён");
      await refresh();
      setDraft(null);
    } finally {
      setBusy(false);
    }
  }

  async function toggle(row: SiteArticleRow) {
    const result = await togglePublish({ data: { id: row.id, isPublished: !row.is_published } });
    if (!result.ok) {
      toast.error(result.error ?? "Не удалось изменить статус");
      return;
    }
    toast.success(row.is_published ? "Статья снята с публикации" : "Статья опубликована");
    await refresh();
  }

  async function drop(row: SiteArticleRow) {
    const result = await remove({ data: { id: row.id } });
    if (!result.ok) {
      toast.error(result.error ?? "Не удалось удалить статью");
      return;
    }
    toast.success("Статья удалена");
    setConfirmId(null);
    await refresh();
  }

  if (checking) return <p className="mt-10 text-muted-foreground">Загружаем страницу…</p>;

  if (!signedIn) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-border bg-background p-10">
        <p className="text-lg">Войдите, чтобы управлять статьями</p>
        <TelegramLogin />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-border bg-background p-10 text-center">
        <p className="text-lg">Эта страница доступна только администратору сайта.</p>
        <Button variant="outline" onClick={() => void supabase.auth.signOut()}>
          Выйти
        </Button>
      </div>
    );
  }

  if (draft) {
    return (
      <div className="mt-10 rounded-3xl border border-border bg-background p-6 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-3xl">{draft.id ? "Редактирование статьи" : "Новая статья"}</h2>
          <Button variant="outline" onClick={() => setDraft(null)}>
            <X className="size-4" /> К списку
          </Button>
        </div>

        <div className="grid gap-5">
          <Field label="Заголовок">
            <Input value={draft.title} onChange={(e) => changeTitle(e.target.value)} placeholder="О чём эта статья" />
          </Field>

          <Field label="Адрес в интернете" hint="Латиницей и через дефис. Подставляется из заголовка, можно поменять.">
            <Input
              value={draft.slug}
              onChange={(e) => patch({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-"), slugTouched: true })}
              placeholder="dumat-ili-ne-dumat"
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Рубрика">
              <Input list="article-categories" value={draft.category} onChange={(e) => patch({ category: e.target.value })} />
              <datalist id="article-categories">
                {Array.from(new Set([...rows.map((r) => r.category), "Игры", "Практика", "Отношения", "Психология"]))
                  .filter(Boolean)
                  .map((c) => (
                    <option key={c} value={c} />
                  ))}
              </datalist>
            </Field>
            <Field label="Дата публикации">
              <Input type="date" value={draft.publishedAt} onChange={(e) => patch({ publishedAt: e.target.value })} />
            </Field>
          </div>

          <Field label="Краткое описание" hint="Показывается в списке блога и в поиске.">
            <Textarea rows={2} value={draft.description} onChange={(e) => patch({ description: e.target.value })} />
          </Field>

          <Field label="Первый абзац" hint="С него начинается статья, до первого подзаголовка.">
            <Textarea rows={3} value={draft.intro} onChange={(e) => patch({ intro: e.target.value })} />
          </Field>

          <div>
            <p className="mb-2 font-medium">Блоки статьи</p>
            <div className="grid gap-4">
              {draft.sections.map((section, index) => (
                <div key={index} className="rounded-2xl border border-border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Input
                      className="font-medium"
                      value={section.heading}
                      onChange={(e) => patchSection(index, { heading: e.target.value })}
                      placeholder="Подзаголовок блока"
                    />
                    <Button variant="ghost" size="icon" onClick={() => moveSection(index, -1)} aria-label="Выше">
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => moveSection(index, 1)} aria-label="Ниже">
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeSection(index)} aria-label="Убрать блок">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    <Field label="Абзацы" hint="Пустая строка между абзацами — новый абзац.">
                      <Textarea
                        rows={6}
                        value={section.paragraphs}
                        onChange={(e) => patchSection(index, { paragraphs: e.target.value })}
                      />
                    </Field>
                    <Field label="Список" hint="Каждый пункт с новой строки. Можно оставить пустым.">
                      <Textarea
                        rows={3}
                        value={section.bullets}
                        onChange={(e) => patchSection(index, { bullets: e.target.value })}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-3" onClick={addSection}>
              <Plus className="size-4" /> Добавить блок
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Автор">
              <Input value={draft.author} onChange={(e) => patch({ author: e.target.value })} />
            </Field>
            <Field label="Время чтения" hint="Если оставить пустым — посчитаем по объёму текста.">
              <Input value={draft.readTime} onChange={(e) => patch({ readTime: e.target.value })} placeholder="5 минут" />
            </Field>
          </div>

          <Field
            label="Трек на тему статьи"
            hint="Загрузите mp3 или другой аудиофайл — в статье появится выбор «послушать или прочитать»."
          >
            <Input
              type="file"
              accept="audio/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadAudio(file);
                e.target.value = "";
              }}
            />
            {uploading && <span className="text-xs text-muted-foreground">Загружаем трек…</span>}
            {draft.audioPath && !uploading && (
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Music className="size-4" aria-hidden="true" />
                <span>Трек прикреплён{draft.audioTitle ? `: ${draft.audioTitle}` : ""}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => patch({ audioPath: "", audioTitle: "" })}>
                  Убрать
                </Button>
              </div>
            )}
          </Field>

          <Field label="Об авторе">
            <Textarea rows={2} value={draft.authorBio} onChange={(e) => patch({ authorBio: e.target.value })} />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Telegram автора" hint="Без @, например artemefimov">
              <Input value={draft.authorTelegram} onChange={(e) => patch({ authorTelegram: e.target.value })} />
            </Field>
            <Field label="Канал автора" hint="Ссылка на канал, если есть">
              <Input value={draft.authorChannel} onChange={(e) => patch({ authorChannel: e.target.value })} />
            </Field>
          </div>

          <label className="flex items-center gap-3">
            <Switch checked={draft.isPublished} onCheckedChange={(v) => patch({ isPublished: v })} />
            <span>Опубликовать сразу</span>
          </label>

          <div className="flex flex-wrap gap-3">
            <Button onClick={submit} disabled={busy}>
              {busy ? "Сохраняем…" : draft.isPublished ? "Опубликовать" : "Сохранить в черновики"}
            </Button>
            <Button variant="outline" onClick={() => setDraft(null)} disabled={busy}>
              Отмена
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground">
          {loading ? "Загружаем…" : `Всего статей: ${rows.length}`}
        </p>
        <Button onClick={() => setDraft(emptyDraft())}>
          <Plus className="size-4" /> Добавить статью
        </Button>
      </div>

      {rows.length === 0 && !loading && (
        <div className="rounded-3xl border-2 border-dashed border-border p-10 text-center text-muted-foreground">
          Пока здесь нет статей. Нажмите «Добавить статью».
        </div>
      )}

      <div className="grid gap-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium">{row.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {row.category}
                  {row.published_at ? ` · ${formatRussianDate(String(row.published_at).slice(0, 10))}` : ""}
                  {row.read_time ? ` · ${row.read_time}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    row.is_published
                      ? "rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                      : "rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                  }
                >
                  {row.is_published ? "Опубликована" : "Черновик"}
                </span>
                {row.is_published && (
                  <Link
                    to="/blog/$slug"
                    params={{ slug: row.slug }}
                    className="rounded-full border border-border px-3 py-1 text-xs"
                  >
                    Открыть
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={() => void toggle(row)}>
                  {row.is_published ? "Снять с публикации" : "Опубликовать"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDraft(draftFromRow(row))}>
                  <Pencil className="size-4" /> Изменить
                </Button>
                {confirmId === row.id ? (
                  <span className="flex items-center gap-2">
                    <Button size="sm" variant="destructive" onClick={() => void drop(row)}>
                      Удалить
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                      Отмена
                    </Button>
                  </span>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => setConfirmId(row.id)} aria-label="Удалить статью">
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-display text-2xl">Готовые статьи</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Можно поправить текст и прикрепить трек. После сохранения статья появится в списке выше и заменит исходную на сайте.
        </p>
        <div className="mt-4 grid gap-3">
          {localArticles
            .filter((a) => !rows.some((r) => r.slug === a.slug))
            .map((a) => (
              <div key={a.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4">
                <div className="min-w-0">
                  <p className="font-medium">{a.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{a.category} · {a.readTime}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setDraft(draftFromArticle(a))}>
                  <Pencil className="size-4" /> Изменить / добавить трек
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
