import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "rapport-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // storage unavailable — don't show the banner
    }
  }, []);

  function decide(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore write errors
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Использование файлов cookie"
      className="fixed inset-x-2 bottom-2 z-[65] rounded-2xl border border-border bg-background/95 p-3 shadow-lg sm:inset-x-0 sm:bottom-0 sm:rounded-none sm:p-4 backdrop-blur supports-[backdrop-filter]:bg-background/85 md:p-5"
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 sm:gap-4 sm:items-center">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 hidden size-9 sm:flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Cookie className="size-5" />
          </span>
          <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            <span className="sm:hidden">Мы используем cookie для работы сайта.</span>
            <span className="hidden sm:inline">Мы используем файлы cookie, чтобы сайт работал корректно и запоминал ваши
            настройки. Продолжая пользоваться сайтом, вы соглашаетесь с обработкой
            данных с помощью cookie.</span>
          </p>
        </div>
        <div className="ml-auto flex shrink-0 gap-2">
          <Button variant="outline" size="sm" className="px-2 sm:w-auto" onClick={() => decide("declined")}>
            Отклонить
          </Button>
          <Button size="sm" className="px-3 sm:w-auto" onClick={() => decide("accepted")}>
            Принять
          </Button>
        </div>
      </div>
    </div>
  );
}
