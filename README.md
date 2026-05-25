<div align="center">

# Roy UI

### Animated React components. Drop in, ship.

#### TypeScript · RSC-safe · tree-shakable · under 12 KB.

[![npm version](https://img.shields.io/npm/v/@roy-ui/ui?logo=npm&label=npm&color=cb3837)](https://www.npmjs.com/package/@roy-ui/ui)
[![npm downloads](https://img.shields.io/npm/dm/@roy-ui/ui?logo=npm&label=downloads&color=cb3837)](https://www.npmjs.com/package/@roy-ui/ui)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@roy-ui/ui?logo=esbuild&label=min%2Bgzip&color=8DD6F9)](https://bundlephobia.com/package/@roy-ui/ui)
[![types](https://img.shields.io/npm/types/@roy-ui/ui?color=3178C6&logo=typescript&logoColor=white)](https://www.npmjs.com/package/@roy-ui/ui)
[![license](https://img.shields.io/github/license/DibbayajyotiRoy/RoyUI?color=22c55e)](./LICENSE)
[![release](https://github.com/DibbayajyotiRoy/RoyUI/actions/workflows/release.yml/badge.svg)](https://github.com/DibbayajyotiRoy/RoyUI/actions/workflows/release.yml)
[![live docs](https://img.shields.io/badge/docs-roy--ui--docs.vercel.app-4ec6ff?logo=vercel&logoColor=white)](https://roy-ui-docs.vercel.app/)

### **[Open the live documentation site](https://roy-ui-docs.vercel.app/)**

<br />

<a href="https://github.com/DibbayajyotiRoy/RoyUI/blob/main/apps/docs/lib/demo/linkedin2.mp4">
  <img
    src="https://raw.githubusercontent.com/DibbayajyotiRoy/RoyUI/main/apps/docs/lib/demo/demo.gif"
    alt="Roy UI components demo — gradient button, popover, text morph, made-by badge"
    width="720" />
</a>

<p><sub>Click the GIF for the full-quality 88-second video.</sub></p>

</div>

---

## What is Roy UI?

**Roy UI** (`@roy-ui/ui`) is an **open-source React component library** focused on **animated, micro-interactive UI components** — animated gradient buttons, accessible popovers, text-morph typing effects, tree navigation, and attribution badges — written in TypeScript, shipped as tree-shakable ESM, and **fully compatible with React Server Components (RSC), Next.js 15 App Router, Vite, Remix, Astro, TanStack Start, and any modern React 18+ runtime**. Install one npm package, import a component, ship it.

Try every component live with copyable code: **[royui.dev](https://royui.dev)** (or the Vercel preview at **[roy-ui-docs.vercel.app](https://roy-ui-docs.vercel.app/)**).

Built for developers who want the polish of a custom design system without the setup cost of one — a **lightweight React UI kit** for product teams, indie hackers, and Next.js apps that need motion-first components out of the box.

- **Zero runtime config** — `npm i @roy-ui/ui`, import, render. No CLI, no copy-paste, no codegen.
- **TypeScript-first** — tree-shakable ESM with first-class `.d.ts` types and source maps.
- **Self-contained CSS** — no Tailwind plugin, no PostCSS config, no theme provider, no design-token setup.
- **React Server Components-safe (RSC-safe)** — every interactive component is correctly marked `"use client"` inside the bundle, so you can import directly from a Next.js App Router server component.
- **Tiny bundle** — the entire library is **under 12 KB** minified + gzipped, smaller than most single-component installs.
- **Animation built in** — micro-interactions and motion are part of the components, not a separate Framer Motion / motion-react setup.
- **Framework-agnostic** — works in Next.js 15, Vite, Remix, Astro (React island), TanStack Start, Create React App, and any bundler that understands ESM.
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

## Why Roy UI? (shadcn / Aceternity / Magic UI / MUI / Radix comparison)

|  | Roy UI | shadcn/ui | Aceternity UI / Magic UI | Radix / Headless UI | MUI |
| --- | --- | --- | --- | --- | --- |
| Single `npm install` (no CLI, no copy) | Yes | No (copy-paste CLI) | No (copy-paste) | Yes | Yes |
| Ships visual styles | Yes | Yes | Yes | No | Yes |
| RSC-safe out of the box | Yes | Yes | Manual | Manual | Manual |
| Tailwind required | No | Yes | Yes | No | No |
| Framer Motion required | No | No | Yes | No | No |
| Animation built in | Yes | Sometimes | Yes | No | Sometimes |
| TypeScript-first | Yes | Yes | Yes | Yes | Yes |
| Sub-12 KB total bundle | Yes | n/a (per-component) | Per-component | Varies | No (large) |
| MIT-licensed, free, open source | Yes | Yes | Yes | Yes | Yes |

**When to use what:**

- Want **unstyled accessibility primitives** with full WAI-ARIA coverage? Use **Radix UI** or **React Aria**.
- Want **Tailwind-powered components you maintain yourself**? Use **shadcn/ui**.
- Want **stunning marketing-page effects** with Framer Motion? Use **Aceternity UI** or **Magic UI**.
- Want an **enterprise design system** with hundreds of Material Design components? Use **Material UI (MUI)** or **Mantine**.
- Want a **small, drop-in set of opinionated animated components** with zero setup, zero Tailwind, RSC-safe, under 12 KB? Use **Roy UI**.

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

<details>
<summary><strong>Topics this library covers</strong> (for search)</summary>

<sub>

React component library, React UI library, React UI kit, React UI framework, React components, free React components, open source React components, TypeScript React components, TypeScript-first component library, animated React components, animated UI components, React animation library, micro-interactions, motion components, Next.js component library, Next.js 15 components, Next.js App Router components, React Server Components, RSC-safe components, `"use client"` library, Vite React components, Remix UI components, Astro React components, TanStack Start components, tree-shakable React components, side-effect-free, ESM-only React library, zero-config React UI, tiny React component library, lightweight React UI, sub-12 KB bundle, headless UI alternative, accessible React components, WAI-ARIA components, a11y components, shadcn alternative, shadcn/ui alternative, Aceternity UI alternative, Magic UI alternative, MUI alternative, Material UI alternative, Radix UI alternative, HeroUI alternative, Mantine alternative, Chakra UI alternative, DaisyUI alternative, Tailwind components, Tailwind-friendly, React gradient button, animated gradient button, React CTA button, loading button React, React popover, animated popover, React popover component, accessible popover, tooltip React, React text animation, text morph React, typing animation React, animated counter React, React tree navigation, React sidebar navigation, file-tree nav, made by badge, React attribution badge, floating credit badge, npm React component, React 18, React 19, MIT React UI library, design system.

</sub>
</details>

<sub>**Keywords:** React component library · React UI library · TypeScript React components · Next.js 15 components · React Server Components · RSC-safe · animated React components · gradient button · popover · text morph · tree nav · made-by badge · shadcn alternative · Aceternity UI alternative · Magic UI alternative · MUI alternative · Radix alternative · open source UI kit · free React UI components · tree-shakable · ESM · under 12 KB.</sub>
