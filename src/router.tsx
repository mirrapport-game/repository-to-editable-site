import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// После обновления сайта старая вкладка может запросить файлы страниц,
// которых уже нет. В этом случае один раз перезагружаем страницу.
function installStaleChunkReload() {
  if (typeof window === "undefined") return;
  const w = window as Window & { __rapportChunkReload?: boolean };
  if (w.__rapportChunkReload) return;
  w.__rapportChunkReload = true;
  const KEY = "rapport-chunk-reload-at";
  const reloadOnce = () => {
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < 10_000) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
    window.location.reload();
    return true;
  };
  const isChunkError = (msg: string) =>
    /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(msg);
  // Do not call preventDefault: it makes the failed import resolve to `undefined`,
  // which crashes React/TanStack lazy loading with a blank screen. Let the error
  // propagate (error boundary shows a retry) and reload once in the background.
  window.addEventListener("vite:preloadError", () => {
    reloadOnce();
  });
  window.addEventListener("unhandledrejection", (e) => {
    const r = e.reason as { message?: string } | undefined;
    if (r && isChunkError(String(r.message ?? r))) reloadOnce();
  });
  window.addEventListener("error", (e) => {
    if (isChunkError(String(e.message ?? ""))) reloadOnce();
  });
}

export const getRouter = () => {
  installStaleChunkReload();
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Prerender requests pages with a trailing slash; "preserve" avoids a redirect that would skip them. Canonical tags keep one URL per page.
    trailingSlash: "preserve",
  });

  return router;
};
