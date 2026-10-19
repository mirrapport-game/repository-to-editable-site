// Public (non-secret) connection settings for the existing database.
// Used as a fallback when the hosting platform does not pass these values at build/run time,
// so the self-hosted site keeps working. Override with VITE_SUPABASE_* / SUPABASE_* env vars.
export const PUBLIC_SUPABASE_URL = "https://acyxzhjnjxujhjvmrhdr.supabase.co";
export const PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qFaswTxknOBeVtzfxIrTtw_JfV3aHgx";
export const PUBLIC_SUPABASE_PROJECT_ID = "acyxzhjnjxujhjvmrhdr";
