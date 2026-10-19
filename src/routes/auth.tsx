import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { CourseAuthPanel } from "@/components/course-auth-panel";
import { useQuest } from "@/hooks/use-quest";

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => z.object({ redirect: z.string().optional() }).passthrough().parse(s),
  head: () => ({ meta: [
    { title: "Вход в квест «Раппóрт» — регистрация" },
    { name: "description", content: "Зарегистрируйтесь, чтобы пройти квест «Раппóрт», открыть тест, тренажёры, Rapport AI и бесплатную демо-игру." },
    { property: "og:title", content: "Квест «Раппóрт» — регистрация" },
    { property: "og:description", content: "Пройдите шесть уровней и получите бесплатную демо-игру." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const { user } = useQuest();
  const navigate = useNavigate();
  const target = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/about";
  useEffect(() => { if (user) navigate({ to: target, replace: true }); }, [user, target, navigate]);
  return <section className="section-inner">
    <h1 className="eyebrow pt-8">Вход и регистрация в квест «Раппóрт»</h1>
    <CourseAuthPanel title="Начать квест" note="Шесть уровней — и вас ждут тест, тренажёры, Rapport AI, Клуб знакомств и бесплатная демо-игра. Регистрация бесплатная." returnPath={target} showGoogle={false} />
  </section>;
}
