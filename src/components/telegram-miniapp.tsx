import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { telegramWebAppSignIn } from "@/lib/telegram-webapp.functions";

type TgWebApp = { initData: string; ready: () => void; expand: () => void };

/** Внутри Telegram: входит автоматически, без регистрации. Вне Telegram ничего не делает. */
export function TelegramMiniApp() {
  useEffect(() => {
    if (!/tgWebAppData=/.test(window.location.hash) && !sessionStorage.getItem("tg-webapp")) return;
    sessionStorage.setItem("tg-webapp", "1");
    const s = document.createElement("script");
    s.src = "https://telegram.org/js/telegram-web-app.js";
    s.onload = async () => {
      const app = (window as unknown as { Telegram?: { WebApp?: TgWebApp } }).Telegram?.WebApp;
      if (!app?.initData) return;
      app.ready(); app.expand();
      const { data } = await supabase.auth.getUser();
      if (data.user?.user_metadata?.["telegram_id"]) return;
      try {
        const { tokenHash } = await telegramWebAppSignIn({ data: { initData: app.initData } });
        const { error } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: tokenHash });
        if (error) throw error;
      } catch (e) { toast.error(e instanceof Error ? e.message : "Не удалось войти через Telegram"); }
    };
    document.head.appendChild(s);
  }, []);
  return null;
}
