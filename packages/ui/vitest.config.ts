import { defineConfig } from 'vitest/config';

// Unit tests cover the form engine's PURE modules only (paths, validation,
// reducer) — no DOM, so the default node environment is enough. Components stay
// on manual + fresh-install verification.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    // Pure modules run in node; the one render-count probe opts into jsdom via a
    // per-file `// @vitest-environment jsdom` pragma.
    environment: 'node',
  },
});
