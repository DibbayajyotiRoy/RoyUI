<div align="center">

# Roy UI

### A modern React component library with a fully-featured DataTable, custom date range picker, and custom time picker.

#### Built for Next.js 15, Vite, Remix, TanStack Start. TypeScript-first. RSC-safe. Tree-shakable ESM. Zero config.

[![npm version](https://img.shields.io/npm/v/@roy-ui/ui?logo=npm&label=npm&color=cb3837)](https://www.npmjs.com/package/@roy-ui/ui)
[![npm downloads](https://img.shields.io/npm/dm/@roy-ui/ui?logo=npm&label=downloads&color=cb3837)](https://www.npmjs.com/package/@roy-ui/ui)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@roy-ui/ui?logo=esbuild&label=min%2Bgzip&color=8DD6F9)](https://bundlephobia.com/package/@roy-ui/ui)
[![types](https://img.shields.io/npm/types/@roy-ui/ui?color=3178C6&logo=typescript&logoColor=white)](https://www.npmjs.com/package/@roy-ui/ui)
[![license](https://img.shields.io/github/license/DibbayajyotiRoy/RoyUI?color=22c55e)](./LICENSE)
[![release](https://github.com/DibbayajyotiRoy/RoyUI/actions/workflows/release.yml/badge.svg)](https://github.com/DibbayajyotiRoy/RoyUI/actions/workflows/release.yml)
[![live docs](https://img.shields.io/badge/docs-roy--ui--docs.vercel.app-4ec6ff?logo=vercel&logoColor=white)](https://roy-ui-docs.vercel.app)

### **[Open the live documentation site →](https://roy-ui-docs.vercel.app)**

<br />

<a href="https://github.com/DibbayajyotiRoy/RoyUI/blob/main/apps/docs/lib/demo/linkedin2.mp4">
  <img
    src="https://raw.githubusercontent.com/DibbayajyotiRoy/RoyUI/main/apps/docs/lib/demo/demo.gif"
    alt="Roy UI React component library demo — animated data table with search, custom date range picker, analog time picker, pagination, column reorder, CSV export, gradient button, popover, text morph"
    width="780" />
</a>

</div>

---

## What is Roy UI?

**Roy UI** (`@roy-ui/ui`) is an **open-source React component library** for building dashboards, admin panels, internal tools, and product UIs. It ships a **fully-featured React DataTable** — with search, date range filter, time filter, sort, pagination, drag-to-reorder columns, edge-drag resize, hide / restore via a column menu, CSV / JSON export and import, and per-zone typography for headers, row-headers and cells — alongside a **custom React date range picker** (no `date-fns` dependency), a **custom React time picker** (analog wristwatch *and* digital, user-switchable), and a set of **animated micro-interaction primitives** (gradient button, popover, text morph, tree nav, attribution badge).

Every component is **written in TypeScript**, shipped as **tree-shakable ESM**, and **fully compatible with React Server Components (RSC), Next.js 15 App Router, Vite, Remix, Astro, TanStack Start**, and any modern React 18+ runtime. One `npm install`. One import. Production-ready.

Try every component live with copyable code: **[roy-ui-docs.vercel.app](https://roy-ui-docs.vercel.app)** — including the [full DataTable demo](https://roy-ui-docs.vercel.app/components/data-table) on 60 rows of synthetic order data.

## Key features

- **Drop-in React DataTable** — generic over your row type `T`, full TypeScript inference, single component wires search + date + time + sort + paginate + reorder + resize + hide + export
- **Custom React date range picker** — N-month modal (default 2), hover-preview, preset sidebar, min / max bounds, zero `date-fns` dependency
- **Custom React time picker** — **analog clock face** (drag the hour & minute hands, AM / PM segmented pill) *and* **digital** (scroll-wheel or arrow keys per segment), 12h or 24h, configurable minute step
- **Animated primitives** — gradient button with loading spinner, click-to-open popover, character-by-character text morph, file-explorer-style tree nav, floating "Made by" badge
- **Zero runtime config** — no Tailwind plugin, no PostCSS, no theme provider, no design-token boilerplate
- **TypeScript-first** — tree-shakable ESM with first-class `.d.ts` types and source maps
- **RSC-safe (React Server Components-safe)** — every interactive component carries its own `"use client"` boundary inside the published bundle; import directly from a Next.js App Router server component
- **Themed with CSS variables** — every visual surface is a CSS custom property; dark mode ships under `prefers-color-scheme`
- **Framework-agnostic** — Next.js 15, Vite, Remix, Astro (React island), TanStack Start, Create React App, any ESM bundler
- **Provenance-signed releases** — every npm publish carries [npm provenance attestation](https://docs.npmjs.com/generating-provenance-statements)
- **MIT licensed** — free for personal and commercial use

## Table of contents

- [Install](#install)
- [Quick start — DataTable](#quick-start--datatable)
- [Components](#components)
- [DataTable feature matrix](#datatable-feature-matrix)
- [Custom date range picker](#custom-date-range-picker)
- [Custom time picker](#custom-time-picker)
- [Standalone table primitives](#standalone-table-primitives)
- [React data table comparison](#react-data-table-comparison)
- [React UI library comparison](#react-ui-library-comparison)
- [Theming](#theming)
- [Framework support](#framework-support)
- [FAQ](#faq)
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

**Peer dependency:** React 18 or newer (React 19 supported).

## Quick start — DataTable

```tsx
'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@roy-ui/ui';

type Order = {
  id: string;
  customer: string;
  total: number;
  placedAt: Date;
  status: 'paid' | 'pending' | 'refunded';
};

const columns: Column<Order>[] = [
  { key: 'id', header: 'Order', accessor: (r) => r.id, isRowHeader: true },
  { key: 'customer', header: 'Customer', accessor: (r) => r.customer },
  { key: 'status', header: 'Status', accessor: (r) => r.status },
  { key: 'placedAt', header: 'Placed', accessor: (r) => r.placedAt, type: 'date' },
  { key: 'time', header: 'Time', accessor: (r) => r.placedAt, type: 'time' },
  {
    key: 'total',
    header: 'Total',
    accessor: (r) => r.total,
    type: 'number',
    cell: (v) => `$${(v as number).toFixed(2)}`,
  },
];

export default function OrdersPage({ orders }: { orders: Order[] }) {
  const [data, setData] = useState(orders);

  return (
    <DataTable<Order>
      data={data}
      columns={columns}
      visibleRows={8}
      search={{ enabled: true, placeholder: 'Search orders' }}
      dateFilter={{ column: 'placedAt', monthsVisible: 2 }}
      timeFilter={{ column: 'time', variant: 'analog', toleranceMinutes: 60 }}
      pagination={{ pageSize: 25 }}
      dataIO={{
        export: { enabled: true, filename: 'orders' },
        import: { enabled: true, onImport: setData },
      }}
      storageKey="orders-table"
    />
  );
}
```

> Using the Next.js App Router? Import directly from a Server Component — the interactive bits inside `@roy-ui/ui` carry their own `"use client"` boundary.

## Components

### Display / Data

| Component | Source | What it does |
| --- | --- | --- |
| **`DataTable<T>`** | [`data-table`](./packages/ui/src/components/data-table) | Generic, fully-featured **React data table**. Search across columns, click-to-sort, paginate, **drag headers to reorder**, **drag the right edge to resize**, **Columns menu** to hide & restore, **CSV / JSON export & import**, **per-zone typography** for headers / row-headers / cells, optional `fitColumns` to disable horizontal scroll, optional `localStorage` persistence. |
| **`Table` + parts** | [`table`](./packages/ui/src/components/table) | Standalone primitive — `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`. Scrollable rows (`visibleRows`, default 7), sticky header, density scale, inline `Spinner`. |
| **`TableSearch`** | [`table-search`](./packages/ui/src/components/table-search) | Debounced search input, clear button, controlled & uncontrolled modes. |
| **`Pagination`** | [`pagination`](./packages/ui/src/components/pagination) | Numbered pages with text Prev / Next, ellipsis, optional `Page X of Y` summary. |
| **`DateRangePicker`** | [`date-range-picker`](./packages/ui/src/components/date-range-picker) | **Custom React date range picker** — N-month modal (default 2), hover preview, preset sidebar (Today / Last 7d / Last 30d / This month / Last month), min / max bounds. |
| **`TimePicker`** | [`time-picker`](./packages/ui/src/components/time-picker) | **Custom React time picker** with **analog clock face** and **digital** variants, user-switchable. AM / PM toggle visible in both. 12h / 24h. Configurable minute step. |
| **`Spinner`** | [`table`](./packages/ui/src/components/table) | Inline animated SVG spinner — library default loading state. |
| **`TreeNav` + `TreeNavItem`** | [`tree-nav`](./packages/ui/src/components/tree-nav) | Sidebar sub-nav with file-explorer L-shaped branch connectors. Router-agnostic via `asChild`. |
| **`TextMorph`** | [`text-morph`](./packages/ui/src/components/text-morph) | Character-by-character text diff animation for live counters, currency tickers, status text. |
| **`MadeBy`** | [`made-by`](./packages/ui/src/components/made-by) | Floating "Made by ___" attribution badge with corner positioning. |

### Inputs / Overlay

| Component | Source | What it does |
| --- | --- | --- |
| **`GradientButton`** | [`gradient-button`](./packages/ui/src/components/gradient-button) | Animated blue → cyan → blue gradient CTA with a built-in loading spinner. |
| **`Popover`** | [`popover`](./packages/ui/src/components/popover) | Accessible click-to-open popover with corner alignment and width presets. |

Each component lives in its own folder with the source `.tsx`, its CSS, and an `index.ts` re-export — so you can read the whole implementation in one click.

## DataTable feature matrix

| Feature | Prop / API | Notes |
| --- | --- | --- |
| Search across all columns | `search={{ enabled: true }}` | Debounced; override matcher with `search.predicate` |
| Date range filter on a column | `dateFilter={{ column, monthsVisible }}` | 2-month modal by default; pass any N |
| Time-of-day filter on a column | `timeFilter={{ column, variant, toleranceMinutes }}` | `variant: 'analog' \| 'digital'`; user can switch from the panel |
| Click-to-sort | always on | Tri-state per column: asc → desc → off |
| Pagination | `pagination={{ pageSize }}` or `false` | Text Prev / Next + numbered pages |
| Column drag-to-reorder | `reorderable` (default `true`) | Native HTML5 DnD, drop indicator hairline |
| Column resize | `resizable` (default `true`) | Drag right edge of header; double-click resets |
| Column hide / restore | `columnMenu` (default `true`) | "Columns" popover + hidden-count chip for instant restore |
| Pinned columns | `pinned: 'left' \| 'right'` per column | Excluded from reorder |
| CSV export | `dataIO.export` | Built-in RFC 4180 writer |
| JSON export | `dataIO.export` | Native `JSON.stringify` |
| CSV / JSON import | `dataIO.import` | File picker → parsed rows → `onImport` |
| Per-zone fonts | `headerFont`, `rowHeaderFont`, `cellFont` | Plus per-column `font` |
| Persist layout | `storageKey` | Order, sizes, hidden state in `localStorage` |
| Disable horizontal scroll | `fitColumns` | Columns auto-distribute; cells wrap |
| Loading state | `loading` | Dims body, overlays inline `Spinner` |
| Custom empty slot | `empty` | Any `ReactNode` |
| Generic over row type | `DataTable<T>` | Full TypeScript inference |

## Custom date range picker

```tsx
'use client';

import { useState } from 'react';
import { DateRangePicker, type DateRange } from '@roy-ui/ui';

export function BookingPicker() {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });

  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
      monthsVisible={2}
      weekStartsOn={1}
      minDate={new Date()}
    />
  );
}
```

## Custom time picker

```tsx
'use client';

import { useState } from 'react';
import { TimePicker, type TimeValue } from '@roy-ui/ui';

export function ShiftStartPicker() {
  const [time, setTime] = useState<TimeValue | null>(null);

  return (
    <TimePicker
      value={time}
      onChange={setTime}
      variant="analog"     // or "digital" — user can switch from the panel
      hourCycle={12}       // or 24
      minuteStep={5}
    />
  );
}
```

## Standalone table primitives

If `DataTable` is more than you need, the primitives ship on their own.

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@roy-ui/ui';

<Table visibleRows={5} stickyHeader>
  <TableHeader>
    <TableRow>
      <TableHead>Order</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead align="right">Total</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {orders.map((o) => (
      <TableRow key={o.id}>
        <TableCell isRowHeader>{o.id}</TableCell>
        <TableCell>{o.customer}</TableCell>
        <TableCell align="right">${o.total.toFixed(2)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## React data table comparison

How `@roy-ui/ui` DataTable stacks up against TanStack Table, AG Grid, and Material React Table.

|  | `@roy-ui/ui` (DataTable) | TanStack Table v8 | AG Grid Community | Material React Table |
| --- | --- | --- | --- | --- |
| Ships visual styles | Yes | No (headless) | Yes | Yes (Material UI required) |
| Built-in date range filter | Yes | No (build it) | Enterprise only | No |
| Built-in time picker filter | Yes (analog + digital) | No | No | No |
| Built-in CSV / JSON export | Yes | No | Yes | Partial |
| Drag-to-reorder columns | Yes (native, no deps) | Manual + DnD library | Yes | Yes (Material UI) |
| Column resize | Yes | Manual | Yes | Yes |
| Column hide / show menu | Yes | Manual | Yes | Yes |
| Required dependency tree | React only | React only | `@ag-grid-community/*` | `@mui/*` + `@tanstack/*` |
| RSC-safe with Next.js App Router | Yes | Manual | Manual | Manual |
| TypeScript-first, generic over row type `T` | Yes | Yes | Partial | Yes |
| License | MIT | MIT | MIT (community) | MIT |

**When to use each:**

- Need **maximum flexibility, no styles, you wire everything**? Use **TanStack Table v8**.
- Need **Excel-style spreadsheet** with pivot, master-detail, infinite scroll, **enterprise license**? Use **AG Grid**.
- Already deep in **Material UI**? Use **Material React Table**.
- Need a **clean, modern React data table** with **search + date range + time + paginate + reorder + resize + hide + CSV / JSON** working out of the box in a Next.js app, zero setup? Use **Roy UI**.

## React UI library comparison

How `@roy-ui/ui` stacks up against shadcn/ui, Aceternity UI, Magic UI, Radix, and MUI.

|  | Roy UI | shadcn/ui | Aceternity / Magic UI | Radix / Headless UI | MUI |
| --- | --- | --- | --- | --- | --- |
| Single `npm install` (no CLI, no copy) | Yes | No (copy-paste CLI) | No (copy-paste) | Yes | Yes |
| Ships visual styles | Yes | Yes | Yes | No | Yes |
| RSC-safe out of the box | Yes | Yes | Manual | Manual | Manual |
| Tailwind required | No | Yes | Yes | No | No |
| Framer Motion required | No | No | Yes | No | No |
| Animation built in | Yes | Sometimes | Yes | No | Sometimes |
| Ships a full DataTable | Yes | No (build it) | No | No | Partial (DataGrid is paid) |
| TypeScript-first | Yes | Yes | Yes | Yes | Yes |
| MIT-licensed, free, open source | Yes | Yes | Yes | Yes | Yes |

**When to use each:**

- Want **unstyled accessibility primitives** with full WAI-ARIA coverage? Use **Radix UI** or **React Aria**.
- Want **Tailwind-powered components you maintain yourself**? Use **shadcn/ui**.
- Want **stunning marketing-page effects** with Framer Motion? Use **Aceternity UI** or **Magic UI**.
- Want an **enterprise design system** with hundreds of Material Design components? Use **Material UI (MUI)** or **Mantine**.
- Want a **drop-in DataTable + animated primitives**, zero setup, no Tailwind, RSC-safe, MIT? Use **Roy UI**.

## Theming

Every component exposes its visual surface as CSS custom properties. Override on the component, on a parent class, or globally on `:root`.

```css
.royui-table {
  --royui-table-bg: #ffffff;
  --royui-table-fg: #141414;
  --royui-table-border: rgba(20, 20, 20, 0.1);
  --royui-table-header-bg: #f7f7f7;
  --royui-table-cell-size: 14px;
  --royui-table-cell-font: 'Inter', system-ui, sans-serif;
}
```

A dark scheme override ships under `@media (prefers-color-scheme: dark)` for every component.

## Framework support

| Framework | Status |
| --- | --- |
| Next.js 13 / 14 / 15 (App Router) | Supported |
| Next.js (Pages Router) | Supported |
| Vite + React 18 / 19 | Supported |
| Remix | Supported |
| Astro (React island) | Supported |
| TanStack Start | Supported |
| Create React App | Supported |
| Plain React 18+ + ESM bundler | Supported |

## FAQ

**Is this a free React data table library?**
Yes. MIT licensed, free for personal and commercial use, no paid tier.

**Does the DataTable work with React Server Components and the Next.js App Router?**
Yes. The component carries its own `"use client"` boundary inside the published bundle. Import `<DataTable />` directly from a Next.js App Router server component file — no need to mark your file `"use client"`.

**Is Tailwind CSS required?**
No. Styles are scoped CSS, side-effect imported by each component. No Tailwind plugin, no PostCSS config, no theme provider.

**Can I use this alongside TanStack Table?**
Yes, but you don't need to — the DataTable here ships its own state pipeline (search → date filter → time filter → sort → paginate) and column-layout state (order, sizes, hidden). If you already use TanStack Table, the `Table`, `TableHead`, `TableRow`, `TableCell` primitives from `@roy-ui/ui` give you styled cells you can wire your TanStack instance to.

**How do I render every column without a horizontal scrollbar?**
Pass `fitColumns` to `<DataTable />` — columns will share the container width, and cell content wraps instead of overflowing.

**Can I persist the user's column layout across reloads?**
Yes — pass `storageKey="orders-table"` and column order, sizes, and hidden state are saved to `localStorage`.

**Is there a CSV import and export built in?**
Yes. `dataIO.export.enabled` adds an Export button (CSV and / or JSON); `dataIO.import.enabled` adds an Import button with a file picker. The built-in CSV writer is RFC 4180, the parser handles quoted fields and escaped quotes. Bring your own parser via `dataIO.import.parse` for Excel / Parquet / XML.

**Does the time picker support 12-hour and 24-hour cycles?**
Yes — pass `hourCycle={12}` or `hourCycle={24}`. The AM / PM segmented pill is shown in both cycles on both the analog and digital variants.

**Is the date range picker localized?**
The picker is locale-agnostic for the calendar grid; it accepts `weekStartsOn: 0..6`. Display of weekday letters uses Sunday-start English by default. Override `presets` to supply your own labels.

## Requirements

- **React** `>= 18`
- A bundler that understands ESM (Vite, webpack 5, Next.js, Remix, Parcel 2, esbuild — all fine)
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
4. A registry entry in `apps/docs/lib/registry.ts` and a docs body in `apps/docs/components/<Name>Docs.tsx`

See [`ADDING_COMPONENTS.md`](./ADDING_COMPONENTS.md) for the full checklist.

## License

[MIT](./LICENSE) © [Dibbayajyoti Roy](https://github.com/DibbayajyotiRoy)

---

<details>
<summary><strong>Topics this library covers</strong> (for search engines and AI agents)</summary>

<sub>

react data table, react data grid, react table component, react table library, react table with search, react table with pagination, react table with sort, react table drag and drop columns, react resizable columns, react column reorder, react column resize, react hide columns, react table csv export, react table json export, react table csv import, react table with filter, react table date range filter, react table time filter, react custom data table, headless react table, react component library, react ui library, react ui kit, react ui framework, react components free, open source react components, typescript react components, typescript react library, next.js 15 components, next.js app router components, next.js 14 components, next.js 13 components, react server components, RSC components, RSC-safe react library, use client react library, vite react components, remix react components, remix ui components, astro react components, tanstack start components, react 18 components, react 19 components, esm only react library, tree shakable react components, side-effect-free react ui, zero config react ui, react micro-interactions library, animated react components, react animation library, motion react components, react date picker, react date range picker, custom react date picker, two-month date range picker, multi-month calendar react, react calendar component, react time picker, custom react time picker, analog clock picker react, analog time picker, wristwatch time picker react, digital time picker react, react clock component, AM PM toggle react, react pagination component, custom react pagination, react table primitives, tanstack table alternative, tanstack table v8 alternative, ag-grid alternative, ag grid community alternative, material react table alternative, mui datagrid alternative, react table v7 alternative, shadcn ui alternative, shadcn data table, aceternity ui alternative, magic ui alternative, radix ui alternative, headless ui alternative, chakra ui alternative, mantine alternative, daisyui alternative, hero ui alternative, react aria alternative, gradient button react, animated gradient button, react CTA button, loading button react, react popover, animated popover, accessible popover, click popover react, tooltip react, react text animation, text morph react, typing animation react, animated counter react, react tree navigation, sidebar nav react, file tree nav react, docs sidebar react, made by attribution badge, floating credit badge react, MIT react library, npm react component, free react ui kit, open source design system.

</sub>
</details>

<sub>**Keywords:** React data table · React data grid · React table component · React DataTable · custom React date range picker · custom React time picker · analog clock picker · digital time picker · React pagination · column reorder · column resize · column hide · CSV export · JSON export · React component library · React UI library · TypeScript React components · Next.js 15 components · Next.js App Router · React Server Components · RSC-safe · TanStack Table alternative · AG Grid alternative · Material React Table alternative · shadcn alternative · Aceternity UI alternative · Magic UI alternative · MUI alternative · Radix alternative · animated React components · gradient button · popover · text morph · tree nav · made-by badge · React 18 · React 19 · ESM · tree-shakable · zero config · MIT · open source · free.</sub>
