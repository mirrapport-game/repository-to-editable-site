import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Megaphone, Sparkles, Users, Gamepad2, GraduationCap, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { seoMeta, canonical } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/bloggers")({
  head: () => ({ links: canonical("/bloggers"), meta: [...seoMeta("/bloggers", ["совместный запуск", "предложение для блогеров", "марафон психологических игр", "коллаборация с блогером", "заработок блогера"]),
    { title: "Совместный запуск для блогеров — марафон игр «Раппóрт»" },
    { name: "description", content: "Проведём для вашей аудитории марафон психологических игр «Раппóрт»: 4 дня демо, 4 дня игр, интенсивы. Вам — рассказывать, нам — всё остальное. От 300 000 ₽ за запуск." },
    { property: "og:title", content: "Совместный запуск с «Раппóрт» — для блогеров" },
    { property: "og:description", content: "Марафон игр «4 через 4» для вашей аудитории: мы проводим, вы рассказываете. Доход от 300 000 ₽ за запуск и новые подписчики." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: BloggersPage,
});

const stages = [
  { Icon: Gamepad2, days: "Дни 1–4", title: "Демо-игры", text: "Бесплатные короткие игры на разные темы: отношения, женская энергия, мужской взгляд. Аудитория знакомится с форматом." },
  { Icon: Users, days: "Дни 5–8", title: "Полные игры", text: "Игры для тех, кто записался на платное участие. Группы до 6 человек — каждому хватает внимания." },
  { Icon: GraduationCap, days: "Дни 9–12", title: "Интенсивы", text: "Трёхдневные интенсивы для тех, кто хочет глубже: разбор, практика, результат." },
  { Icon: Rocket, days: "Дальше", title: "Своё дело", text: "Тем, кто влюбился в игру, предлагаем стать ведущими и запустить систему под ключ — от 500 000 до 1 000 000 ₽." },
];

const themes = ["Раппóрт Отношения — пары, близость, доверие", "Раппóрт Живая — женская энергия и самоценность", "Мужские карточки — новый формат, приглашаем мужчин"];

function BloggersPage() {
  return <>
    <section className="facilitator-hero overflow-hidden"><div className="section-inner py-16 md:py-24">
      <p className="eyebrow">Совместный запуск</p>
      <h1 className="mt-4 max-w-4xl font-display text-5xl leading-none md:text-8xl">Марафон игр для вашей аудитории</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground">Мы проводим марафон психологических игр «Раппóрт» по схеме «4 через 4». Ваша задача — просто рассказывать о нём. Ведущих, игры, запись и продажи берём на себя.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><a href="#apply">Заполнить анкету</a></Button></div>
      <div className="mt-12 grid max-w-3xl gap-6 sm:grid-cols-3">
        {[["от 300 000 ₽", "ваш доход за запуск"], ["сотни и тысячи", "новых подписчиков"], ["12 дней", "один цикл марафона"]].map(([v, l]) => <div key={l} className="border-t border-primary pt-4"><p className="font-display text-3xl">{v}</p><p className="text-sm text-foreground">{l}</p></div>)}
      </div>
    </div></section>

    <section className="section-inner py-16 md:py-24">
      <p className="eyebrow">Как устроен марафон</p>
      <h2 className="mt-4 font-display text-4xl md:text-6xl">«4 через 4»</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stages.map(({ Icon, days, title, text }) => <div key={title} className="border border-border p-6"><Icon className="size-7 text-primary" aria-hidden="true" /><p className="mt-5 text-sm text-primary">{days}</p><h3 className="mt-1 font-display text-3xl">{title}</h3><p className="mt-3 leading-7 text-foreground">{text}</p></div>)}
      </div>
    </section>

    <section className="bg-secondary"><div className="section-inner grid gap-12 py-16 md:py-24 lg:grid-cols-2">
      <div>
        <p className="eyebrow">Что делаете вы</p>
        <h2 className="mt-4 font-display text-4xl md:text-6xl">Только рассказываете</h2>
        <ul className="mt-8 grid gap-4">{["Сторис и посты о марафоне в дни запуска — по готовому плану", "Ссылка на запись — мы даём её вам", "Можно прийти на игру и показать её изнутри"].map((t) => <li key={t} className="flex gap-3"><Megaphone className="mt-1 size-5 shrink-0 text-primary" />{t}</li>)}</ul>
      </div>
      <div>
        <p className="eyebrow">Что делаем мы</p>
        <h2 className="mt-4 font-display text-4xl md:text-6xl">Всё остальное</h2>
        <ul className="mt-8 grid gap-4">{["Ведущие, игры, интенсивы", "Запись, группы до 6 человек, напоминания", "Готовые тексты, визуалы и сценарий прогрева", "Продажи и сопровождение участников"].map((t) => <li key={t} className="flex gap-3"><Check className="mt-1 size-5 shrink-0 text-primary" />{t}</li>)}</ul>
      </div>
    </div></section>

    <section className="section-inner py-16 md:py-24">
      <p className="eyebrow">Темы марафонов</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{themes.map((t) => <div key={t} className="flex gap-3 border border-border p-6"><Sparkles className="size-5 shrink-0 text-primary" /><p className="leading-7">{t}</p></div>)}</div>
    </section>


    <section id="apply" className="section-inner scroll-mt-24 py-16 md:py-24"><div className="grid gap-12 lg:grid-cols-2">
      <div><p className="eyebrow">Анкета блогера</p><h2 className="mt-4 font-display text-4xl md:text-6xl">Запустим вместе?</h2><p className="mt-6 text-lg leading-8 text-foreground">Оставьте ссылку на блог. Мы посмотрим аудиторию, одобрим заявку и свяжемся, чтобы обсудить даты и условия.</p></div>
      <BloggerForm />
    </div></section>
  </>;
}

function BloggerForm() {
  const [f, setF] = useState({ name: "", blog: "", contact: "", audience: "", topic: "", consent: false });
  const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.consent) { toast.error("Отметьте согласие на обработку данных"); return; }
    setBusy(true);
    const { error } = await supabase.rpc("submit_blogger_application", { _name: f.name, _blog_url: f.blog, _contact: f.contact, _audience: f.audience, _topic: f.topic });
    setBusy(false);
    if (error) toast.error(error.message); else setDone(true);
  }
  if (done) return <div className="border border-primary p-8"><p className="font-display text-3xl">Анкета отправлена</p><p className="mt-3 text-foreground">Мы изучим ваш блог и свяжемся с вами.</p></div>;
  return <form onSubmit={submit} className="grid gap-3">
    <Input placeholder="Имя" required maxLength={100} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
    <Input placeholder="Ссылка на блог" required maxLength={300} value={f.blog} onChange={(e) => setF({ ...f, blog: e.target.value })} />
    <Input placeholder="Telegram или телефон" required maxLength={100} value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} />
    <Input placeholder="Размер аудитории (например, 25 000)" maxLength={100} value={f.audience} onChange={(e) => setF({ ...f, audience: e.target.value })} />
    <Textarea placeholder="О чём ваш блог" maxLength={300} value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })} />
    <label className="flex gap-2 text-sm text-foreground"><input type="checkbox" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} />Согласен(на) на обработку персональных данных</label>
    <Button type="submit" size="lg" disabled={busy}>Отправить анкету</Button>
  </form>;
}
