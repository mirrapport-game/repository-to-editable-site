import { createFileRoute } from "@tanstack/react-router";
import { CaseTrainer } from "@/components/case-trainer";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/trainers")({
  head: () => ({ links: canonical("/trainers"), meta: [
    { title: "Потренируй Раппóрт — практика доверительного общения" },
    { name: "description", content: "Практика доверительного общения: выберите ответ на жизненную ситуацию и узнайте, как он влияет на контакт." },
    { property: "og:title", content: "Потренируй Раппóрт" },
    { property: "og:description", content: "Как настроить раппорт и вести сложные разговоры — потренируйтесь онлайн." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Trainers,
});

function Trainers() {
  return <>
    <section className="page-intro"><div className="section-inner py-16 md:py-24">
      <p className="eyebrow">Практика общения</p>
      <h1 className="section-title max-w-4xl">Потренируй <em>Раппóрт</em></h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Как бы вы поступили? Прочитайте ситуацию и выберите один вариант ответа, который поможет сохранить контакт. После выбора появится объяснение. Без регистрации.</p>
    </div></section>
    <section className="section"><div className="section-inner"><div id="rapport"><CaseTrainer kind="rapport" /></div></div></section>
  </>;
}
