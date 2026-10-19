import type { Tables } from "@/integrations/supabase/types";

export type VideoReview = Tables<"video_reviews">;

export type VideoSource =
  | { kind: "iframe"; src: string }
  | { kind: "video"; src: string }
  | { kind: "link"; src: string };

export function getVideoSource(value: string): VideoSource {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      if (id) return { kind: "iframe", src: `https://www.youtube.com/embed/${id}` };
    }

    if (host.endsWith("youtube.com")) {
      const id = url.searchParams.get("v") ?? url.pathname.match(/\/(?:shorts|embed)\/([^/?]+)/)?.[1];
      if (id) return { kind: "iframe", src: `https://www.youtube.com/embed/${id}` };
    }

    if (host.endsWith("rutube.ru")) {
      const id = url.pathname.match(/\/(?:video|play\/embed)\/([^/?]+)/)?.[1];
      if (id) return { kind: "iframe", src: `https://rutube.ru/play/embed/${id}` };
    }

    if (host === "vk.com" && url.pathname === "/video_ext.php") {
      return { kind: "iframe", src: url.toString() };
    }

    if (host.endsWith("vkvideo.ru") || host.endsWith("vk.com")) {
      const match = `${url.pathname}${url.search}`.match(/video(-?\d+)_(\d+)/);
      if (match?.[1] && match[2]) {
        return { kind: "iframe", src: `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}&hd=2` };
      }
    }

    if (/\.(mp4|webm|ogg)(?:$|\?)/i.test(url.toString())) return { kind: "video", src: url.toString() };
    return { kind: "link", src: url.toString() };
  } catch {
    return { kind: "link", src: value };
  }
}