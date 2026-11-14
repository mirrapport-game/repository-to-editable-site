import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { phoneRegister, phoneSignIn } from "@/lib/phone-auth.functions";
import { PHONE_PASSWORD_MIN } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const INVITE_KEY = "rapport-course-invite";

// Host sign-in by phone + password; first-time hosts register with their invite code.
export function PhoneLogin() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [invite, setInvite] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("invite") || sessionStorage.getItem(INVITE_KEY);
    if (code) { setInvite(code); setMode("up"); }
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const session = mode === "in"
        ? await phoneSignIn({ data: { phone, password } })
        : await phoneRegister({ data: { phone, password, name, invite } });
      if (mode === "up") sessionStorage.setItem(INVITE_KEY, invite.trim().toUpperCase());
      const { error } = await supabase.auth.setSession(session);
      if (error) throw error;
      toast.success(mode === "in" ? "Вы вошли" : "Кабинет создан");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не удалось войти");
    } finally { setBusy(false); }
  }

  return <form onSubmit={submit} className="space-y-4 text-left">
    <div className="grid grid-cols-2 gap-1 border border-border p-1" role="tablist">
      <Button type="button" role="tab" aria-selected={mode === "in"} size="sm" variant={mode === "in" ? "default" : "ghost"} onClick={() => setMode("in")}>Войти</Button>
      <Button type="button" role="tab" aria-selected={mode === "up"} size="sm" variant={mode === "up" ? "default" : "ghost"} onClick={() => setMode("up")}>Я новый ведущий</Button>
    </div>
    {mode === "up" && <div className="space-y-2"><Label htmlFor="pl-name">Имя</Label><Input id="pl-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={100} /></div>}
    <div className="space-y-2"><Label htmlFor="pl-phone">Номер телефона</Label><Input id="pl-phone" type="tel" inputMode="tel" placeholder="+7 900 123-45-67" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" required maxLength={20} /></div>
    <div className="space-y-2"><Label htmlFor="pl-pass">{mode === "in" ? "Пароль" : "Придумайте пароль"}</Label><Input id="pl-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "in" ? "current-password" : "new-password"} required minLength={mode === "up" ? PHONE_PASSWORD_MIN : 1} maxLength={72} />
      {mode === "up" && <p className="text-xs text-muted-foreground">Не короче {PHONE_PASSWORD_MIN} символов</p>}</div>
    {mode === "up" && <div className="space-y-2"><Label htmlFor="pl-invite">Код приглашения</Label><Input id="pl-invite" value={invite} onChange={(e) => setInvite(e.target.value)} required maxLength={20} className="uppercase tracking-widest" /></div>}
    <Button type="submit" className="w-full" disabled={busy}>{busy ? "Подождите…" : mode === "in" ? "Войти по телефону" : "Создать кабинет"}</Button>
    {mode === "in" && <p className="text-xs leading-5 text-muted-foreground">Забыли пароль? Напишите Артёму — он поставит новый.</p>}
  </form>;
}
