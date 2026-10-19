import { useEffect, useState } from "react";
import { Share, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const KEY = "rapport-install-dismissed";

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    if (standalone || localStorage.getItem(KEY)) return;
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    setVisible(true);
    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e as InstallEvent); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() { localStorage.setItem(KEY, "1"); setVisible(false); }
  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") dismiss();
  }

  if (!visible) return null;
  return <section className="section border-t border-border bg-secondary"><div className="section-inner">
    <div className="relative mx-auto flex max-w-3xl flex-col gap-5 border border-border bg-card p-7 md:flex-row md:items-center">
      <button type="button" onClick={dismiss} className="absolute right-3 top-3 text-muted-foreground" aria-label="Скрыть"><X className="size-5" /></button>
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"><Smartphone /></span>
      <div className="flex-1">
        <h2 className="font-display text-3xl leading-tight">Сохраните Rapport AI на экран телефона</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {deferred ? "Возвращайтесь к вопросам для разговора в одно касание — как к приложению." :
           ios ? <>Нажмите <Share className="inline size-4 align-text-bottom" /> «Поделиться» в Safari, затем «На экран „Домой“».</> :
           "Откройте меню браузера (⋮) и выберите «Добавить на главный экран» — вопросы для разговора всегда будут под рукой."}
        </p>
      </div>
      {deferred && <Button onClick={install}>Добавить</Button>}
    </div>
  </div></section>;
}
