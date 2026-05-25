# @roy-ui/ui

> Animated React components. Drop in, ship.
> TypeScript · RSC-safe · tree-shakable · under 12 KB.

[![npm version](https://img.shields.io/npm/v/@roy-ui/ui?logo=npm&label=npm&color=cb3837)](https://www.npmjs.com/package/@roy-ui/ui)
[![npm downloads](https://img.shields.io/npm/dm/@roy-ui/ui?logo=npm&label=downloads&color=cb3837)](https://www.npmjs.com/package/@roy-ui/ui)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@roy-ui/ui?logo=esbuild&label=min%2Bgzip&color=8DD6F9)](https://bundlephobia.com/package/@roy-ui/ui)
[![types](https://img.shields.io/npm/types/@roy-ui/ui?color=3178C6&logo=typescript&logoColor=white)](https://www.npmjs.com/package/@roy-ui/ui)
[![license](https://img.shields.io/npm/l/@roy-ui/ui?color=22c55e)](https://github.com/DibbayajyotiRoy/RoyUI/blob/main/LICENSE)

<a href="https://github.com/DibbayajyotiRoy/RoyUI/blob/main/apps/docs/lib/demo/linkedin2.mp4">
  <img
    src="https://raw.githubusercontent.com/DibbayajyotiRoy/RoyUI/main/apps/docs/lib/demo/demo.gif"
    alt="Roy UI components demo — gradient button, popover, text morph, made-by badge"
    width="720" />
</a>

<sub>Click the GIF for the full-quality video.</sub>

---

## What is it?

`@roy-ui/ui` is an **open-source React component library** focused on **animated, micro-interactive UI components** — animated gradient buttons, accessible popovers, text-morph typing effects, tree navigation, and attribution badges — written in **TypeScript**, shipped as **tree-shakable ESM**, and fully compatible with **React Server Components**, **Next.js 15 App Router**, **Vite**, **Remix**, **Astro**, **TanStack Start**, and any modern React 18+ runtime.

- **Zero runtime config** — install, import, render. No CLI, no copy-paste, no Tailwind plugin.
- **TypeScript-first** — tree-shakable ESM with first-class `.d.ts` types and source maps.
- **Self-contained CSS** — no Tailwind plugin, no PostCSS, no theme provider, no design tokens to wire up.
- **RSC-safe (React Server Components-safe)** — components are correctly marked `"use client"` inside the bundle, so you can import directly from a Next.js App Router server component.
- **Tiny** — the whole library is under **12 KB** minified + gzipped, smaller than most single-component installs.
- **Animation built in** — no Framer Motion / motion-react setup required.
- **Framework-agnostic** — Next.js, Vite, Remix, Astro, TanStack Start, CRA, any ESM bundler.

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

Requires React 18 or newer.

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

Using the **Next.js App Router**? Import directly from a Server Component — the interactive bits inside `@roy-ui/ui` carry their own `"use client"` boundary.

## Components

| Component | What it does |
| --- | --- |
| **`GradientButton`** | Animated blue–cyan gradient button with a built-in spinner. Props: `loading`, `loadingLabel`, `fullWidth`. |
| **`Popover`** | Accessible click-to-open popover with corner alignment (`left`/`right`) and width presets (`sm`/`md`/`lg`/number). |
| **`TextMorph`** | Character-by-character text diff animation. Great for live counters, currency tickers, and status text. |
| **`MadeBy`** | Floating "Made by ___" attribution badge with corner positioning. |

## Why use this? (shadcn / Aceternity / Magic UI / MUI / Radix comparison)

|  | `@roy-ui/ui` | shadcn/ui | Aceternity UI / Magic UI | Radix / Headless UI | MUI |
| --- | --- | --- | --- | --- | --- |
| Single `npm install` (no CLI, no copy) | Yes | No | No | Yes | Yes |
| Ships visual styles | Yes | Yes | Yes | No | Yes |
| RSC-safe out of the box | Yes | Yes | Manual | Manual | Manual |
| Tailwind required | No | Yes | Yes | No | No |
| Framer Motion required | No | No | Yes | No | No |
| Animation built in | Yes | Sometimes | Yes | No | Sometimes |
| Sub-12 KB total bundle | Yes | n/a | Per-component | Varies | No |

If you want unstyled accessibility primitives, use **Radix** or **React Aria**. If you want Tailwind components you copy-paste, use **shadcn/ui**. If you want marketing-page hero effects, use **Aceternity UI** or **Magic UI**. If you want a **small, drop-in set of animated React components with zero setup**, use **`@roy-ui/ui`**.

## Links

- **Source code:** https://github.com/DibbayajyotiRoy/RoyUI
- **Issues:** https://github.com/DibbayajyotiRoy/RoyUI/issues
- **Releases:** https://github.com/DibbayajyotiRoy/RoyUI/releases
- **Demo video:** https://github.com/DibbayajyotiRoy/RoyUI/blob/main/apps/docs/lib/demo/linkedin2.mp4

## License

[MIT](https://github.com/DibbayajyotiRoy/RoyUI/blob/main/LICENSE) © [Dibbayajyoti Roy](https://github.com/DibbayajyotiRoy)

---

<sub>**Topics:** React component library · React UI library · React UI kit · TypeScript React components · Next.js 15 components · Next.js App Router · React Server Components · RSC-safe · animated React components · React animation library · micro-interactions · tree-shakable ESM · zero-config React UI · tiny React UI · sub-12 KB · gradient button · animated gradient button · React popover · text morph · typing animation · React tree navigation · React sidebar nav · made by attribution badge · headless UI · accessible · WAI-ARIA · a11y · shadcn alternative · shadcn/ui alternative · Aceternity UI alternative · Magic UI alternative · MUI alternative · Material UI alternative · Radix alternative · HeroUI alternative · Mantine alternative · Chakra UI alternative · DaisyUI alternative · Tailwind-friendly · Vite · Remix · Astro · TanStack Start · React 18 · React 19 · MIT · open source · free.</sub>
