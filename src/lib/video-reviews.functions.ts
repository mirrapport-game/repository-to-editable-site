import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/public-config';

export const getPublishedVideoReviews = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env['SUPABASE_URL'] || PUBLIC_SUPABASE_URL;
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'] || PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Хранилище видеоотзывов временно недоступно");

  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await client
    .from("video_reviews")
    .select("id,title,participant,video_url,thumbnail_url,is_published,sort_order,created_at,updated_at")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Published video reviews could not be loaded:", error.message);
    return [];
  }
  return data;
});