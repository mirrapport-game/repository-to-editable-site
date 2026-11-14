import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { phoneRegister, phoneSignIn } from "@/lib/phone-auth.functions";
import { PHONE_PASSWORD_MIN } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const INVITE_KEY = "rapport-course-invite";

function authMessage(m: string) {
  if (/invalid login credentials/i.test(m)) return "Неверная почта или пароль";
  if (/email not confirmed/i.test(m)) return "Подтвердите почту — ссылка в письме";
  if (/weak|easy to guess|pwned|leaked/i.test(m)) return "Этот пароль слишком простой или встречался в утечках — придумайте другой";
  if (/already registered|already exists/i.test(m)) return "Эта почта уже зарегистрирована — войдите с паролем";
  return m;
}

// Host sign-in by phone or email with a password; first-time hosts register with their invite code.
export function PhoneLogin() {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [invite, setInvite] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("invite") || sessionStorage.getItem(INVITE_KEY);
    if (code) { setInvite(code); setMode("up"); }
  }, []);

  async function viaPhone() {
    const session = mode === "in"
      ? await phoneSignIn({ data: { phone, password } })
      : await phoneRegister({ data: { phone, password, name, invite } });
    if (mode === "up") sessionStorage.setItem(INVITE_KEY, invite.trim().toUpperCase());
    const { error } = await supabase.auth.setSession(session);
    if (error) throw error;
    toast.success(mode === "in" ? "Вы вошли" : "Кабинет создан");
  }

  async function viaEmail() {
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw new Error(authMessage(error.message));
      toast.success("Вы вошли");
      return;
    }
    const code = invite.trim().toUpperCase();
    if (!/^[A-Z0-9]{4,20}$/.test(code)) throw new Error("Введите код приглашения от Артёма");
    sessionStorage.setItem(INVITE_KEY, code);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { emailRedirectTo: `${window.location.origin}/course?invite=${encodeURIComponent(code)}`, data: { full_name: name.trim() } },
    });
    if (error) throw new Error(authMessage(error.message));
    if (!data.session) setSent(email.trim());
    else toast.success("Кабинет создан");
  }

  async function forgot() {
    if (!email.trim()) { toast.error("Сначала укажите почту"); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    if (error) toast.error(authMessage(error.message)); else toast.success("Ссылка для нового пароля отправлена на почту");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try { await (method === "phone" ? viaPhone() : viaEmail()); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Не удалось войти"); }
    finally { setBusy(false); }
  }

  if (sent) return <div className="space-y-3 text-sm leading-6">
    <p>Мы отправили письмо на <strong>{sent}</strong>. Откройте ссылку из письма — кабинет откроется, а код приглашения применится сам.</p>
    <Button type="button" variant="outline" className="w-full" onClick={() => setSent(null)}>Назад</Button>
  </div>;

  return <form onSubmit={submit} className="space-y-4 text-left">
    <div className="grid grid-cols-2 gap-1 border border-border p-1" role="tablist" aria-label="Способ входа">
      <Button type="button" role="tab" aria-selected={method === "phone"} size="sm" variant={method === "phone" ? "secondary" : "ghost"} onClick={() => setMethod("phone")}>По телефону</Button>
      <Button type="button" role="tab" aria-selected={method === "email"} size="sm" variant={method === "email" ? "secondary" : "ghost"} onClick={() => setMethod("email")}>По почте</Button>
    </div>
    <div className="grid grid-cols-2 gap-1 border border-border p-1" role="tablist" aria-label="Вход или регистрация">
      <Button type="button" role="tab" aria-selected={mode === "in"} size="sm" variant={mode === "in" ? "default" : "ghost"} onClick={() => setMode("in")}>Войти</Button>
      <Button type="button" role="tab" aria-selected={mode === "up"} size="sm" variant={mode === "up" ? "default" : "ghost"} onClick={() => setMode("up")}>Я новый ведущий</Button>
    </div>
    {mode === "up" && <div className="space-y-2"><Label htmlFor="pl-name">Имя</Label><Input id="pl-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={100} /></div>}
    {method === "phone"
      ? <div className="space-y-2"><Label htmlFor="pl-phone">Номер телефона</Label><Input id="pl-phone" type="tel" inputMode="tel" placeholder="+7 900 123-45-67" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" required maxLength={20} /></div>
      : <div className="space-y-2"><Label htmlFor="pl-email">Почта</Label><Input id="pl-email" type="email" placeholder="name@mail.ru" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required maxLength={200} /></div>}
    <div className="space-y-2"><Label htmlFor="pl-pass">{mode === "in" ? "Пароль" : "Придумайте пароль"}</Label><Input id="pl-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "in" ? "current-password" : "new-password"} required minLength={mode === "up" ? PHONE_PASSWORD_MIN : 1} maxLength={72} />
      {mode === "up" && <p className="text-xs text-muted-foreground">Не короче {PHONE_PASSWORD_MIN} символов</p>}</div>
    {mode === "up" && <div className="space-y-2"><Label htmlFor="pl-invite">Код приглашения</Label><Input id="pl-invite" value={invite} onChange={(e) => setInvite(e.target.value)} required maxLength={20} className="uppercase tracking-widest" /></div>}
    <Button type="submit" className="w-full" disabled={busy}>{busy ? "Подождите…" : mode === "in" ? "Войти" : "Создать кабинет"}</Button>
    {mode === "in" && (method === "phone"
      ? <p className="text-xs leading-5 text-muted-foreground">Забыли пароль? Напишите Артёму — он поставит новый.</p>
      : <button type="button" className="text-xs text-primary underline-offset-4 hover:underline" onClick={() => void forgot()}>Забыли пароль?</button>)}
  </form>;
}
