# RoyUI

Open-source React component library. Monorepo layout:

```
packages/ui    →  @roy-ui/ui   (published to npm)
apps/docs      →  Next.js demo + docs site
```

## Getting started

```bash
pnpm install
pnpm build         # build the library once
pnpm dev           # start the docs site on http://localhost:3030
```

For watch-mode development (library + docs together):

```bash
pnpm dev:all
```

## Components

- `GradientButton` — animated blue-cyan gradient button with loading state.
