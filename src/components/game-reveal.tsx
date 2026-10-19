import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import type { Game } from "@/data/site";
import curlyWoman from "@/assets/zhivaya-woman-curly.webp";
import blondeWoman from "@/assets/zhivaya-woman-blonde.webp";
import auburnWoman from "@/assets/zhivaya-woman-auburn.webp";
import relationshipManDark from "@/assets/relationships-man-dark.webp";
import relationshipWomanChestnut from "@/assets/relationships-woman-chestnut.webp";
import relationshipManSilver from "@/assets/relationships-man-silver.webp";
import relationshipWomanBlonde from "@/assets/relationships-woman-blonde.webp";

const zhivayaVoices = [
  { image: curlyWoman, quote: "Я наконец-то услышала себя", position: "curly" },
  { image: blondeWoman, quote: "Стало легче выбирать себя", position: "blonde" },
  { image: auburnWoman, quote: "Ушла с теплом и ясностью", position: "auburn" },
] as const;

const relationshipVoices = [
  { image: relationshipManDark, quote: "Мы впервые спокойно услышали друг друга", position: "man-dark", person: "Участник" },
  { image: relationshipWomanChestnut, quote: "Стало понятно, как говорить о важном", position: "woman-chestnut", person: "Участница" },
  { image: relationshipManSilver, quote: "Ушли с ощущением, что мы снова команда", position: "man-silver", person: "Участник" },
  { image: relationshipWomanBlonde, quote: "В отношениях появилось больше тепла", position: "woman-blonde", person: "Участница" },
] as const;

export function GameReveal({ game }: { game: Game }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setReady(true));
    const updateDepth = () => {
      const scene = sceneRef.current;
      if (!scene) return;
      const rect = scene.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, -rect.top / Math.max(rect.height, 1)));
      scene.style.setProperty("--scroll-progress", String(progress));
    };
    updateDepth();
    window.addEventListener("scroll", updateDepth, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateDepth);
    };
  }, []);

  const facts = [game.duration, game.format, game.outcomes[0]].filter(Boolean);
  const isZhivaya = game.slug === "zhivaya";
  const isRelationships = game.slug === "otnosheniya";
  const voices = isZhivaya ? zhivayaVoices : isRelationships ? relationshipVoices : [];
  const hasVoices = voices.length > 0;

  return (
    <div ref={sceneRef} className={`game-reveal ${hasVoices ? "game-reveal-with-voices" : ""} ${isZhivaya ? "game-reveal-zhivaya" : ""} ${isRelationships ? "game-reveal-relationships" : ""} ${ready ? "game-reveal-ready" : ""}`}>
      <div className="game-reveal-glow" aria-hidden="true" />
      {hasVoices && <div className="game-voices" aria-label={isZhivaya ? "Впечатления участниц" : "Впечатления участников игры об отношениях"}>
        {voices.map((voice, index) => <figure className={`game-voice game-voice-${voice.position}`} key={voice.position} style={{ "--voice-index": index } as React.CSSProperties}>
          <img src={voice.image} alt={`${"person" in voice ? voice.person : "Участница"} игры «${game.title}»`} width={768} height={1024} draggable={false} />
          <figcaption>«{voice.quote}»</figcaption>
        </figure>)}
      </div>}
      <div className="game-reveal-box" aria-label={`${hasVoices ? "Коробка" : "Открывающаяся коробка"} игры «${game.title}»`}>
        {hasVoices && game.cutoutImage ? (
          <div className="game-reveal-whole"><img src={game.cutoutImage} alt={`Коробка игры «${game.title}»`} draggable={false} /></div>
        ) : game.cutoutImage ? (
          <>
            <div className="game-reveal-lid" aria-hidden="true">
              <img src={game.cutoutImage} alt="" draggable={false} />
            </div>
            <div className="game-reveal-base">
              <img src={game.cutoutImage} alt={`Коробка игры «${game.title}»`} draggable={false} />
            </div>
          </>
        ) : (
          <div className="game-reveal-placeholder"><span>Раппóрт</span><strong>{game.shortTitle}</strong></div>
        )}
      </div>
      {!hasVoices && <div className="game-reveal-facts" aria-label="Главное об игре">
        {facts.map((fact, index) => (
          <div className="game-reveal-fact" key={fact} style={{ "--fact-index": index } as React.CSSProperties}>
            <Sparkles aria-hidden="true" />
            <span>{fact}</span>
          </div>
        ))}
      </div>}
      <p className="game-reveal-hint">{isZhivaya ? "Истории, которые начинаются с себя" : isRelationships ? "Истории, в которых двое слышат друг друга" : "Листайте, чтобы заглянуть внутрь"}</p>
    </div>
  );
}