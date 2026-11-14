import { useEffect, useState, type FormEvent } from "react";
import { Smartphone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { linkPhoneLogin } from "@/lib/phone-auth.functions";
import { formatPhone, PHONE_PASSWORD_MIN } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Lets a signed-in host set up (or change) phone + password sign-in.
export function PhoneLinkCard() {
  const [current, setCurrent] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: row } = await supabase.from("phone_logins").select("phone").eq("user_id", data.user.id).maybeSingle();
      setCurrent(row?.phone ?? null);
    });
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true);
    try {
      const res = await linkPhoneLogin({ data: { phone, password } });
      setCurrent(res.phone); setOpen(false); setPassword("");
      toast.success("Теперь можно входить по телефону и паролю");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Не удалось сохранить"); }
    finally { setBusy(false); }
  }

  return <div className="mb-8 border border-border bg-card p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="flex items-center gap-2 text-sm"><Smartphone className="h-4 w-4 text-primary" aria-hidden />
        {current ? <>Вход по телефону: <strong>{formatPhone(current)}</strong></> : "Настройте вход по номеру телефона"}</p>
      <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>{current ? "Сменить пароль" : "Настроить"}</Button>
    </div>
    {open && <form onSubmit={save} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <div className="space-y-2"><Label htmlFor="link-phone">Телефон</Label><Input id="link-phone" type="tel" inputMode="tel" placeholder="+7 900 123-45-67" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={20} /></div>
      <div className="space-y-2"><Label htmlFor="link-pass">Новый пароль</Label><Input id="link-pass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={PHONE_PASSWORD_MIN} maxLength={72} /></div>
      <Button type="submit" disabled={busy}>Сохранить</Button>
    </form>}
  </div>;
}
