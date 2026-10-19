import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { QUEST_LEVELS, questIndex } from "@/lib/quest";

type QuestState = {
  ready: boolean;
  user: User | null;
  levels: string[];
  done: number;
  total: number;
  completed: boolean;
  mark: (path: string) => void;
};

const FALLBACK: QuestState = { ready: false, user: null, levels: [], done: 0, total: QUEST_LEVELS.length, completed: false, mark: () => {} };

const QuestContext = createContext<QuestState | null>(null);

export function QuestProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [levels, setLevels] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    const load = async (u: User | null) => {
      if (!alive) return;
      setUser(u);
      if (!u) { setLevels([]); setReady(true); return; }
      const { data } = await supabase.from("quest_progress").select("levels").eq("user_id", u.id).maybeSingle();
      if (alive) { setLevels(data?.levels ?? []); setReady(true); }
    };
    supabase.auth.getUser().then(({ data }) => load(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void load(session?.user ?? null);
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  const mark = useCallback((path: string) => {
    if (!user || questIndex(path) < 0) return;
    setLevels((prev) => {
      if (prev.includes(path)) return prev;
      const next = [...prev, path];
      void supabase.from("quest_progress").upsert({ user_id: user.id, levels: next, updated_at: new Date().toISOString() });
      return next;
    });
  }, [user]);

  const done = QUEST_LEVELS.filter((l) => levels.includes(l.path)).length;
  return <QuestContext.Provider value={{ ready, user, levels, done, total: QUEST_LEVELS.length, completed: done === QUEST_LEVELS.length, mark }}>{children}</QuestContext.Provider>;
}

export function useQuest() {
  const ctx = useContext(QuestContext);
  // Безопасный запасной вариант (например, при горячей перезагрузке) вместо падения страницы.
  return ctx ?? FALLBACK;
}
