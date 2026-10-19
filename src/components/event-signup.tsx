import { ConsentFields } from "@/components/consent-fields";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sign-up for a host's scheduled game, with an optional Telegram reminder link.
export function EventSignup({ eventId, left }: { eventId: string; left?: number | undefined }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [id, setId] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true);
    const { data, error } = await supabase.rpc("event_signup", { _event_id: eventId, _name: name, _contact: contact });
    setBusy(false);
    if (error) { toast.error(error.message.includes("Мест нет") ? "Мест больше нет" : "Не удалось записаться"); return; }
    setId(data as string);
  }

  if (id) return <div className="mt-3 text-sm"><p>Вы записаны! 🎉</p>
    <Button asChild size="sm" className="mt-2"><a href={`https://t.me/Rapport_game_bot?start=e_${id}`} target="_blank" rel="noreferrer">Напомнить в Telegram</a></Button></div>;
  if (left === 0) return <p className="mt-2 text-sm text-muted-foreground">Мест нет</p>;
  if (!open) return <Button size="sm" className="mt-3" onClick={() => setOpen(true)}>Записаться{left !== undefined ? ` · мест: ${left}` : ""}</Button>;
  return <form onSubmit={submit} className="mt-3 grid min-w-0 grid-cols-1 gap-2">
    <Input required minLength={2} placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} aria-label="Имя" />
    <Input required minLength={3} placeholder="Телефон или Telegram" value={contact} onChange={(e) => setContact(e.target.value)} aria-label="Телефон или Telegram" />
<ConsentFields />
    <Button size="sm" type="submit" disabled={busy}>{busy ? "…" : "Записаться"}</Button>
  </form>;
}
