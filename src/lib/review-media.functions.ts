import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Public: returns a short-lived link to a review video/photo, only for published reviews.
export const getReviewMediaUrl = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ path: z.string().trim().min(1).max(300) }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ count: v }, { count: h }] = await Promise.all([
      supabaseAdmin.from("video_reviews").select("id", { count: "exact", head: true }).eq("is_published", true).eq("video_url", `upload:${data.path}`),
      supabaseAdmin.from("host_reviews").select("id", { count: "exact", head: true }).eq("status", "approved").or(`video_path.eq.${data.path},image_path.eq.${data.path}`),
    ]);
    if (!v && !h) return { url: null };
    const { data: s } = await supabaseAdmin.storage.from("video-reviews").createSignedUrl(data.path, 60 * 60);
    return { url: s?.signedUrl ?? null };
  });
