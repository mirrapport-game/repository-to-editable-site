import { useCallback, useEffect, useState } from "react";
import { Gamepad2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { INDIVIDUAL_INVITE_PRICE, pickInviteQuestions, questionById, type ClubQuestion } from "@/data/club-questions";
import { createClubInvitePayment } from "@/lib/yookassa.functions";
import { clubNotify } from "@/lib/telegram-webapp.functions";

type Person = { user_id: string; display_name: string; gender: string };
type Invite = { id: string; from_user: string; to_user: string; kind: string; status: string; questions: string[]; from_answers: number[]; to_answers: number[] | null; payment_status: string; created_at: string };

const stageLabel = { meet: "При знакомстве", date: "На первом свидании", dating: "Когда начали встречаться" } as const;

function QuestionsForm({ questions, onSubmit, busy, submitLabel }: { questions: ClubQuestion[]; onSubmit: (a: number[]) => void; busy: boolean; submitLabel: string }) {
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  return <div className="space-y-5">
    {questions.map((q, qi) => <div key={q.id}><p className="text-xs uppercase tracking-widest text-primary">{stageLabel[q.stage]}</p><p className="mt-1 font-medium">{q.text}</p>
      <div className="mt-2 grid gap-2">{q.options.map((o, oi) => <Button key={o} type="button" size="sm" variant={answers[qi] === oi ? "default" : "outline"} className="h-auto justify-start whitespace-normal py-2 text-left" onClick={() => setAnswers((a) => a.map((x, i) => (i === qi ? oi : x)))}>{o}</Button>)}</div></div>)}
    <Button className="w-full" disabled={busy || answers.some((a) => a === null)} onClick={() => onSubmit(answers as number[])}>{submitLabel}</Button>
  </div>;
}

export function InviteButton({ me, to }: { me: Person; to: Person }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<"group" | "individual">("group");
  const [questions] = useState(pickInviteQuestions);
  const [busy, setBusy] = useState(false);
  const canIndividual = me.gender === "male" && to.gender === "female";

  async function send(answers: number[]) {
    setBusy(true);
    const { data, error } = await supabase.from("member_invites").insert({ from_user: me.user_id, to_user: to.user_id, kind, questions: questions.map((q) => q.id), from_answers: answers }).select("id").single();
    if (error || !data) { setBusy(false); toast.error("Не удалось отправить приглашение"); return; }
    if (kind === "group") void clubNotify({ data: { kind: "invite", id: data.id } }).catch(() => {});
    if (kind === "individual") {
      try { const { url } = await createClubInvitePayment({ data: { inviteId: data.id } }); window.location.href = url; return; }
      catch (e) { toast.error(e instanceof Error ? e.message : "Не удалось создать оплату"); }
    } else toast.success("Приглашение отправлено. Контакты откроются, если ваши ответы совпадут");
    setBusy(false); setOpen(false);
  }

  return <>
    <Button size="sm" variant="outline" onClick={() => setOpen(true)}><Gamepad2 />На игру</Button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90svh] overflow-y-auto">
      <DialogHeader><DialogTitle>Пригласить {to.display_name} на игру</DialogTitle><DialogDescription>Ответьте на три вопроса — «как бы вы поступили». {to.display_name} ответит на те же. Если совпадут хотя бы два ответа, вы оба увидите контакты друг друга.</DialogDescription></DialogHeader>
      <div className="flex flex-wrap gap-2"><Button size="sm" variant={kind === "group" ? "default" : "outline"} onClick={() => setKind("group")}>На игру в группе</Button>
        {canIndividual && <Button size="sm" variant={kind === "individual" ? "default" : "outline"} onClick={() => setKind("individual")}>Индивидуальная игра · {INDIVIDUAL_INVITE_PRICE.toLocaleString("ru-RU")} ₽</Button>}</div>
      {kind === "individual" && <p className="text-sm text-muted-foreground">Вы оплачиваете индивидуальную игру для двоих. После оплаты мы свяжемся с вами и подберём ведущего.</p>}
      <QuestionsForm questions={questions} busy={busy} onSubmit={send} submitLabel={kind === "individual" ? `Пригласить и оплатить ${INDIVIDUAL_INVITE_PRICE.toLocaleString("ru-RU")} ₽` : "Отправить приглашение"} />
    </DialogContent></Dialog>
  </>;
}

export function ClubInvites({ me }: { me: Person }) {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [contacts, setContacts] = useState<Record<string, string>>({});
  const [answering, setAnswering] = useState<Invite | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("member_invites").select("*").or(`from_user.eq.${me.user_id},to_user.eq.${me.user_id}`).order("created_at", { ascending: false });
    const list = (data ?? []) as Invite[]; setInvites(list);
    const others = [...new Set(list.map((i) => (i.from_user === me.user_id ? i.to_user : i.from_user)))];
    if (others.length) {
      const { data: p } = await supabase.from("member_profiles").select("user_id,display_name").in("user_id", others);
      setNames(Object.fromEntries((p ?? []).map((x) => [x.user_id, x.display_name])));
      const { data: c } = await supabase.from("member_contacts").select("user_id,contact").in("user_id", others);
      setContacts(Object.fromEntries((c ?? []).map((x) => [x.user_id, x.contact])));
    }
  }, [me.user_id]);
  useEffect(() => { void load(); }, [load]);

  async function answer(inv: Invite, a: number[]) {
    setBusy(true);
    const { error } = await supabase.from("member_invites").update({ to_answers: a, status: "answered" }).eq("id", inv.id);
    if (!error) void clubNotify({ data: { kind: "answered", id: inv.id } }).catch(() => {});
    setBusy(false);
    if (error) { toast.error("Не удалось сохранить ответы"); return; }
    setAnswering(null); await load();
  }
  async function decline(inv: Invite) {
    const { error } = await supabase.from("member_invites").update({ status: "declined" }).eq("id", inv.id);
    if (!error) void load();
  }

  const statusText = (i: Invite) => i.status === "matched" ? "Ответы совпали — контакты открыты" : i.status === "mismatch" ? "Ответы не совпали" : i.status === "declined" ? "Отклонено" : "Ждёт ответа";

  return <div className="mt-6 space-y-4">
    {invites.length === 0 && <p className="py-16 text-center text-muted-foreground">Приглашений пока нет. Откройте «Знакомства» и нажмите «На игру» в анкете.</p>}
    {invites.map((i) => {
      const incoming = i.to_user === me.user_id; const other = incoming ? i.from_user : i.to_user;
      return <div key={i.id} className="rounded-xl border border-border bg-card p-5">
        <p className="font-medium">{incoming ? `${names[other] ?? "Участник"} приглашает вас` : `Вы пригласили ${names[other] ?? "участницу"}`} · {i.kind === "individual" ? "индивидуальная игра" : "игра в группе"}</p>
        <p className="mt-1 text-sm text-muted-foreground">{statusText(i)}{i.kind === "individual" ? ` · ${i.payment_status === "succeeded" ? "оплачено" : "не оплачено"}` : ""}</p>
        {i.status === "matched" && <p className="mt-3 rounded-lg bg-primary/10 p-3 text-sm">Контакт: <b>{contacts[other] || "пока не указан в анкете"}</b></p>}
        {incoming && i.status === "pending" && <div className="mt-3 flex gap-2"><Button size="sm" onClick={() => setAnswering(i)}>Ответить на 3 вопроса</Button><Button size="sm" variant="outline" onClick={() => decline(i)}>Отклонить</Button></div>}
      </div>;
    })}
    <Dialog open={!!answering} onOpenChange={(o) => !o && setAnswering(null)}><DialogContent className="max-h-[90svh] overflow-y-auto">
      <DialogHeader><DialogTitle>Как бы вы поступили?</DialogTitle><DialogDescription>Если совпадут хотя бы два ответа, вы увидите контакты друг друга.</DialogDescription></DialogHeader>
      {answering && <QuestionsForm questions={answering.questions.map((id) => questionById(id)).filter(Boolean) as ClubQuestion[]} busy={busy} onSubmit={(a) => answer(answering, a)} submitLabel="Отправить ответы" />}
    </DialogContent></Dialog>
  </div>;
}
