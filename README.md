<div align="center">

# Roy UI

### Free, animated React components built with TypeScript. Zero config, RSC-safe, sub-12 KB.

[![npm version](https://img.shields.io/npm/v/@roy-ui/ui?logo=npm&label=npm&color=cb3837)](https://www.npmjs.com/package/@roy-ui/ui)
[![npm downloads](https://img.shields.io/npm/dm/@roy-ui/ui?logo=npm&label=downloads&color=cb3837)](https://www.npmjs.com/package/@roy-ui/ui)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@roy-ui/ui?logo=esbuild&label=min%2Bgzip&color=8DD6F9)](https://bundlephobia.com/package/@roy-ui/ui)
[![types](https://img.shields.io/npm/types/@roy-ui/ui?color=3178C6&logo=typescript&logoColor=white)](https://www.npmjs.com/package/@roy-ui/ui)
[![license](https://img.shields.io/github/license/DibbayajyotiRoy/RoyUI?color=22c55e)](./LICENSE)
[![release](https://github.com/DibbayajyotiRoy/RoyUI/actions/workflows/release.yml/badge.svg)](https://github.com/DibbayajyotiRoy/RoyUI/actions/workflows/release.yml)

<br />

<video
  src="https://raw.githubusercontent.com/DibbayajyotiRoy/RoyUI/main/apps/docs/lib/demo/linkedin2.mp4"
  controls
  muted
  loop
  playsinline
  width="720">
</video>

<p><sub><a href="https://github.com/DibbayajyotiRoy/RoyUI/blob/main/apps/docs/lib/demo/linkedin2.mp4">Watch the demo on GitHub</a> if the player above does not load.</sub></p>

</div>

---

## What is Roy UI?

**Roy UI** (`@roy-ui/ui`) is an open-source React component library focused on animated, micro-interactive UI primitives — gradient buttons, popovers, text-morph effects, attribution badges — written in TypeScript, shipped as tree-shakable ESM, and fully compatible with React Server Components, Next.js 15, Vite, Remix, and any modern React 18+ runtime. Install one package, import a component, ship it.

Built for developers who want the polish of a custom design system without the setup cost of one.

- **Zero runtime config** — `npm i @roy-ui/ui`, import, render.
- **Tree-shakable ESM** with first-class TypeScript types and source maps.
- **Self-contained CSS** — no Tailwind plugin, no PostCSS config, no theme provider.
- **RSC-safe** — every interactive component is correctly marked `"use client"` inside the bundle.
- **Tiny** — the entire library is **under 12 KB** minified + gzipped.
- **Provenance-signed** — every release is published to npm with [npm provenance](https://docs.npmjs.com/generating-provenance-statements) so you can verify what built it.

## Table of contents

- [Install](#install)
- [Quick start](#quick-start)
- [Components](#components)
- [Framework support](#framework-support)
- [Why Roy UI?](#why-roy-ui)
- [Requirements](#requirements)
- [Local development](#local-development)
- [Releases and versioning](#releases-and-versioning)
- [Contributing](#contributing)
- [License](#license)

## Install

```bash
npm install @roy-ui/ui
# or
pnpm add @roy-ui/ui
# or
yarn add @roy-ui/ui
# or
bun add @roy-ui/ui
```

React 18 or newer is the only peer dependency.

## Quick start

```tsx
import {
  GradientButton,
  Popover,
  TextMorph,
  MadeBy,
} from '@roy-ui/ui';

export default function Hero() {
  return (
    <main>
      <TextMorph value="Hello, world." />

      <GradientButton loading={false}>
        Get started
      </GradientButton>

      <Popover label="Help" title="Need a hand?" align="right" width="md">
        <p>Read the docs, ping the maintainer, or open an issue.</p>
      </Popover>

      <MadeBy
        name="Dibbayajyoti"
        href="https://github.com/DibbayajyotiRoy"
        position="bottom-right"
      />
    </main>
  );
}
```

> Using the Next.js App Router? Import directly from a Server Component — the interactive bits inside `@roy-ui/ui` carry their own `"use client"` boundary.

## Components

| Component | What it does | Props highlight |
| --- | --- | --- |
| [`GradientButton`](./packages/ui/src/components/gradient-button) | Animated blue–cyan gradient button with a built-in spinner. | `loading`, `loadingLabel`, `fullWidth` |
| [`Popover`](./packages/ui/src/components/popover) | Accessible click-to-open popover with corner alignment and width presets. | `align`, `width`, `defaultOpen`, `label`, `title` |
| [`TextMorph`](./packages/ui/src/components/text-morph) | Character-by-character text diff animation — great for live counters, currency tickers, and status text. | `value`, custom renderer for intermediate chars |
| [`MadeBy`](./packages/ui/src/components/made-by) | Floating "Made by ___" attribution badge with corner positioning. | `name`, `href`, `position`, `prefix` |

Each component lives in its own folder with the source `.tsx`, its CSS, and an `index.ts` re-export — so you can read the whole implementation in one click.

## Framework support

| Framework | Status |
| --- | --- |
| Next.js 13 / 14 / 15 (App Router) | Supported |
| Next.js (Pages Router) | Supported |
| Vite + React | Supported |
| Remix | Supported |
| Astro (React island) | Supported |
| Create React App | Supported |
| Plain React 18 + bundler | Supported |

## Why Roy UI?

|  | Roy UI | Radix / Headless UI | shadcn/ui |
| --- | --- | --- | --- |
| Ships visual styles | Yes | No | Yes (copy-paste) |
| One `npm install` (no CLI, no copy) | Yes | Yes | No |
| RSC-safe out of the box | Yes | Manual | Yes |
| Tailwind required | No | No | Yes |
| Animation built in | Yes | No | Sometimes |
| TypeScript-first | Yes | Yes | Yes |
| Sub-12 KB total bundle | Yes | Varies | n/a (per-component copy) |

If you want unstyled accessibility primitives, use Radix. If you want Tailwind-powered components you maintain yourself, use shadcn/ui. If you want a small drop-in set of opinionated, animated components with zero setup, use **Roy UI**.

## Requirements

- **React** `>= 18`
- A bundler that understands ESM (Vite, webpack 5, Next.js, Remix, Parcel 2 — all fine)
- **TypeScript** is optional but the package ships full `.d.ts` types

## Local development

```bash
git clone https://github.com/DibbayajyotiRoy/RoyUI.git
cd RoyUI
pnpm install
pnpm dev           # docs site on http://localhost:3050
pnpm dev:all       # library + docs in watch mode
```

Project layout:

```
packages/ui   :  @roy-ui/ui  (published to npm)
apps/docs     :  Next.js docs and live demos
```

## Releases and versioning

Releases are fully automated via [GitHub Actions](./.github/workflows/release.yml). Every push to `main`:

1. Type-checks and builds `@roy-ui/ui`
2. Bumps the patch version
3. Publishes to npm with [provenance attestation](https://docs.npmjs.com/generating-provenance-statements)
4. Pushes the bump commit and a matching `vX.Y.Z` tag
5. Creates a GitHub Release with auto-generated notes

Manual minor / major bumps: edit `packages/ui/package.json` before pushing.

## Contributing

PRs welcome. Open an issue first for anything larger than a one-line fix. A new component contribution should include:

1. The component in `packages/ui/src/components/<name>/`
2. A re-export from `packages/ui/src/index.ts`
3. A demo in `apps/docs/components/demos/`

## License

[MIT](./LICENSE) © [Dibbayajyoti Roy](https://github.com/DibbayajyotiRoy)

---

<sub>Keywords: React component library, React UI library, TypeScript components, Next.js components, React Server Components, RSC, animated React components, gradient button, popover, text morph animation, open source UI kit, free React UI components.</sub>
