import type { NextConfig } from 'next';

const config: NextConfig = {
  // @roy-ui/ui is built to dist/ via tsup (see prebuild script). Next consumes
  // it through the exports map like any normal npm package, so we don't need
  // transpilePackages here — that flag would force Next to compile the source
  // files instead, which on Vercel can yield different type inference than the
  // emitted dist/index.d.ts.
  serverExternalPackages: ['shiki'],
};

export default config;
