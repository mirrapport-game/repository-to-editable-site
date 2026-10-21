import { createServerFn } from "@tanstack/react-start";

async function digest(s: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s.trim().toUpperCase())));
}

export const adminCodeSignIn = createServerFn({ method: "POST" })
  .inputValidator((d: { code: string }) => {
    if (!d || typeof d.code !== "string" || d.code.length > 100) throw new Error("Bad data");
    return d;
  })
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_ENTRY_CODE"];
    if (!expected) throw new Error("Вход по коду не настроен");
    const [a, b] = await Promise.all([digest(data.code), digest(expected)]);
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
    await new Promise((r) => setTimeout(r, 800)); // замедляет подбор
    if (diff !== 0) return { ok: false as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin").limit(1);
    const uid = roles?.[0]?.user_id;
    if (!uid) throw new Error("Администратор не найден");
    const { data: u, error } = await supabaseAdmin.auth.admin.getUserById(uid);
    if (error || !u.user?.email) throw new Error("Администратор не найден");
    const link = await supabaseAdmin.auth.admin.generateLink({ type: "magiclink", email: u.user.email });
    if (link.error) throw new Error(link.error.message);
    return { ok: true as const, tokenHash: link.data.properties.hashed_token };
  });
