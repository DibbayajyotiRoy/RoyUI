import { defineConfig } from 'tsup';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// esbuild strips top-level "use client" directives during bundling. Re-inject
// it into every emitted .js file (entries + shared chunks) so each one remains
// a Client Component island for React Server Components.
function injectUseClient(dir: string) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      injectUseClient(full);
    } else if (name.endsWith('.js')) {
      const src = readFileSync(full, 'utf8');
      if (!/^['"]use client['"]/.test(src)) {
        writeFileSync(full, `"use client";\n${src}`);
      }
    }
  }
}

export default defineConfig({
  // Root barrel + one entry per component, so consumers can import the whole
  // library (".") or a single component subpath ("./button"). The directory
  // structure under src/ is preserved in dist/.
  entry: ['src/index.ts', 'src/components/*/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: true,
  external: ['react', 'react-dom'],
  loader: {
    '.css': 'copy',
  },
  onSuccess: async () => {
    injectUseClient('dist');
  },
});
