# @roy-ui/ui

> Free, animated React components built with TypeScript. Zero config, RSC-safe, sub-12 KB.

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

`@roy-ui/ui` is an open-source React component library focused on animated, micro-interactive UI primitives — gradient buttons, popovers, text-morph effects, attribution badges — written in TypeScript, shipped as tree-shakable ESM, and fully compatible with React Server Components, Next.js 15, Vite, Remix, and any modern React 18+ runtime.

- **Zero runtime config** — install, import, render.
- **Tree-shakable ESM** with first-class TypeScript types and source maps.
- **Self-contained CSS** — no Tailwind plugin, no PostCSS, no theme provider.
- **RSC-safe** — components are correctly marked `"use client"` inside the bundle.
- **Tiny** — the whole library is under 12 KB minified + gzipped.

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

## Why use this?

|  | `@roy-ui/ui` | Radix / Headless UI | shadcn/ui |
| --- | --- | --- | --- |
| Ships visual styles | Yes | No | Yes (copy-paste) |
| One install (no CLI, no copy) | Yes | Yes | No |
| RSC-safe out of the box | Yes | Manual | Yes |
| Tailwind required | No | No | Yes |
| Animation built in | Yes | No | Sometimes |

## Links

- **Source code:** https://github.com/DibbayajyotiRoy/RoyUI
- **Issues:** https://github.com/DibbayajyotiRoy/RoyUI/issues
- **Releases:** https://github.com/DibbayajyotiRoy/RoyUI/releases
- **Demo video:** https://github.com/DibbayajyotiRoy/RoyUI/blob/main/apps/docs/lib/demo/linkedin2.mp4

## License

[MIT](https://github.com/DibbayajyotiRoy/RoyUI/blob/main/LICENSE) © [Dibbayajyoti Roy](https://github.com/DibbayajyotiRoy)
