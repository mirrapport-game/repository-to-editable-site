import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { telegramSignIn } from "@/lib/telegram-auth.functions";

export function TelegramLogin() {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  // The bot is bound to rapportgame.ru in BotFather; elsewhere (preview) Telegram shows "Bot domain invalid".
  const [offDomain, setOffDomain] = useState(false);
  useEffect(() => {
    if (!/(^|\.)rapportgame\.ru$/.test(window.location.hostname)) { setOffDomain(true); return; }
    (window as unknown as Record<string, unknown>)['onRapportTelegramAuth'] = async (user: Parameters<typeof telegramSignIn>[0]["data"]) => {
      try {
        const { tokenHash } = await telegramSignIn({ data: user });
        const { error } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: tokenHash });
        if (error) throw error;
        toast.success("Вы вошли через Telegram");
      } catch (e) { toast.error(e instanceof Error ? e.message : "Не удалось войти"); }
    };
    const s = document.createElement("script");
    s.src = "https://telegram.org/js/telegram-widget.js?22";
    s.async = true;
    s.setAttribute("data-telegram-login", "Rapport_game_bot");
    s.setAttribute("data-size", "large");
    s.setAttribute("data-radius", "6");
    s.setAttribute("data-request-access", "write");
    s.setAttribute("data-onauth", "onRapportTelegramAuth(user)");
    s.onerror = () => setFailed(true);
    ref.current?.appendChild(s);
    // Telegram's button is loaded from telegram.org, which some networks block; tell the visitor instead of showing nothing.
    const check = setTimeout(() => { if (!ref.current?.querySelector("iframe")) setFailed(true); }, 6000);
    return () => { clearTimeout(check); s.remove(); };
  }, []);
  if (offDomain) return <p className="text-xs leading-5 text-muted-foreground">Вход через Telegram работает на сайте rapportgame.ru.</p>;
  return <div className="flex flex-col items-center gap-2"><div ref={ref} />{failed
    ? <p className="text-xs leading-5 text-muted-foreground">Кнопка Telegram не загрузилась — похоже, Telegram недоступен в вашей сети. Обновите страницу или попробуйте позже.</p>
    : <p className="text-xs text-muted-foreground">Вход и регистрация в один клик</p>}</div>;
}
