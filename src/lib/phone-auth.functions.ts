import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/public-config";
import { normalizePhone, PHONE_LOCK_MINUTES, PHONE_MAX_FAILED_ATTEMPTS, PHONE_PASSWORD_MIN } from "./phone";

// Hosts can sign in with phone + password. The phone maps to an existing account (phone_logins),
// the password is checked by the auth service itself, and the browser only receives a session.
const WRONG = "Неверный номер телефона или пароль";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const WEAK = "Этот пароль слишком простой или встречался в утечках — придумайте другой";
const isWeak = (m?: string) => /weak|easy to guess|pwned|leaked/i.test(m ?? "");

function phoneOrThrow(v: unknown) {
  const p = normalizePhone(String(v ?? ""));
  if (!p) throw new Error("Укажите номер телефона полностью, например +7 900 123-45-67");
  return p;
}
function passwordOrThrow(v: unknown) {
  const s = String(v ?? "");
  if (s.length < PHONE_PASSWORD_MIN || s.length > 72) throw new Error(`Пароль — от ${PHONE_PASSWORD_MIN} символов`);
  return s;
}

async function passwordSession(email: string, password: string) {
  const url = process.env["SUPABASE_URL"] || PUBLIC_SUPABASE_URL;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const h = new Headers(init?.headers);
      if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
      h.set("apikey", key);
      return fetch(input, { ...init, headers: h });
    } },
  });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) return null;
  return { access_token: data.session.access_token, refresh_token: data.session.refresh_token };
}

export const phoneSignIn = createServerFn({ method: "POST" })
  .inputValidator((d: { phone: string; password: string }) => ({ phone: phoneOrThrow(d?.phone), password: String(d?.password ?? "").slice(0, 72) }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin.from("phone_logins").select("user_id, failed_attempts, locked_until").eq("phone", data.phone).maybeSingle();
    if (!row) { await wait(700); throw new Error(WRONG); }
    if (row.locked_until && new Date(row.locked_until).getTime() > Date.now()) throw new Error(`Слишком много попыток. Попробуйте через ${PHONE_LOCK_MINUTES} минут`);
    const { data: u } = await supabaseAdmin.auth.admin.getUserById(row.user_id);
    const session = u.user?.email ? await passwordSession(u.user.email, data.password) : null;
    if (!session) {
      const failed = row.failed_attempts + 1;
      const lock = failed >= PHONE_MAX_FAILED_ATTEMPTS;
      await supabaseAdmin.from("phone_logins").update({ failed_attempts: lock ? 0 : failed, locked_until: lock ? new Date(Date.now() + PHONE_LOCK_MINUTES * 60000).toISOString() : null, updated_at: new Date().toISOString() }).eq("phone", data.phone);
      await wait(700);
      throw new Error(WRONG);
    }
    await supabaseAdmin.from("phone_logins").update({ failed_attempts: 0, locked_until: null, updated_at: new Date().toISOString() }).eq("phone", data.phone);
    return session;
  });

export const phoneRegister = createServerFn({ method: "POST" })
  .inputValidator((d: { phone: string; password: string; name: string; invite: string }) => {
    const name = String(d?.name ?? "").trim();
    if (name.length < 2 || name.length > 100) throw new Error("Укажите имя");
    const invite = String(d?.invite ?? "").trim().toUpperCase();
    if (!/^[A-Z0-9]{4,20}$/.test(invite)) throw new Error("Введите код приглашения от Артёма");
    return { phone: phoneOrThrow(d?.phone), password: passwordOrThrow(d?.password), name, invite };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inv } = await supabaseAdmin.from("course_invites").select("id").eq("code", data.invite).is("used_by", null).maybeSingle();
    if (!inv) { await wait(700); throw new Error("Код приглашения не подошёл или уже использован"); }
    const { data: taken } = await supabaseAdmin.from("phone_logins").select("phone").eq("phone", data.phone).maybeSingle();
    if (taken) throw new Error("Этот номер уже зарегистрирован — войдите с паролем");
    const email = `phone${data.phone}@phone.rapportgame.ru`;
    const created = await supabaseAdmin.auth.admin.createUser({ email, password: data.password, email_confirm: true, user_metadata: { full_name: data.name, phone: data.phone } });
    if (created.error || !created.data.user) { if (isWeak(created.error?.message)) throw new Error(WEAK); console.error("phone register", created.error?.message); throw new Error("Не удалось создать кабинет, попробуйте ещё раз"); }
    const { error: mapErr } = await supabaseAdmin.from("phone_logins").insert({ phone: data.phone, user_id: created.data.user.id });
    if (mapErr) { await supabaseAdmin.auth.admin.deleteUser(created.data.user.id); throw new Error("Этот номер уже зарегистрирован — войдите с паролем"); }
    try {
      const { notifyLead } = await import("@/lib/telegram-schedule.server");
      await notifyLead(`🆕 Новый ведущий зарегистрировался по телефону\n${data.name}\n+${data.phone}`);
    } catch (e) { console.error("register notify", e); }
    const session = await passwordSession(email, data.password);
    if (!session) throw new Error("Кабинет создан — войдите по телефону и паролю");
    return session;
  });

// A signed-in host (e.g. via Telegram) links a phone and sets a password for future sign-ins.
export const linkPhoneLogin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { phone: string; password: string }) => ({ phone: phoneOrThrow(d?.phone), password: passwordOrThrow(d?.password) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: other } = await supabaseAdmin.from("phone_logins").select("user_id").eq("phone", data.phone).maybeSingle();
    if (other && other.user_id !== context.userId) throw new Error("Этот номер уже привязан к другому кабинету");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(context.userId, { password: data.password });
    if (error) throw new Error(isWeak(error.message) ? WEAK : "Не удалось сохранить пароль");
    await supabaseAdmin.from("phone_logins").delete().eq("user_id", context.userId);
    const { error: e2 } = await supabaseAdmin.from("phone_logins").insert({ phone: data.phone, user_id: context.userId });
    if (e2) throw new Error("Не удалось привязать номер");
    return { phone: data.phone };
  });

// Admin sets a new password for a host who forgot it.
export const adminResetPhonePassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { phone: string; password: string }) => ({ phone: phoneOrThrow(d?.phone), password: passwordOrThrow(d?.password) }))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Нет доступа");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin.from("phone_logins").select("user_id").eq("phone", data.phone).maybeSingle();
    if (!row) throw new Error("Ведущий с таким номером не найден");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(row.user_id, { password: data.password });
    if (error) throw new Error(isWeak(error.message) ? WEAK : "Не удалось сменить пароль");
    await supabaseAdmin.from("phone_logins").update({ failed_attempts: 0, locked_until: null, updated_at: new Date().toISOString() }).eq("phone", data.phone);
    return { ok: true };
  });
