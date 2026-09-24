import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';
import { SectionNavDemo, SectionNavHorizontalDemo } from './demos/SectionNavDemo';

export function SectionNavDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. An in-page 'On this page' nav with scroll-spy and a reading-progress rail. Zero dependencies, ships its own CSS."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { SectionNav } from '@roy-ui/ui';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Give each section an id and pass the same ids as items. Put the nav in a sticky column beside your content. It finds its scroller on its own: the nearest [data-scroll-root] ancestor, else the nearest scrollable ancestor, else the window."
      >
        <Example
          title="Beside a scrolling article"
          description="Scroll the box: the rail fills continuously through each section, items you've passed dim to 'read', and the glowing dot marks exactly where you are. Click an item to jump."
          code={`<aside style={{ position: 'sticky', top: 24 }}>
  <SectionNav
    title="On this page"
    items={[
      { id: 'overview', label: 'Overview' },
      { id: 'getting-started', label: 'Getting started' },
      { id: 'configuration', label: 'Configuration' },
    ]}
    onActiveChange={(id) => console.log(id)}
  />
</aside>

<section id="overview">
  <h2 data-section-heading>Overview</h2>
  …
</section>`}
        >
          <SectionNavDemo />
        </Example>
      </DocSection>

      <DocSection
        id="progress"
        eyebrow="03"
        title="Progress & orientation"
        description="The rail's fill end sits at the active item's top plus the fraction of the active section you've read times the item's height, so it moves smoothly between items and hits the bottom at the end of the page. Positions are written straight to the DOM inside requestAnimationFrame — scrolling never re-renders React. On narrow layouts use orientation='horizontal': a scrollable pill row with a thin progress bar underneath; the active pill is filled and kept in view."
      >
        <Example
          title="Horizontal"
          description="Pin it to the top of the scroll area on mobile."
          code={`<SectionNav orientation="horizontal" items={items} />`}
        >
          <SectionNavHorizontalDemo />
        </Example>
        <Code
          label="Theming"
          code={`.royui-section-nav {
  --royui-section-nav-accent: #7c3aed;
  --royui-section-nav-glow: rgba(124, 58, 237, 0.5);
  --royui-section-nav-track: #e4e7ec;
  --royui-section-nav-read: #475467;
}`}
        />
      </DocSection>

      <DocSection
        id="behavior"
        eyebrow="04"
        title="Behavior & accessibility"
        description="A section is active once its top crosses the reading line (30% down the scroller by default); at the very bottom the last section always wins, so short final sections still activate. Sections mounted later (Suspense, fetches) are picked up by a MutationObserver; pass deps to force a rescan. Clicking an item smooth-scrolls only the scroll root (honoring scroll-margin-top), replaces the URL hash and moves focus to the section's [data-section-heading] (or first heading). That item stays pinned until real user input — wheel, touch, keys, pointer — so the smooth scroll can't flicker through intermediate items. A #hash on load pins its section too. Cmd/Ctrl/Shift/middle clicks behave like normal links. The active link has aria-current='location'; the active label turns medium weight via a hidden ghost copy so its width never shifts. Under prefers-reduced-motion scrolling jumps instantly and transitions are off."
      >
        <Code
          label="Anchor markup"
          code={`<section id="configuration" style={{ scrollMarginTop: 24 }}>
  <h2 data-section-heading>Configuration</h2>
</section>`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="05"
        title="Props"
        description="Other attributes (id, style, data-*, aria-label…) are spread onto the <nav>."
      >
        <PropsTable
          rows={[
            { name: 'items', type: '{ id: string; label: ReactNode }[]', def: '—', desc: 'Sections to track, in document order. Required.' },
            { name: 'title', type: 'ReactNode', def: '—', desc: 'Small heading above the list, e.g. "On this page". Also used as aria-label when a string.' },
            { name: 'orientation', type: `'vertical' | 'horizontal'`, def: `'vertical'`, desc: 'Vertical list with rail, or scrollable pill row with a bar.' },
            { name: 'showProgress', type: 'boolean', def: 'true', desc: 'Show the reading-progress rail / bar.' },
            { name: 'readingLine', type: 'number', def: '0.3', desc: 'Fraction down the scroller where a section counts as being read.' },
            { name: 'onActiveChange', type: '(id: string) => void', def: '—', desc: 'Fires when the active section changes.' },
            { name: 'deps', type: 'unknown', def: '—', desc: 'Change it to force a rescan of the section elements.' },
            { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Color scheme; auto follows prefers-color-scheme.' },
            { name: 'className', type: 'string', def: '—', desc: 'Extra classes on the <nav>.' },
          ]}
        />
      </DocSection>
    </>
  );
}
