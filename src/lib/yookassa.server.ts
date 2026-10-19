// Server-only YooKassa helper. Never import from client code.
const API_URL = "https://api.yookassa.ru/v3/payments";

function authHeader(): string {
  const shopId = process.env["YOOKASSA_SHOP_ID"];
  const secret = process.env["YOOKASSA_SECRET_KEY"];
  if (!shopId || !secret) throw new Error("YooKassa is not configured");
  return `Basic ${btoa(`${shopId}:${secret}`)}`;
}

export type YooKassaPayment = {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  paid: boolean;
  confirmation?: { confirmation_url?: string };
};

export async function createPayment(params: {
  amountRub: number;
  description: string;
  returnUrl: string;
  idempotenceKey: string;
  metadata: Record<string, string>;
}): Promise<YooKassaPayment> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Idempotence-Key": params.idempotenceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: { value: params.amountRub.toFixed(2), currency: "RUB" },
      capture: true,
      confirmation: { type: "redirect", return_url: params.returnUrl },
      description: params.description.slice(0, 128),
      metadata: params.metadata,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("YooKassa create payment failed:", res.status, text);
    throw new Error("Не удалось создать платёж. Попробуйте ещё раз.");
  }
  return (await res.json()) as YooKassaPayment;
}

export async function getPayment(paymentId: string): Promise<YooKassaPayment> {
  const res = await fetch(`${API_URL}/${paymentId}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) throw new Error(`YooKassa get payment failed: ${res.status}`);
  return (await res.json()) as YooKassaPayment;
}
