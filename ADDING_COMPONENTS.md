# Adding a Component

Every new component must be wired into both the publishable package
(`packages/ui`) and the docs site (`apps/docs`), and then verified end-to-end
as if a stranger had just `npm install`-ed it and were following the docs.

This file is the source of truth for that process.

---

## 1. Wire it into the library (`packages/ui`)

Create a folder per component under `packages/ui/src/components/<kebab-name>/`:

```
packages/ui/src/components/<kebab-name>/
  <ComponentName>.tsx     # source
  <ComponentName>.css     # styles (if any), imported from the .tsx
  index.ts                # barrel re-export
```

The barrel must export both the component and its prop type:

```ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

Then re-export the barrel from [packages/ui/src/index.ts](packages/ui/src/index.ts):

```ts
export * from './components/<kebab-name>';
```

Notes:

- **Do not** hand-write `"use client"` at the top of the source; the tsup
  post-build hook in [tsup.config.ts](packages/ui/tsup.config.ts) re-injects
  it into the bundle entry. Writing it in source is harmless but redundant.
- The component must auto-import its own CSS. Consumers should never have
  to add a separate stylesheet import.
- Stay SSR-safe — no `window` / `document` access at module scope.

Build the package:

```bash
pnpm --filter @roy-ui/ui build
```

Inspect `packages/ui/dist/`:

- `dist/index.js` should reference your new component and (if applicable)
  `import './<ComponentName>-<hash>.css'`.
- `dist/index.d.ts` should include the new component and its prop type.
- A `<ComponentName>-<hash>.css` file should be present if the component
  ships styles.

---

## 2. Wire it into the docs site (`apps/docs`)

1. **Registry entry** — add an object to the `components` array in
   [apps/docs/lib/registry.ts](apps/docs/lib/registry.ts) with `slug`,
   `name`, `tagline`, `description`, `category`, `tags`,
   `status: 'available'`, and an `importStatement`. Set `featured: true`
   only if it should appear on the home page.

2. **Docs body** — create
   `apps/docs/components/<ComponentName>Docs.tsx` containing:
   - an Installation section
   - a minimal Usage example
   - a Props table listing every public prop, its type, default, and a
     one-line description
   - one or more runnable Examples

3. **Route wiring** — in
   [apps/docs/app/components/[slug]/page.tsx](apps/docs/app/components/[slug]/page.tsx):
   - add the slug to `docsBySlug` pointing at your new `<Name>Docs` component
   - add the matching `tocBySlug` entry so the table of contents renders

4. **Demos** — interactive demos go under
   `apps/docs/components/demos/`. Keep each demo focused on one
   behavior. Import them from the `<Name>Docs.tsx` file.

5. **Featured card (optional)** — if `featured: true`, add a card under
   `apps/docs/components/featured/` and surface it from
   [apps/docs/app/page.tsx](apps/docs/app/page.tsx).

---

## 3. Developer-usability test

The point of this step is to catch the failure mode where the component
"works in the docs site" but a real developer following the published
docs cannot get it running. Run all of A, B, and C before considering
the component done.

### A. Fresh-install simulation

Simulate what `npm install @roy-ui/ui` will give a stranger.

```bash
# 1. Build the package
pnpm --filter @roy-ui/ui build

# 2. Pack it (produces royui-ui-<version>.tgz)
cd packages/ui && npm pack

# 3. In a throwaway Next.js app (App Router, React 18+):
npm install /absolute/path/to/royui-ui-0.0.1.tgz

# 4. Paste the docs' import statement and first usage example
#    verbatim into app/page.tsx. Do not add anything the docs
#    do not mention.

# 5. Run the dev server
npm run dev
```

Verify in the browser and the terminal:

- [ ] No "Module not found" errors
- [ ] No TypeScript errors on the import or the props you used
- [ ] Component renders on first paint
- [ ] CSS is applied — no unstyled-flash, no missing layout
- [ ] No "missing `use client`" warning in the server logs
- [ ] Interactivity (clicks, hover, focus, transitions) works as
      described in the docs

### B. Docs-fidelity checks

Read the docs page as a hostile reader and verify every claim:

- [ ] Every prop in the Props table exists on the exported type
- [ ] Every default value shown in the docs matches the default in source
- [ ] Every code example pastes-and-runs with no implied helpers,
      no missing imports, and no extra setup
- [ ] Hovering the component in an IDE shows the same prop list as
      the docs (TypeScript IntelliSense parity)
- [ ] Types you mention in prose (e.g. `MadeByPosition`) are also
      exported from the package

### C. Pre-merge checklist

- [ ] Component and its prop type exported from `@roy-ui/ui`
- [ ] Component imports its own CSS — consumer needs zero CSS imports
- [ ] SSR-safe (works in a Next.js App Router server component tree)
- [ ] Registry entry added with `status: 'available'`
- [ ] Route `/components/<slug>` renders without errors
- [ ] At least one demo exists under `apps/docs/components/demos/`
- [ ] `pnpm --filter @roy-ui/ui build` succeeds
- [ ] `pnpm --filter docs build` succeeds
- [ ] Fresh-install simulation (section A) passes using **only** the
      docs' import statement and example — no extra setup required

If any box in section C is unchecked, the component is not ready to
ship and the package version should not be bumped.

---

## 4. Publishing (when shipping a release)

Only after section 3 passes for every component changed in the release:

1. Bump `version` in [packages/ui/package.json](packages/ui/package.json).
2. `pnpm --filter @roy-ui/ui build`
3. `cd packages/ui && npm publish --access public`
