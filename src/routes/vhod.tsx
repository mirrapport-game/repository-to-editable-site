import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminCodeSignIn } from "@/lib/admin-code.functions";

export const Route = createFileRoute("/vhod")({
  head: () => ({
    meta: [
      { title: "Служебный вход — Раппóрт" },
      { name: "description", content: "Служебный вход для администратора сайта Раппóрт." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Служебный вход — Раппóрт" },
      { property: "og:description", content: "Служебный вход для администратора." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminEntry,
});

function AdminEntry() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await adminCodeSignIn({ data: { code } });
      if (!res.ok) { setError("Неверный код"); return; }
      const { error: err } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: res.tokenHash });
      if (err) throw err;
      navigate({ to: "/manage-crm" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось войти");
    } finally { setBusy(false); }
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Служебный вход</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Код доступа" autoComplete="off"
          className="rounded-md border border-input bg-background px-3 py-2" />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button disabled={busy || !code} className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50">{busy ? "Проверяю…" : "Войти"}</button>
      </form>
    </main>
  );
}
