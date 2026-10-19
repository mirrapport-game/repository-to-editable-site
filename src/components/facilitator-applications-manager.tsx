import { useEffect, useState } from "react";
import { LogOut, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tables } from "@/integrations/supabase/types";

type Application = Tables<"facilitator_applications">;
type Status = "new" | "contacted" | "closed";
const statusLabels: Record<Status, string> = { new: "Новая", contacted: "Связались", closed: "Закрыта" };

export function FacilitatorApplicationsManager() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);

  async function loadApplications() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    setUserEmail(user?.email ?? null);
    if (!user) { setIsAdmin(false); setApplications([]); setLoading(false); return; }
    const { data: isOwner } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isOwner) { setIsAdmin(false); setLoading(false); return; }
    setIsAdmin(true);
    const { data, error } = await supabase.from("facilitator_applications").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Не удалось загрузить заявки");
    setApplications(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void loadApplications();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void loadApplications();
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function updateStatus(application: Application, status: Status) {
    const { error } = await supabase.from("facilitator_applications").update({ status, updated_at: new Date().toISOString() }).eq("id", application.id);
    if (error) { toast.error("Не удалось изменить статус"); return; }
    setApplications((current) => current.map((item) => item.id === application.id ? { ...item, status } : item));
  }

  async function removeApplication(application: Application) {
    if (!window.confirm(`Удалить заявку от ${application.name}?`)) return;
    const { error } = await supabase.from("facilitator_applications").delete().eq("id", application.id);
    if (error) { toast.error("Не удалось удалить заявку"); return; }
    setApplications((current) => current.filter((item) => item.id !== application.id));
  }

  if (loading) return <div className="py-24 text-center text-muted-foreground">Загрузка…</div>;
  if (!userEmail) return <div className="mx-auto max-w-xl border border-border bg-card p-8 text-center"><h2 className="font-display text-4xl">Сначала войдите</h2><p className="mt-4 text-muted-foreground">Войдите на странице управления видеоотзывами, затем вернитесь к заявкам.</p><Button asChild className="mt-6"><Link to="/manage-reviews">Перейти ко входу</Link></Button></div>;
  if (!isAdmin) return <div className="mx-auto max-w-xl py-20 text-center"><h2 className="font-display text-4xl">Нет доступа</h2><p className="mt-4 text-muted-foreground">Этот список доступен только владельцу сайта.</p><Button className="mt-6" variant="outline" onClick={() => supabase.auth.signOut()}><LogOut />Выйти</Button></div>;

  return <div className="mt-10"><div className="mb-7 flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-muted-foreground">{applications.length} {applications.length === 1 ? "заявка" : "заявок"}</p><Button size="icon" variant="outline" onClick={() => supabase.auth.signOut()} aria-label="Выйти"><LogOut /></Button></div>
    <div className="divide-y divide-border border-y border-border">{applications.length === 0 && <p className="py-14 text-center text-muted-foreground">Заявок пока нет.</p>}{applications.map((application) => <article key={application.id} className="grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><div><div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><h2 className="font-display text-3xl">{application.name}</h2><span className="text-sm text-muted-foreground">{application.city}</span></div><a className="mt-2 inline-block font-medium text-primary" href={`tel:${application.phone.replace(/[^+\d]/g, "")}`}>{application.phone}</a><p className="mt-2 text-sm">{application.interest}</p><p className="mt-2 text-xs text-muted-foreground">{new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(application.created_at))}</p></div><div className="flex items-center gap-2"><Select value={application.status as Status} onValueChange={(status: Status) => void updateStatus(application, status)}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(statusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select><Button size="icon" variant="outline" onClick={() => void removeApplication(application)} aria-label="Удалить заявку"><Trash2 /></Button></div></article>)}</div>
  </div>;
}