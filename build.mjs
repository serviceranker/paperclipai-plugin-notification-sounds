import { build } from "esbuild";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Build manifest (not bundled — just transpile TS to JS)
await build({
  entryPoints: [resolve(__dirname, "src/manifest.ts")],
  outfile: resolve(__dirname, "dist/paperclip-manifest.mjs"),
  bundle: false,
  format: "esm",
  platform: "node",
  target: "node20",
  sourcemap: true,
});

// Build worker
await build({
  entryPoints: [resolve(__dirname, "src/worker.ts")],
  outdir: resolve(__dirname, "dist"),
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node20",
  sourcemap: true,
  external: ["@paperclipai/plugin-sdk"],
});

// Build UI
await build({
  entryPoints: [resolve(__dirname, "src/ui/index.tsx")],
  outdir: resolve(__dirname, "dist/ui"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  sourcemap: true,
  jsx: "automatic",
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@paperclipai/plugin-sdk/ui",
    "@paperclipai/plugin-sdk/ui/hooks",
  ],
});

console.log("Build complete.");
