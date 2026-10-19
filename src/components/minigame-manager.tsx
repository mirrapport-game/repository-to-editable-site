import { useEffect, useState } from "react";
import { LogOut, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CourseAuthPanel } from "@/components/course-auth-panel";
import { Button } from "@/components/ui/button";
import { cardStageLabels, type MinigameCardStage } from "@/data/minigame";

type Row = { id: string; stage: string; gender: string; image_path: string; url?: string | undefined };
const stages = Object.keys(cardStageLabels) as MinigameCardStage[];
const genders = [{ id: "female", label: "Женские (розовые)" }, { id: "male", label: "Мужские (синие)" }, { id: "any", label: "Общие" }];

export function MinigameManager() {
  const [state, setState] = useState<"loading" | "out" | "denied" | "ok">("loading");
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState("");

  async function load() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setState("out"); return; }
    const { data: admin } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!admin) { setState("denied"); return; }
    setState("ok");
    const { data } = await supabase.from("minigame_cards").select("id,stage,gender,image_path").order("created_at");
    const list = (data ?? []) as Row[];
    if (list.length) {
      const { data: signed } = await supabase.storage.from("minigame-cards").createSignedUrls(list.map((r) => r.image_path), 3600);
      list.forEach((r, i) => { r.url = signed?.[i]?.signedUrl ?? undefined; });
    }
    setRows(list);
  }
  useEffect(() => { void load(); const { data } = supabase.auth.onAuthStateChange(() => void load()); return () => data.subscription.unsubscribe(); }, []);

  async function upload(stage: string, gender: string, files: FileList | null) {
    if (!files?.length) return;
    setBusy(`${stage}:${gender}`);
    for (const file of Array.from(files)) {
      const path = `${stage}/${gender}/${crypto.randomUUID()}.${file.name.split(".").pop() ?? "jpg"}`;
      const { error } = await supabase.storage.from("minigame-cards").upload(path, file);
      if (error) { toast.error(error.message); continue; }
      await supabase.from("minigame_cards").insert({ stage, gender, image_path: path });
    }
    setBusy(""); toast.success("Карточки загружены"); void load();
  }
  async function remove(r: Row) {
    await supabase.storage.from("minigame-cards").remove([r.image_path]);
    await supabase.from("minigame_cards").delete().eq("id", r.id);
    void load();
  }

  if (state === "loading") return <p className="py-10">Загрузка…</p>;
  if (state === "out") return <CourseAuthPanel title="Вход для владельца" note="Загрузка карточек мини-игры." returnPath="/manage-minigame" />;
  if (state === "denied") return <div className="py-16 text-center"><p>Нет доступа.</p><Button className="mt-4" variant="outline" onClick={() => supabase.auth.signOut()}><LogOut />Выйти</Button></div>;

  return <div className="mt-10 space-y-10">{stages.map((stage) => <div key={stage}>
    <h2 className="font-display text-3xl">{cardStageLabels[stage]}</h2>
    <div className="mt-4 grid gap-4 md:grid-cols-3">{genders.filter((g) => stage === "usloviya" ? g.id === "any" : true).map((g) => {
      const list = rows.filter((r) => r.stage === stage && r.gender === g.id);
      return <div key={g.id} className={`border border-border bg-card p-4 ${g.id === "male" ? "minigame-panel-male" : g.id === "female" ? "minigame-panel-female" : ""}`}>
        <div className="flex items-center justify-between"><p className="font-medium">{g.label} · {list.length}</p>
          <label className="inline-flex cursor-pointer items-center gap-1 text-sm text-primary"><Upload className="size-4" />{busy === `${stage}:${g.id}` ? "Загрузка…" : "Добавить"}<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(stage, g.id, e.target.files)} /></label></div>
        <div className="mt-3 grid grid-cols-3 gap-2">{list.map((r) => <div key={r.id} className="relative">{r.url && <img src={r.url} alt="" className="aspect-[3/4] w-full rounded object-cover" />}<button type="button" onClick={() => remove(r)} className="absolute right-1 top-1 rounded bg-background/90 p-1" aria-label="Удалить"><Trash2 className="size-3" /></button></div>)}</div>
      </div>;
    })}</div>
  </div>)}</div>;
}
