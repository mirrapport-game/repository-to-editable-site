import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { games as allGames, type Game } from "@/data/site";

// Only released games appear in the homepage showcase.
const games = allGames.filter((g) => !g.comingSoon);

function BoxFace({ game }: { game: Game }) {
  return <div className={`game-box ${game.comingSoon ? "game-box-soon" : ""}`}>
    {game.cutoutImage ? <img loading="lazy" decoding="async" className="game-box-cutout" src={game.cutoutImage} alt={`Коробка игры «${game.title}»`} draggable={false} /> : <div className="game-box-placeholder"><span>Раппóрт</span><strong>{game.shortTitle}</strong></div>}
    {game.comingSoon && <span className="absolute left-4 top-4 z-10 bg-foreground px-3 py-1 text-xs uppercase text-background">Скоро</span>}
  </div>;
}

const N = games.length;

// Фоновое слово карусели: «Раппорт» на разных языках, без подписи языка
const STAGE_WORDS = ["РАППÓРТ", "RAPPORT", "RAPPORT"];
const wrapOffset = (value: number) => {
  let offset = value % N;
  if (offset > N / 2) offset -= N;
  if (offset < -N / 2) offset += N;
  return offset;
};

export function GameShowcase({ compact = false }: { compact?: boolean }) {
  const [position, setPosition] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const current = useRef(0);
  const target = useRef(0);
  const base = useRef(0);
  const hovered = useRef(false);

  // Плавное движение: текущая позиция каждый кадр догоняет целевую
  useEffect(() => {
    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(tick); });
    const tick = () => {
      if (!visible) { raf = 0; return; }
      const diff = target.current - current.current;
      if (Math.abs(diff) > 0.0005) {
        current.current += diff * 0.045;
        setPosition(current.current);
      }
      raf = requestAnimationFrame(tick);
    };
    if (stageRef.current) io.observe(stageRef.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  // Медленное самостоятельное вращение, пока мышки нет на карусели
  useEffect(() => {
    const timer = window.setInterval(() => { if (!hovered.current) target.current = Math.round(target.current) + 1; }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  // Фоновое слово плавно меняет язык
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setWordIndex((i) => (i + 1) % STAGE_WORDS.length), 3500);
    return () => window.clearInterval(timer);
  }, []);

  // Свайп двумя пальцами по тачпаду / колесо мыши: листаем игры, страницу не трогаем
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
      if (delta === 0) return;
      e.preventDefault();
      target.current += delta * 0.004;
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, []);

  // Мышка на коробке — карусель стоит. Двинули мышку на другую коробку — плавно едем к ней.
  const onItemPointerMove = (e: React.PointerEvent, index: number) => {
    if (e.pointerType !== "mouse") return;
    if (e.movementX === 0 && e.movementY === 0) return;
    const currentIndex = ((Math.round(target.current) % N) + N) % N;
    if (index !== currentIndex) goTo(index);
  };
  const onPointerEnter = (e: React.PointerEvent) => {
    hovered.current = true;
    if (e.pointerType === "mouse") base.current = Math.round(current.current);
  };
  const onPointerLeave = () => {
    hovered.current = false;
    base.current = Math.round(target.current);
    target.current = base.current; // мягко встаём на ближайшую игру
  };

  const move = (delta: number) => { base.current = Math.round(target.current) + delta; target.current = base.current; };
  const goTo = (index: number) => {
    const rounded = Math.round(target.current);
    const currentIndex = ((rounded % N) + N) % N;
    let delta = index - currentIndex;
    if (delta > N / 2) delta -= N;
    if (delta < -N / 2) delta += N;
    base.current = rounded + delta;
    target.current = base.current;
  };

  const startX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => { if (e.pointerType !== "mouse") startX.current = e.clientX; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current; startX.current = null;
    if (Math.abs(dx) > 40) move(dx > 0 ? -1 : 1);
  };

  const active = ((Math.round(position) % N) + N) % N;
  return <>
    <div ref={stageRef} className={compact ? "game-stage game-stage-compact" : "game-stage"} style={{ touchAction: "pan-y" }} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <div className="game-stage-word" aria-hidden="true" key={wordIndex}>
        <svg className="game-stage-silhouette" viewBox="0 0 200 120" fill="none">
          <path className="game-stage-bubble game-stage-bubble-big" d="M20 18 h96 a12 12 0 0 1 12 12 v34 a12 12 0 0 1 -12 12 H58 l-16 16 v-16 h-22 a12 12 0 0 1 -12 -12 v-34 a12 12 0 0 1 12 -12 Z" />
          <path className="game-stage-bubble game-stage-bubble-small" d="M138 52 h40 a10 10 0 0 1 10 10 v26 a10 10 0 0 1 -10 10 h-26 l-12 12 v-12 h-2 a10 10 0 0 1 -10 -10 v-26 a10 10 0 0 1 10 -10 Z" />
          <circle className="game-stage-dot" cx="46" cy="47" r="5" />
          <circle className="game-stage-dot" cx="68" cy="47" r="5" />
          <circle className="game-stage-dot" cx="90" cy="47" r="5" />
        </svg>
        <strong>{STAGE_WORDS[wordIndex] ?? STAGE_WORDS[0]}</strong>
      </div>
      <div className="game-orbit" role="list" aria-label="Игры серии «Раппóрт»">
        {games.map((game, index) => {
          const offset = wrapOffset(index - position);
          const isActive = index === active;
          const content = <><BoxFace game={game} /><span className={`game-orbit-caption${isActive ? "" : " game-orbit-caption-dim"}`}><strong>{game.title}</strong><span>{game.tagline}</span></span></>;
          if (isActive && !game.comingSoon) return <Link key={game.slug} to="/games/$slug" params={{ slug: game.slug }} role="listitem" className="game-orbit-item" onPointerMove={(e) => onItemPointerMove(e, index)} style={{ "--offset": offset } as React.CSSProperties} aria-label={`${game.title}, открыть подробную страницу`}>{content}</Link>;
          return <button key={game.slug} type="button" role="listitem" className="game-orbit-item" onPointerMove={(e) => onItemPointerMove(e, index)} style={{ "--offset": offset } as React.CSSProperties} onClick={() => goTo(index)} aria-label={`${game.title}${game.comingSoon ? ", скоро" : ", выбрать"}`}>{content}</button>;
        })}
      </div>
      <div className="absolute inset-x-0 bottom-3 z-30 flex items-center justify-center gap-3">
        <Button variant="outline" size="icon" onClick={() => move(-1)} aria-label="Предыдущая игра"><ArrowLeft /></Button>
        <span className="min-w-18 text-center text-sm tabular-nums">{active + 1} / {N}</span>
        <Button variant="outline" size="icon" onClick={() => move(1)} aria-label="Следующая игра"><ArrowRight /></Button>
      </div>
    </div>
    <nav aria-label="Все игры" className="mt-8 flex flex-wrap justify-center gap-2">
      {games.map((g) => g.comingSoon
        ? <span key={g.slug} className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">{g.title} · скоро</span>
        : <Link key={g.slug} to="/games/$slug" params={{ slug: g.slug }} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium underline-offset-4 hover:border-primary hover:text-primary hover:underline">{g.title}</Link>)}
    </nav>
  </>;
}
