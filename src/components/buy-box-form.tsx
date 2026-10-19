import { ConsentFields } from "@/components/consent-fields";
import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBoxOrderPayment } from "@/lib/yookassa.functions";
import { boxPrice } from "@/data/prices";

export function BuyBoxForm({ gameSlug, gameTitle }: { gameSlug: string; gameTitle: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);

  useState(() => {
    void supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  });

  const price = boxPrice(gameSlug);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { url } = await createBoxOrderPayment({ data: { gameSlug, contact: contact.trim(), city: city.trim(), address: address.trim() } });
      window.location.href = url;
    } catch (err) {
      setBusy(false);
      toast.error(err instanceof Error ? err.message : "Не удалось создать оплату");
    }
  }

  if (!userId) {
    return <p className="mt-6 text-muted-foreground">Чтобы купить коробку, <Link to="/community" className="text-primary underline">войдите в клуб «Раппóрт»</Link> — заказ привяжется к вашему аккаунту.</p>;
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2">
      <div className="space-y-2"><Label htmlFor="b-contact">Телефон или Telegram</Label><Input id="b-contact" value={contact} onChange={(e) => setContact(e.target.value)} required minLength={3} maxLength={150} /></div>
      <div className="space-y-2"><Label htmlFor="b-city">Город</Label><Input id="b-city" value={city} onChange={(e) => setCity(e.target.value)} required minLength={2} maxLength={100} /></div>
      <div className="space-y-2 sm:col-span-2"><Label htmlFor="b-address">Адрес доставки (необязательно)</Label><Input id="b-address" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={300} placeholder="Уточним доставку после оплаты" /></div>
<ConsentFields />
      <Button type="submit" disabled={busy} className="sm:col-span-2 sm:justify-self-start">
        {busy ? "Создаём оплату…" : `Купить коробку «${gameTitle}» — ${price.toLocaleString("ru-RU")} ₽`}
      </Button>
      <p className="text-xs text-muted-foreground sm:col-span-2">Оплата картой через ЮKassa. После оплаты мы свяжемся с вами для отправки.</p>
    </form>
  );
}
