import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/zhivaya")({
  beforeLoad: () => { throw redirect({ to: "/games/$slug", params: { slug: "zhivaya" }, statusCode: 301 }); },
});
