import { useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { postToChannel } from "@/lib/channel.functions";

const FOCUS_TEXT = "Набираем фокус-группу «Раппóрт»!\n\nСейчас создаём три новые игры: про продажи, для сетевых компаний и для мужчин. Участие бесплатное — вы играете первыми и помогаете сделать игру лучше.\n\nОставить заявку — на главной странице сайта.";

export function ChannelPoster() {
  const send = useServerFn(postToChannel);
  const [text, setText] = useState(FOCUS_TEXT);
  const [busy, setBusy] = useState(false);
  return <div className="mb-10 border border-primary/40 bg-card p-5">
    <p className="eyebrow">Telegram-канал @rapport_game</p>
    <p className="mt-2 text-sm text-muted-foreground">Новые игры из расписания публикуются в канал сами. Здесь можно отправить объявление о фокус-группе или любую новость.</p>
    <Textarea className="mt-3" rows={6} value={text} onChange={(e) => setText(e.target.value)} maxLength={3500} />
    <Button className="mt-3" disabled={busy} onClick={async () => {
      setBusy(true); const r = await send({ data: { text } }).catch(() => ({ ok: false, error: "Ошибка отправки" })); setBusy(false);
      if (r.ok) toast.success("Опубликовано в канале"); else toast.error(r.error);
    }}><Send /> Опубликовать в канал</Button>
  </div>;
}
