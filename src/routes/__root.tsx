import { ymInitScript, ymHit } from "@/lib/metrika";
import { useRouterState } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { BackNavigation } from "@/components/back-navigation";
import { QuestBar, QuestHide, StoryNext } from "@/components/story-next";
import { QuestProvider } from "@/hooks/use-quest";
const CookieConsent = lazy(() => import("@/components/cookie-consent").then((m) => ({ default: m.CookieConsent })));
import { BookingSection } from "@/components/booking-section";
import { SiteBookingBand } from "@/components/booking-band";
import { Toaster } from "@/components/ui/sonner";
const TelegramMiniApp = lazy(() => import("@/components/telegram-miniapp").then((m) => ({ default: m.TelegramMiniApp })));
const SitePlayer = lazy(() => import("@/components/site-player").then((m) => ({ default: m.SitePlayer })));

function NotFoundComponent() {
  if (typeof document !== "undefined") document.title = "Страница не найдена — Раппóрт";
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <title>Страница не найдена — Раппóрт</title>
      <meta name="robots" content="noindex" />
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Страница не найдена</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Такой страницы нет или она переехала.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Раппóрт — серия психологических игр" },
      { name: "description", content: "Игры «Раппóрт» для отношений, развития, команд и глубоких разговоров." },
      { name: "author", content: "Артём Ефимов" },
      { property: "og:title", content: "Раппóрт — серия психологических игр" },
      { property: "og:description", content: "Игры для глубоких разговоров и гармоничных отношений." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "theme-color", content: "#1E293B" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [
      { "@type": "Organization", "@id": "https://rapportgame.ru/#org", name: "Раппóрт", url: "https://rapportgame.ru/", founder: { "@type": "Person", name: "Артём Ефимов" }, sameAs: ["https://t.me/artem_rapport"] },
      { "@type": "WebSite", name: "Раппóрт — серия психологических игр", url: "https://rapportgame.ru/", inLanguage: "ru-RU", publisher: { "@id": "https://rapportgame.ru/#org" } },
    ] }) },
      ...(ymInitScript() ? [{ children: ymInitScript()! }] : []),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" }, { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }, { rel: "manifest", href: "/manifest.webmanifest" },
      {"rel": "preload", "as": "font", "type": "font/woff2", "href": "/fonts/282360fd-9e4a-46ce-853d-8f4dc70cbbe7/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYrXtKgS4.woff2", "crossOrigin": "anonymous"},
      {"rel": "preload", "as": "font", "type": "font/woff2", "href": "/fonts/5cf2d374-6349-4e05-a108-1106fe56592b/gNMKW3F-SZuj7xmb-HY6EQ.woff2", "crossOrigin": "anonymous"},
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.href });
  const isLanding = path.startsWith("/lp/") || path.startsWith("/investors") || path.startsWith("/market") || path.startsWith("/intensiv");
  // SPA navigation: report each client-side page change to Yandex Metrika (first load is counted by init).
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } ymHit(location.href); }, [path]);
  if (isLanding) return <QueryClientProvider client={queryClient}><QuestProvider><main><Outlet /></main><Suspense fallback={null}><SitePlayer /><TelegramMiniApp /></Suspense><Toaster richColors position="top-center" /></QuestProvider></QueryClientProvider>;

  return (
    <QueryClientProvider client={queryClient}><QuestProvider>
      <div className="min-h-screen"><SiteHeader /><QuestBar /><QuestHide><BackNavigation /></QuestHide><main><Outlet /></main><StoryNext /><QuestHide><SiteBookingBand /><BookingSection /><SiteFooter /></QuestHide></div><Suspense fallback={null}><CookieConsent /></Suspense><Suspense fallback={null}><SitePlayer /><TelegramMiniApp /></Suspense><Toaster richColors position="top-center" />
    </QuestProvider></QueryClientProvider>
  );
}
