import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/RB")({
  beforeLoad: () => { throw redirect({ to: "/games/$slug", params: { slug: "beauty" }, statusCode: 301 }); },
});
