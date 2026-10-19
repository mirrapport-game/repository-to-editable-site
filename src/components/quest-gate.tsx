import { Link, useRouterState } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useQuest } from "@/hooks/use-quest";

// Закрывает фишки (тест, тренажёры, Rapport AI) для незарегистрированных гостей.
export function QuestGate({ title, children }: { title: string; children: ReactNode }) {
  const { ready, user } = useQuest();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!ready) return <div className="min-h-40" aria-busy="true" />;
  if (user) return <>{children}</>;
  return <div className="mx-auto my-10 max-w-xl border border-primary/40 bg-card p-8 text-center">
    <Lock className="mx-auto size-8 text-primary" />
    <p className="eyebrow mt-4">Бесплатно после регистрации</p>
    <h2 className="mt-3 font-display text-4xl leading-tight">{title}</h2>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">Зарегистрируйтесь бесплатно — и сразу откроются тест, тренажёр и Rapport AI.</p>
    <Button asChild className="mt-6"><Link to="/auth" search={{ redirect: pathname }}>Зарегистрироваться и открыть</Link></Button>
  </div>;
}
