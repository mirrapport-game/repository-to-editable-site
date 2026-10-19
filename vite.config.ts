// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Nitro's `compressPublicAssets` knob is forwarded to nitro() at runtime, but the
// wrapper's option type only lists the stable build-time keys, so assert the shape.
const nitroOptions = {
  preset: "node-server",
  output: { dir: ".output", serverDir: ".output/server", publicDir: ".output/public" },
  // Hand out .br/.gz copies of the bundled CSS, JS and prerendered pages.
  compressPublicAssets: { brotli: true, gzip: true },
} as {
  preset?: string;
  output?: { dir?: string; serverDir?: string; publicDir?: string };
};

export default defineConfig({
  nitro: nitroOptions,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
