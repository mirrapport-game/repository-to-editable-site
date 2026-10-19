import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/game")({
  beforeLoad: () => { throw redirect({ to: "/games/$slug", params: { slug: "otnosheniya" }, statusCode: 301 }); },
});
