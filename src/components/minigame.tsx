import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, LoaderCircle, Minus, Plus, RefreshCw, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CourseAuthPanel } from "@/components/course-auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { createMinigamePayment, getMinigameAccess, refreshMinigamePurchase, startMinigame } from "@/lib/minigame.functions";
import { minigameIntro, MINIGAME_PRICE, minigameRules, minigameStages, type DeckCard, type MinigameGender } from "@/data/minigame";

type Player = { name: string; gender: MinigameGender; swapUsed: boolean };
type Access = { freeAvailable: boolean; paidGames: number };

function useSession() {
  const [state, setState] = useState<"loading" | "in" | "out">("loading");
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setState(data.session ? "in" : "out"));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setState(s ? "in" : "out"));
    return () => data.subscription.unsubscribe();
  }, []);
  return state;
}

export function Minigame() {
  const session = useSession();
  const getAccess = useServerFn(getMinigameAccess);
  const start = useServerFn(startMinigame);
  const pay = useServerFn(createMinigamePayment);
  const refresh = useServerFn(refreshMinigamePurchase);
  const [access, setAccess] = useState<Access | null>(null);
  const [players, setPlayers] = useState<Player[]>([
    { name: "", gender: "female", swapUsed: false }, { name: "", gender: "male", swapUsed: false },
  ]);
  const [deck, setDeck] = useState<DeckCard[] | null>(null);
  const [busy, setBusy] = useState(false);

  const loadAccess = useCallback(async () => {
    const purchase = new URLSearchParams(window.location.search).get("purchase");
    if (purchase) { try { await refresh({ data: { purchaseId: purchase } }); } catch { /* уведомление придёт позже */ } }
    setAccess(await getAccess());
  }, [getAccess, refresh]);
  useEffect(() => { if (session === "in") void loadAccess(); }, [session, loadAccess]);

  if (session === "loading") return <div className="py-20 text-center"><LoaderCircle className="mx-auto animate-spin" /></div>;
  if (session === "out") return <CourseAuthPanel title="Войдите, чтобы играть" note="Первая игра бесплатно. Вход нужен, чтобы мы запомнили, что бесплатная игра уже сыграна." returnPath="/play" />;
  if (deck) return <GameBoard initialPlayers={players} deck={deck} onExit={() => { setDeck(null); void loadAccess(); }} />;

  const canStart = access && (access.freeAvailable || access.paidGames > 0);
  const setCount = (n: number) => setPlayers((list) => n > list.length
    ? [...list, ...Array.from({ length: n - list.length }, (_, i) => ({ name: "", gender: ((list.length + i) % 2 ? "male" : "female") as MinigameGender, swapUsed: false }))]
    : list.slice(0, n));

  async function begin() {
    setBusy(true);
    try {
      const res = await start();
      if (res.status === "payment_required") { toast.error("Бесплатная игра уже сыграна — оплатите следующую"); await loadAccess(); return; }
      if (!res.cards.length) { toast.error("Карточки ещё не загружены. Загляните чуть позже."); return; }
      setDeck(res.cards);
    } catch { toast.error("Не удалось начать игру"); } finally { setBusy(false); }
  }
  async function buy() {
    setBusy(true);
    try { const { url } = await pay(); window.location.href = url; } catch (e) { toast.error(e instanceof Error ? e.message : "Ошибка оплаты"); setBusy(false); }
  }

  return <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
    <div>
      <h2 className="font-display text-3xl">Правила</h2>
      <p className="mt-4 leading-relaxed">{minigameIntro}</p>
      <ol className="mt-5 space-y-3">{minigameRules.map((r, i) => <li key={r} className="flex gap-3 text-muted-foreground"><span className="font-display text-xl text-primary">{String(i + 1).padStart(2, "0")}</span><span>{r}</span></li>)}</ol>
      <div className="mt-8 flex flex-wrap gap-2">{minigameStages.map((s, i) => <span key={s.id} className="border border-border px-3 py-1 text-sm">{i + 1}. {s.title}</span>)}</div>
    </div>
    <div className="border border-border bg-card p-6">
      <h2 className="font-display text-3xl">Игроки</h2>
      <div className="mt-4 flex items-center gap-4">
        <Button size="icon" variant="outline" onClick={() => setCount(Math.max(2, players.length - 1))} aria-label="Меньше игроков"><Minus /></Button>
        <span className="text-2xl tabular-nums">{players.length}</span>
        <Button size="icon" variant="outline" onClick={() => setCount(Math.min(8, players.length + 1))} aria-label="Больше игроков"><Plus /></Button>
      </div>
      <div className="mt-5 space-y-3">{players.map((p, i) => <div key={i} className="flex gap-2">
        <Input placeholder={`Игрок ${i + 1}`} value={p.name} maxLength={30} onChange={(e) => setPlayers((l) => l.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
        {(["female", "male"] as const).map((g) => <Button key={g} type="button" variant={p.gender === g ? "default" : "outline"} className={p.gender === g ? (g === "male" ? "minigame-btn-male" : "minigame-btn-female") : ""} onClick={() => setPlayers((l) => l.map((x, j) => j === i ? { ...x, gender: g } : x))}>{g === "male" ? "М" : "Ж"}</Button>)}
      </div>)}</div>
      <div className="mt-6 text-sm text-muted-foreground">{!access ? "Проверяем доступ…" : access.freeAvailable ? "Ваша первая игра — бесплатно" : access.paidGames > 0 ? `Оплачено игр: ${access.paidGames}` : `Бесплатная игра сыграна. Следующая — ${MINIGAME_PRICE} ₽`}</div>
      {canStart
        ? <Button size="lg" className="mt-4 w-full" disabled={busy} onClick={begin}>{busy ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}Начать игру</Button>
        : <Button size="lg" className="mt-4 w-full" disabled={busy || !access} onClick={buy}>Оплатить игру — {MINIGAME_PRICE} ₽</Button>}
      {access && <div className="mt-6 border-t border-border pt-5 text-sm">
        <p className="flex justify-between"><span className="text-muted-foreground">Бесплатная игра</span><span>{access.freeAvailable ? "доступна" : "сыграна"}</span></p>
        <p className="mt-1 flex justify-between"><span className="text-muted-foreground">Оплаченных игр в запасе</span><span>{access.paidGames}</span></p>
        {canStart && <Button variant="outline" className="mt-4 w-full" disabled={busy} onClick={buy}>Купить ещё игру — {MINIGAME_PRICE} ₽</Button>}
      </div>}
    </div>
  </div>;
}

function shuffle<T>(arr: T[]) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; } return a; }

function GameBoard({ initialPlayers, deck, onExit }: { initialPlayers: Player[]; deck: DeckCard[]; onExit: () => void }) {
  const [players, setPlayers] = useState(() => initialPlayers.map((p, i) => ({ ...p, name: p.name.trim() || `Игрок ${i + 1}` })));
  const [piles, setPiles] = useState(() => {
    const m = new Map<string, DeckCard[]>();
    for (const c of shuffle(deck)) { const k = `${c.stage}:${c.gender}`; m.set(k, [...(m.get(k) ?? []), c]); }
    return m;
  });
  const [skills] = useState<(DeckCard | null)[]>(() => {
    const pool = shuffle(deck.filter((c) => c.stage === "navyki"));
    return initialPlayers.map((p) => { const i = pool.findIndex((c) => c.gender === p.gender || c.gender === "any"); return i >= 0 ? pool.splice(i, 1)[0]! : null; });
  });
  const [skillsShown, setSkillsShown] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [turn, setTurn] = useState(0);
  const [card, setCard] = useState<DeckCard | null>(null);
  const [condition, setCondition] = useState<DeckCard | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const stage = minigameStages[stageIndex]!;
  const player = players[turn]!;

  // Пул считается синхронно, чтобы не зависеть от асинхронного setState
  function draw(stageId: string, gender: string): DeckCard | null {
    for (const k of [`${stageId}:${gender}`, `${stageId}:any`]) {
      const pile = piles.get(k);
      if (pile?.length) { const c = pile[0]!; const next = new Map(piles); next.set(k, pile.slice(1)); setPiles(next); return c; }
    }
    return null;
  };

  useEffect(() => {
    if (stage.id === "zhit" && turn === 0 && !condition) {
      const c = draw("usloviya", "any"); if (c) setCondition(c);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageIndex]);

  const colorClass = useMemo(() => player.gender === "male" ? "minigame-card-male" : "minigame-card-female", [player.gender]);

  function pull() { const c = draw(stage.id, player.gender); if (!c) toast.error("Карточки этого этапа закончились"); setCard(c ?? null); if (!c) next(); }
  function swap() {
    const c = draw(stage.id, player.gender);
    if (!c) { toast.error("Больше карточек для замены нет"); return; }
    setCard(c); setPlayers((l) => l.map((p, i) => i === turn ? { ...p, swapUsed: true } : p));
  }
  function next() {
    setCard(null);
    if (turn + 1 < players.length) { setTurn(turn + 1); return; }
    if (stageIndex + 1 < minigameStages.length) { setTurn(0); setStageIndex(stageIndex + 1); setCondition(null); return; }
    setFinished(true);
  }

  if (finished) return <div className="py-16 text-center"><h2 className="font-display text-5xl">Игра завершена</h2><p className="mt-4 text-muted-foreground">Поделитесь друг с другом: что вы поняли о себе за эти 6 этапов?</p><Button size="lg" className="mt-8" onClick={onExit}><RefreshCw />Новая игра</Button></div>;

  if (!skillsShown && skills.some(Boolean)) return <div>
    <p className="eyebrow">Перед началом</p>
    <h2 className="mt-2 font-display text-5xl">Ваши навыки</h2>
    <p className="mt-3 max-w-2xl text-muted-foreground">Каждый получает карточку «Навык» и остаётся с ней до конца игры. Отвечайте через свой навык, а не через «бей, беги, замри».</p>
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{players.map((p, i) => <div key={i} className="text-center">
      <p className="mb-2 font-semibold">{p.name}</p>
      {skills[i] ? <button type="button" onClick={() => setZoom(skills[i]!.url)} className="block w-full"><img src={skills[i]!.url} alt={`Навык игрока ${p.name}`} className={`w-full rounded-xl border-4 shadow ${p.gender === "male" ? "minigame-card-male" : "minigame-card-female"}`} /></button> : <p className="text-sm text-muted-foreground">Карточек навыков не хватило</p>}
    </div>)}</div>
    <Button size="lg" className="mt-8" onClick={() => setSkillsShown(true)}>Начать первый этап <ArrowRight /></Button>
    <Dialog open={!!zoom} onOpenChange={(o) => !o && setZoom(null)}>
      <DialogContent className="max-w-3xl p-2"><DialogTitle className="sr-only">Карточка</DialogTitle>{zoom && <img src={zoom} alt="Карточка крупно" className="max-h-[85vh] w-full object-contain" />}</DialogContent>
    </Dialog>
  </div>;

  return <div>
    <div className="flex flex-wrap gap-2">{minigameStages.map((s, i) => <span key={s.id} className={`px-3 py-1 text-sm ${i === stageIndex ? "bg-foreground text-background" : i < stageIndex ? "text-muted-foreground line-through" : "border border-border"}`}>{i + 1}. {s.title}</span>)}</div>
    <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="eyebrow">Этап {stageIndex + 1} из 6</p>
        <h2 className="mt-2 font-display text-5xl">{stage.title}</h2>
        {condition && <button type="button" className="mt-6 block w-full max-w-xs" onClick={() => setZoom(condition.url)}><p className="mb-2 text-left text-sm text-muted-foreground">Условия сценария</p><img src={condition.url} alt="Условия сценария" className="w-full rounded-lg border border-border shadow" /></button>}
        <ul className="mt-6 space-y-2">{players.map((p, i) => <li key={i} className={`flex items-center gap-3 ${i === turn ? "font-semibold" : "text-muted-foreground"}`}><span className={`size-3 rounded-full ${p.gender === "male" ? "minigame-dot-male" : "minigame-dot-female"}`} />{p.name}{skills[i] && <button type="button" onClick={() => setZoom(skills[i]!.url)} className="text-xs underline">навык</button>}{p.swapUsed && <span className="text-xs">· замена использована</span>}</li>)}</ul>
      </div>
      <div className="text-center">
        <p className="text-lg">Ход: <strong>{player.name}</strong></p>
        {!card ? <button type="button" onClick={pull} className={`minigame-back ${colorClass} mx-auto mt-4`}><span>Раппóрт</span><small>Нажмите, чтобы вытянуть карточку</small></button>
          : <>
            <button type="button" className="relative mx-auto mt-4 block max-w-sm" onClick={() => setZoom(card.url)} aria-label="Увеличить карточку">
              <img src={card.url} alt={`Карточка этапа «${stage.title}»`} className={`w-full rounded-xl border-4 shadow-xl ${colorClass}`} />
              <span className="absolute bottom-3 right-3 rounded-full bg-background/90 p-2"><ZoomIn className="size-5" /></span>
            </button>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {!player.swapUsed && <Button variant="outline" onClick={swap}><RefreshCw />Поменять карточку (1 раз)</Button>}
              <Button onClick={next}>Передать ход <ArrowRight /></Button>
            </div>
          </>}
      </div>
    </div>
    <Dialog open={!!zoom} onOpenChange={(o) => !o && setZoom(null)}>
      <DialogContent className="max-w-3xl p-2"><DialogTitle className="sr-only">Карточка</DialogTitle>{zoom && <img src={zoom} alt="Карточка крупно" className="max-h-[85vh] w-full object-contain" />}</DialogContent>
    </Dialog>
  </div>;
}
