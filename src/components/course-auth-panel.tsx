import { TelegramLogin } from "@/components/telegram-login";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConsentFields } from "@/components/consent-fields";
import { Label } from "@/components/ui/label";

export function CourseAuthPanel({ title, note, returnPath, showGoogle: _g = true }: { title: string; note: string; returnPath: string; showGoogle?: boolean }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    const result = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}${returnPath}` } });
    setBusy(false);
    if (result.error) { toast.error(ruError(result.error.message)); return; }
    if (mode === "signup" && !result.data.session) toast.success("Проверьте почту и подтвердите регистрацию");
  }

  async function remindPassword() {
    const value = email.trim();
    if (!value) { toast.error("Сначала введите свой email"); return; }
    setBusy(true);
    const backTo = `${window.location.origin}/reset-password?next=${encodeURIComponent(returnPath)}`;
    const result = await supabase.auth.resetPasswordForEmail(value, { redirectTo: backTo });
    setBusy(false);
    if (result.error) { toast.error(ruError(result.error.message)); return; }
    toast.success("Письмо отправлено — откройте ссылку из почты и задайте новый пароль");
  }


  return <div className="mx-auto max-w-md py-12"><div className="border border-border bg-card p-7">
    <h2 className="font-display text-4xl">{title}</h2>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">{note}</p>
    <form className="mt-7 space-y-4" onSubmit={submit}>
      <div className="space-y-2"><Label htmlFor="course-email">Email</Label><Input id="course-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div className="space-y-2"><Label htmlFor="course-password">Пароль</Label><Input id="course-password" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
      {mode === "signin" && (
        <div className="text-right">
          <button type="button" onClick={remindPassword} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground" disabled={busy}>Забыли пароль?</button>
        </div>
      )}
      {mode === "signup" && <ConsentFields />}
      <Button className="w-full" type="submit" disabled={busy}>{mode === "signin" ? "Войти" : "Зарегистрироваться"}</Button>
    </form>
    <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />или<span className="h-px flex-1 bg-border" /></div>
    <TelegramLogin />
    <Button className="mt-3 w-full" variant="ghost" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? "Создать аккаунт" : "У меня уже есть аккаунт"}</Button>
  </div></div>;
}

function ruError(m: string) {
  const t = m.toLowerCase();
  if (t.includes("invalid login")) return "Неверный email или пароль. Если забыли пароль — нажмите «Забыли пароль?»";
  if (t.includes("not confirmed")) return "Email не подтверждён — откройте письмо со ссылкой в почте";
  if (t.includes("already registered")) return "Такой email уже зарегистрирован — войдите или восстановите пароль";
  if (t.includes("rate limit") || t.includes("security purposes")) return "Слишком много попыток, подождите минуту и попробуйте снова";
  if (t.includes("password")) return "Пароль слишком простой: минимум 6 символов, не используйте распространённые пароли";
  return "Не получилось: " + m;
}
