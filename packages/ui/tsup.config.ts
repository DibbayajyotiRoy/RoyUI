import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  loader: {
    '.css': 'copy',
  },
  // esbuild strips top-level "use client" directives during bundling.
  // Re-inject it so the bundle remains a Client Component for React Server Components.
  onSuccess: async () => {
    const file = join('dist', 'index.js');
    const src = readFileSync(file, 'utf8');
    if (!src.startsWith('"use client"')) {
      writeFileSync(file, `"use client";\n${src}`);
    }
  },
});
