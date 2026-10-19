import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  validateSearch: z.object({ next: z.string().optional() }).passthrough(),
  head: () => ({
    meta: [
      { title: "Новый пароль — Раппóрт" },
      { name: "description", content: "Задайте новый пароль для входа в кабинет Раппóрт." },
      { property: "og:title", content: "Новый пароль — Раппóрт" },
      { property: "og:description", content: "Задайте новый пароль для входа в кабинет Раппóрт." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { toast.error("Пароль — минимум 6 символов"); return; }
    if (password !== repeat) { toast.error("Пароли не совпадают"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error("Ссылка устарела — запросите письмо ещё раз"); return; }
    toast.success("Новый пароль сохранён — вы вошли");
    const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/course";
    navigate({ to: target as "/" });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <form onSubmit={save} className="space-y-4 border border-border bg-card p-7">
        <h1 className="text-2xl font-semibold">Придумайте новый пароль</h1>
        <input type="password" placeholder="Новый пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-input bg-background px-3 py-2" />
        <input type="password" placeholder="Повторите пароль" value={repeat} onChange={(e) => setRepeat(e.target.value)} className="w-full border border-input bg-background px-3 py-2" />
        <button type="submit" disabled={busy} className="w-full bg-primary px-4 py-2 text-primary-foreground">{busy ? "Сохраняю…" : "Сохранить и войти"}</button>
      </form>
    </div>
  );
}
