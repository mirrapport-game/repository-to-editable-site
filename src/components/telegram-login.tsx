import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { telegramSignIn } from "@/lib/telegram-auth.functions";

export function TelegramLogin() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
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
    ref.current?.appendChild(s);
    return () => { s.remove(); };
  }, []);
  return <div className="flex flex-col items-center gap-2"><div ref={ref} /><p className="text-xs text-muted-foreground">Вход и регистрация в один клик</p></div>;
}
