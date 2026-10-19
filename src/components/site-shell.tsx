import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, ChevronDown, Menu, Send, Shield, UserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TELEGRAM_URL, TELEGRAM_CHANNEL_URL, SOCIAL_LINKS } from "@/data/site";
import { CityPicker } from "@/components/city-blocks";
import { useQuest } from "@/hooks/use-quest";
import { useVisitMode } from "@/lib/visit-mode";
import { openBookingWidget } from "@/components/booking-format";

function QuestBadge() {
  const { done, total } = useQuest();
  const { mode } = useVisitMode();
  // На обычном сайте квест — просто пункт меню; счётчик виден только внутри квеста.
  if (mode !== "quest") return null;
  return <Button asChild variant="outline" className="hidden sm:inline-flex"><Link to="/quest">Квест {done}/{total}</Link></Button>;
}

const mainLinks = [
  ["/games", "Игры"],
  ["/schedule", "Расписание игр"],
  ["/facilitators", "Ведущим"],
  ["/play", "Сыграть здесь"],
  ["/blog", "Блог"],
  ["/online-platform", "Платформа онлайн"],
] as const;

export function SiteHeader() {
  const { mode } = useVisitMode();
  const isAdmin = useIsAdmin();
  const menuLinks = mainLinks;
  if (mode === "quest") return <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
      <Link to="/quest" className="font-display text-2xl font-medium text-foreground" aria-label="Карта квеста">Раппóрт<span className="text-primary">.</span> <span className="text-base text-muted-foreground">квест</span></Link>
      <QuestBadge />
    </div>
  </header>;
  return <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
    <div className="mx-auto grid h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:px-8">
      <Link to="/" className="min-w-0 font-display text-3xl font-medium text-foreground" aria-label="Раппóрт — на главную">Раппóрт<span className="text-primary">.</span></Link>
      <div className="flex items-center gap-3">
        <CityPicker className="hidden h-9 w-36 md:flex" />
        <QuestBadge />
        <Button asChild variant="outline" className="hidden xl:inline-flex"><Link to="/course"><UserRound />Кабинет</Link></Button>
        {isAdmin && <DropdownMenu>
          <DropdownMenuTrigger asChild><Button type="button" variant="outline" className="hidden xl:inline-flex"><Shield />Админ<ChevronDown /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64"><DropdownMenuLabel>Администратор</DropdownMenuLabel>{adminLinks.map(([to, label]) => <DropdownMenuItem key={to} asChild><Link to={to}>{label}</Link></DropdownMenuItem>)}</DropdownMenuContent>
        </DropdownMenu>}
        <Button type="button" size="sm" className="md:h-9 md:px-4" onClick={openBookingWidget}><CalendarDays />Записаться</Button>
        <Sheet>
          <SheetTrigger asChild><Button variant="outline" size="icon" aria-label="Открыть меню"><Menu /></Button></SheetTrigger>
          <SheetContent className="overflow-y-auto bg-background"><SheetTitle className="font-display text-3xl">Раппóрт<span className="text-primary">.</span></SheetTitle>
            <nav className="mt-10 flex flex-col gap-1" aria-label="Боковая навигация">
              <CityPicker className="mb-4 h-11 w-full" />
              <div className="mt-4" />
              {menuLinks.map(([to, label]) => <SheetClose asChild key={to}><Link to={to} activeOptions={{ exact: false }} activeProps={to === "/games" ? { className: "bg-primary/10 text-primary font-semibold border-l-2 border-l-primary pl-4", "aria-current": "page" } : {}} className="border-b border-border py-4 text-lg">{label}</Link></SheetClose>)}
              <SheetClose asChild><Link to="/course" className="flex items-center gap-2 border-b border-border py-4 text-lg"><UserRound className="size-5" />Личный кабинет ведущего</Link></SheetClose>
              <SheetClose asChild><Button type="button" className="mt-6" onClick={openBookingWidget}><CalendarDays />Записаться</Button></SheetClose>
              <Button asChild variant="outline"><a href={TELEGRAM_URL} target="_blank" rel="noreferrer"><Send />Открыть в Telegram</a></Button>
              {isAdmin && <div className="mt-8"><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Администратор</p>{adminLinks.map(([to, label]) => <SheetClose asChild key={to}><Link to={to} className="block border-b border-border py-3">{label}</Link></SheetClose>)}</div>}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
    <nav className="mx-auto hidden max-w-7xl items-center justify-center gap-8 border-t border-border px-5 py-3 lg:flex" aria-label="Основная навигация">
      {menuLinks.map(([to, label]) => <Link key={to} to={to} className="text-sm text-foreground/75 transition-colors hover:text-primary" activeOptions={{ exact: false }} activeProps={{ className: to === "/games" ? "text-primary font-semibold underline decoration-2 underline-offset-8" : "text-primary", "aria-current": "page" }}>{label}</Link>)}
    </nav>
  </header>;
}

const adminLinks = [["/manage-crm","CRM · воронка"],["/manage-landings","Посадочные · статистика"],["/manage-applications","Заявки ведущих"],["/manage-club","Заявки на игры и жалобы"],["/manage-course","Управление курсом"],["/manage-reviews","Управление видеоотзывами"],["/manage-marathon","Марафон и блогеры"],["/manage-minigame","Карточки мини-игры"],["/bloggers","Блогерам: совместный запуск"],["/course","Кабинет ведущего"],["/investors","Инвесторам · питч"],["/market","Анализ рынка"],["/social-projects","Госпроекты, клубы, сообщества"],["/game-creation","Разработка игры"],["/mentorship","Сопровождение с Артёмом"],["/RB","Страница RB"],["/lp/volgograd-marina","Лендинг: Волгоград, Марина"],["/lp/sochi-yulia","Лендинг: Сочи, Юлия"],["/lp/irkutsk-natalya","Лендинг: Иркутск, Наталья"],["/lp/spb-natalya","Лендинг: Петербург, Наталья"]] as const;

// Internal links are shown only to admins (checked via has_role in the database).
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    let alive = true;
    const check = async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) { if (alive) setIsAdmin(false); return; }
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      if (alive) setIsAdmin(!!data);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { check(); });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);
  return isAdmin;
}

export function SiteFooter() {
  const isAdmin = useIsAdmin();
  return <footer className="border-t border-border bg-foreground text-background">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
      <div><p className="font-display text-4xl">Раппóрт</p><p className="mt-3 max-w-sm text-sm text-background/70">Серия психологических игр для глубоких разговоров, развития и гармоничных отношений.</p></div>
      <div><p className="mb-3 text-xs uppercase tracking-widest text-background/50">Проект</p><div className="flex flex-col gap-2 text-sm"><Link to="/course">Академия Раппóрт</Link><Link to="/facilitators">Ведущим</Link><Link to="/bloggers">Блогерам</Link><Link to="/facilitators">Стать ведущим</Link><Link to="/games">К играм</Link><Link to="/game-creation">Есть идея игры — хочу воплотить</Link></div></div>
      <div><p className="mb-3 text-xs uppercase tracking-widest text-background/50">Контакты</p><a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="text-sm">Telegram: @artem_rapport</a><a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noreferrer" className="mt-2 block text-sm">Канал новостей: @rapport_game</a><p className="mt-2 text-sm text-background/70">rapportower@gmail.com</p><div className="mt-4 flex flex-wrap gap-2">{SOCIAL_LINKS.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="rounded-full border border-background/25 px-3 py-1 text-xs hover:bg-background/10">{l.label}</a>)}</div>{isAdmin && <div className="mt-5 flex flex-col gap-2 text-xs text-background/45">{adminLinks.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</div>}</div>
    </div>
    <div className="border-t border-background/15 px-5 py-5 text-center text-xs text-background/55">Компания «Раппóрт Групп» · Ефимов Артём Львович · ИНН 781134332835 · <Link to="/offer" className="underline">Публичная оферта</Link> · Услуги не являются медицинской или психотерапевтической помощью</div>
  </footer>;
}
