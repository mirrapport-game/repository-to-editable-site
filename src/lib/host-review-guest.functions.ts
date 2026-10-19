import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Guest reviews have no account; this placeholder id marks them in host_reviews.user_id.
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

const schema = z.object({
  hostSlug: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
  authorName: z.string().trim().min(2).max(80),
  body: z.string().trim().min(10).max(2000),
});

// Public: anyone can leave a review without signing in; it is saved as pending for moderation.
export const submitGuestHostReview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("host_reviews").insert({
      host_slug: data.hostSlug, author_name: data.authorName, body: data.body, status: "pending", user_id: GUEST_USER_ID,
    });
    if (error) { console.error("guest review insert failed", error.message); throw new Error("Не удалось отправить отзыв"); }
    return { ok: true };
  });
