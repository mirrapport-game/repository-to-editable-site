import { createFileRoute } from "@tanstack/react-router";
import { ArticlesManager } from "@/components/articles-manager";

export const Route = createFileRoute("/manage-articles")({
  ssr: false,
  head: () => ({ meta: [{ title: "Управление статьями — Раппóрт" }, { name: "robots", content: "noindex" }] }),
  component: ArticlesManager,
});
