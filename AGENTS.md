<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep public editorial content in typed local data modules so cards, detail pages, and metadata share one source of truth.
- Store manageable video reviews in Lovable Cloud with role-based access; public pages read published rows only.
- Keep per-game galleries in the typed game catalogue so detail pages and metadata derive from one source.
- Keep the animated game-opening scene reusable across every published game detail page so carousel navigation and storytelling remain consistent.
- Keep personalized relationship-question generation in a public server function backed by a server-only AI Gateway helper so prompts and credentials never reach the browser.
- Store facilitator applications through a validated public server function; only admins may list, update, or delete them.
- Facilitator course access is invite-only and enforced in the database (lesson unlock = previous published lesson approved), so the browser can never skip ahead.
- Model cities as collections of facilitators because one city may offer several hosts and each host may work in several locations.
- Store focus-group applications through a validated public server function in the CRM so personal contacts never rely on browser-side database access.
- Render shared inner-page navigation in the root layout so every present and future route gets the same back action.
- Guest quest levels and rewards live in src/lib/quest.ts; progress is stored per user in quest_progress and gated features use QuestGate — one source for map, header badge and next-step links.
- Keep booking format values in the shared booking-format module so every public signup form and CRM entry uses the same options.
- Telegram is called directly with the TELEGRAM_BOT_TOKEN secret (workspace connector is disabled); lead alerts go only to allow-listed owner chats stored server-side.
- Game-page explanatory content (what/steps/takeaways/pricing/FAQ) lives in src/data/game-details.ts keyed by game slug, so pages stay data-driven.
- Quest UI (riddles, progress bar, header counter) renders only in visit mode "quest", entered via /quest, so the regular site stays uncluttered.
- Quest level 3 (/games in quest mode) shows practice for the game picked on level 2 (stored in localStorage "rapport-quest-game"); case trainers live in src/components/case-trainer.tsx — keeps quest steps non-repetitive.
- Released game pages and /games are prerendered at build time (vite.config.ts reads slugs from src/data/site.ts); router uses trailingSlash "preserve" because the prerenderer requests paths with a trailing slash and a redirect would skip them.

- Telegram mini-app sign-in validates WebApp initData server-side and reuses the tg<ID>@telegram.rapportgame.ru account, so site and bot share one club profile.
- Club Telegram notifications go through one authenticated server function (clubNotify) that re-checks the caller owns the invite/like/message before messaging.
- Use the existing marathon schedule for homepage games and admin date editing; host_name identifies homepage entries so booking and capacity stay unified.
- Shared consent fields span all existing form columns, never a fixed column count, to avoid creating implicit tracks in single-column forms.

- Primary navigation uses one shared link list for the horizontal navigation and the side drawer, available at every screen size; account and admin controls remain separate to keep public destinations consistent.
- The homepage reuses HeroCards and CaseTrainer for the playable cards and rapport practice; AI navigation is independent so hiding AI never hides these non-AI games.
- The schedule route and homepage reuse MarathonSchedule in homepage mode; horizontal date groups are presentation-only and preserve the existing booking data flow.
- Schedule category selection lives in a pure schedule-presentation helper; homepage deletion uses existing admin-protected RLS and checks affected rows before claiming success.
- Meeting capacity validation is shared by create, edit and duplicate actions; database constraints remain authoritative and their migrations must be applied to the existing backend before expanded limits work.

- The self-hosted Docker runtime uses Nginx for HTTP compression; application responses remain uncompressed internally to preserve compatibility with Lovable hosting.
- Self-hosted typography uses local WOFF2 subsets with optional font display and two critical Russian faces preloaded, avoiding late layout shifts and third-party font CSS.
- The schema lives in Lovable Cloud migrations under drizzle/migrations; scheduled Telegram reminders must be recreated as managed HTTP schedules, not hand-written cron SQL.
