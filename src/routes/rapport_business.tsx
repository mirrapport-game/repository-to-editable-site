import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/rapport_business")({
  beforeLoad: () => { throw redirect({ to: "/games/$slug", params: { slug: "business" }, statusCode: 301 }); },
});
