// Mirrors the freshly built dist/ into the copy apps/docs actually imports.
//
// apps/docs depends on @roy-ui/ui by version (not workspace:*) so it can test
// the real published tarball. The downside: `tsup` rebuilds packages/ui/dist,
// but Next imports from node_modules/.pnpm/@roy-ui+ui@<ver>/.../dist, which the
// build never touches. Without this step, new exports (Card, TimeRangePicker,
// ImageCarousel, …) trigger "Attempted import error" until a manual resync.
//
// Runs as `postbuild` so a plain `build` keeps docs in sync. Fails soft: on a
// clean checkout (before `pnpm install` creates the symlink) it just warns.
import { existsSync, realpathSync, rmSync, cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const srcDist = resolve(here, '..', 'dist');
const docsLink = resolve(here, '..', '..', '..', 'apps', 'docs', 'node_modules', '@roy-ui', 'ui');

if (!existsSync(srcDist)) {
  console.warn('[sync-docs] no dist/ to sync — run the build first.');
  process.exit(0);
}
if (!existsSync(docsLink)) {
  console.warn('[sync-docs] apps/docs has no @roy-ui/ui installed yet — skipping (run `pnpm install`).');
  process.exit(0);
}

const destDist = resolve(realpathSync(docsLink), 'dist');
rmSync(destDist, { recursive: true, force: true });
cpSync(srcDist, destDist, { recursive: true });
console.log(`[sync-docs] synced dist → ${destDist}`);
