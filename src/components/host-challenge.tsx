import { useEffect, useState } from "react";
import { Check, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Hosts allowed to run online games — only they see the online block.
// Male hosts get masculine wording in the checklist.
const MALE_HOSTS = new Set(["artem-efimov"]);
const ONLINE_HOSTS = new Set(["artem-efimov", "yulia-novitskaya", "marina-kravchenko", "natalya-kireeva"]);

type Item = { id: string; text: string };
type Group = { title: string; online?: boolean; items: Item[] };

const g = (prefix: string, title: string, texts: string[], online = false): Group => ({ title, online, items: texts.map((text, i) => ({ id: `${prefix}${i + 1}`, text })) });

export const CHALLENGE: Group[] = [
  g("p", "Упакуйте себя", [
    "Сделайте профессиональное фото с коробкой игры",
    "Напишите короткую историю «почему я веду Раппóрт» (5–7 предложений)",
    "Обновите описание профиля в соцсетях: «Ведущая игры «Раппóрт» в вашем городе»",
    "Добавьте ссылку на свою страницу на сайте rapportgame.ru в профиль",
    "Закрепите пост-знакомство о себе и игре",
    "Сделайте визитку с QR-кодом на свою страницу",
    "Подготовьте 3 ответа на частые вопросы: что это, сколько длится, сколько стоит",
    "Запишите 30-секундное видео-приглашение на игру",
  ]),
  g("c", "Контент", [
    "Опубликуйте фото с каждой проведённой игры (с согласия участников)",
    "Выложите сторис «до игры и после игры» участника",
    "Расскажите про одну карточку игры и вопрос с неё",
    "Сделайте пост «5 мифов о психологических играх»",
    "Проведите опрос в сторис о теме будущей игры",
    "Опубликуйте отзыв участника на своей странице сайта",
    "Сделайте серию постов «Как проходит игра» по шагам",
    "Снимите видео-разбор одной ситуации из игры (без личных данных)",
  ]),
  g("o", "Город и офлайн", [
    "Договоритесь с кафе или коворкингом о постоянной площадке",
    "Оставьте визитки в салонах красоты, студиях йоги, фитнес-клубах",
    "Проведите бесплатную демо-встречу для знакомых",
    "Предложите игру местному женскому или деловому клубу",
    "Выступите на городском мероприятии или ярмарке",
    "Договоритесь о совместной игре с психологом или коучем города",
    "Предложите игру для корпоратива местной компании",
    "Разместите анонс в городских пабликах и чатах",
    "Напишите в местное СМИ или блог о новом формате",
    "Проведите игру на день рождения или девичник",
    "Добавьте свою площадку в Яндекс Карты и 2ГИС как событие",
    "Договоритесь о кросс-акции с флористом, фотографом или салоном",
  ]),
  g("r", "Люди и сарафан", [
    "Напишите лично 10 знакомым и пригласите на игру",
    "Попросите каждого участника привести подругу",
    "Соберите чат постоянных участников",
    "Попросите 3 отзыва после каждой игры",
    "Введите подарочный сертификат на игру",
    "Сделайте ежемесячную встречу-традицию в одно и то же время",
    "Поблагодарите участников личным сообщением после игры",
    "Пригласите местного блогера сыграть бесплатно",
    "Соберите базу контактов и напоминайте о новых датах",
    "Проведите игру в паре с другой ведущей «Раппóрт»",
    "Отметьте @rapport_game в публикациях — мы поделимся",
    "Добавьте даты игр в расписание через Telegram-бота",
  ]),
  g("w", "Онлайн", [
    "Проведите первую онлайн-игру для знакомых",
    "Сделайте анонс онлайн-игры для всей России",
    "Проведите прямой эфир о том, что даёт игра",
    "Запустите рекламу своей посадочной страницы",
    "Проведите совместный эфир с другим экспертом",
    "Создайте свой Telegram-канал ведущей и ведите его",
    "Сделайте онлайн-игру для подписчиков блогера",
    "Опубликуйте экспертную статью на VC, Дзене или в Пульсе",
    "Соберите онлайн-группу из участников разных городов",
    "Сделайте серию онлайн-игр по сферам жизни",
  ], true),
];

export function HostChallenge() {
  const [slug, setSlug] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const [{ data: s }, { data: row }] = await Promise.all([
        supabase.rpc("my_host_slug"),
        supabase.from("host_challenge").select("done").maybeSingle(),
      ]);
      setSlug(s ?? null); setDone(new Set(row?.done ?? [])); setReady(true);
    })();
  }, []);

  const groups = CHALLENGE.filter((gr) => !gr.online || (slug && ONLINE_HOSTS.has(slug)));
  const total = groups.reduce((n, gr) => n + gr.items.length, 0);
  const count = groups.reduce((n, gr) => n + gr.items.filter((i) => done.has(i.id)).length, 0);

  async function toggle(id: string) {
    const next = new Set(done); next.has(id) ? next.delete(id) : next.add(id); setDone(next);
    const { data: u } = await supabase.auth.getUser(); if (!u.user) return;
    await supabase.from("host_challenge").upsert({ user_id: u.user.id, done: [...next], updated_at: new Date().toISOString() });
  }

  const male = !!slug && MALE_HOSTS.has(slug);
  const w = (t: string) => male ? t.replace(/другой ведущей/g, "другим ведущим").replace(/ведущей/g, "ведущего").replace(/самой известной/g, "самым известным") : t;
  if (!ready) return null;
  return <section className="mb-12 border border-border bg-card p-6 md:p-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="eyebrow">{w("Челлендж ведущей")}</p><h2 className="mt-2 font-display text-3xl md:text-4xl">{total} способов заявить о себе</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">{w("Отмечайте сделанное — шаг за шагом станьте самой известной ведущей «Раппóрт» в своём городе")}{slug && ONLINE_HOSTS.has(slug) ? " и онлайн" : ""}.</p></div>
      <div className="flex items-center gap-2 font-display text-2xl"><Trophy className="text-primary" />{count} / {total}</div>
    </div>
    <div className="mt-4 h-2 bg-border"><div className="h-full bg-primary transition-all" style={{ width: `${total ? (count / total) * 100 : 0}%` }} /></div>
    <div className="mt-8 grid gap-8 md:grid-cols-2">{groups.map((gr) => <div key={gr.title}>
      <h3 className="font-display text-xl">{w(gr.title)}</h3>
      <ul className="mt-3 space-y-2">{gr.items.map((i) => { const on = done.has(i.id); return <li key={i.id}>
        <button type="button" onClick={() => toggle(i.id)} className="flex w-full items-start gap-3 text-left">
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{on && <Check className="h-3.5 w-3.5" />}</span>
          <span className={on ? "text-muted-foreground line-through" : ""}>{w(i.text)}</span>
        </button></li>; })}</ul>
    </div>)}</div>
  </section>;
}
