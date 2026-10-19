import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const stageLabels: Record<string, string> = {
  observer: "Заявка",
  demo: "Демо-игра",
  player: "Игрок",
  intensive: "Интенсив",
  game_purchase: "Покупка игры",
  package: "Пакет",
  investor: "Инвестор",
};

type FeedRow = { first_name: string; project: string; stage: string; created_at: string };

export function FocusGroupFeed() {
  const { data } = useQuery({
    queryKey: ["focus-group-feed"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("focus_group_feed");
      if (error) throw error;
      return (data ?? []) as FeedRow[];
    },
  });

  if (!data?.length) return null;

  return (
    <section className="section-inner py-12 md:py-14">
      <div className="mb-8 flex items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Фокус-группа</p>
          <h2 className="section-title">Кто уже с нами</h2>
        </div>
        <p className="hidden max-w-xs text-sm leading-6 text-muted-foreground sm:block">
          Заявки на участие в новых проектах серии — в реальном времени.
        </p>
      </div>
      <ul className="divide-y divide-border border-y border-border">
        {data.map((row, i) => (
          <li key={`${row.created_at}-${i}`} className="flex flex-wrap items-center gap-x-6 gap-y-1 py-4">
            <span className="font-display text-lg">{row.first_name}</span>
            <span className="text-sm text-muted-foreground">{row.project}</span>
            <span className="ml-auto rounded-full border border-primary/30 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-primary">
              {stageLabels[row.stage] ?? row.stage}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
