import { useEffect, useState } from "react";
import { ExternalLink, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getReviewMediaUrl } from "@/lib/review-media.functions";
import { Button } from "@/components/ui/button";
import { getVideoSource, type VideoReview } from "@/lib/video-reviews";

async function signMedia(path: string) {
  const { data } = await supabase.storage.from("video-reviews").createSignedUrl(path, 3600);
  if (data?.signedUrl) return data.signedUrl;
  return (await getReviewMediaUrl({ data: { path } })).url;
}

export function VideoReviewCard({ review }: { review: VideoReview }) {
  const uploaded = review.video_url.startsWith("upload:") ? review.video_url.slice(7) : null;
  const [signed, setSigned] = useState<string | null>(null);
  useEffect(() => {
    if (!uploaded) return;
    void signMedia(uploaded).then(setSigned);
  }, [uploaded]);
  const source = uploaded ? { kind: "video" as const, src: signed ?? "" } : getVideoSource(review.video_url);
  return <article className="video-review-card">
    <div className="video-review-media">
      {source.kind === "iframe" && <iframe src={source.src} title={review.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />}
      {source.kind === "video" && source.src && <video src={source.src} poster={review.thumbnail_url ?? undefined} controls controlsList="nodownload" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} preload="metadata" />}
      {source.kind === "link" && <div className="video-review-link" style={review.thumbnail_url ? { backgroundImage: `url(${review.thumbnail_url})` } : undefined}><PlayCircle className="size-14" aria-hidden="true"/><Button asChild variant="secondary"><a href={source.src} target="_blank" rel="noreferrer">Смотреть видео <ExternalLink /></a></Button></div>}
    </div>
    <div className="p-5"><h3 className="font-display text-3xl leading-none">{review.title}</h3><p className="mt-3 text-sm text-muted-foreground">{review.participant}</p></div>
  </article>;
}