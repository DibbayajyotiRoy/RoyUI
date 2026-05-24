'use client';

import { type ReactNode } from 'react';
import { Popover } from '@royui/ui';
import { CodeBlock } from './CodeBlock';

export function PopoverDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package, import the component. The popover ships with its own CSS — no setup, no Tailwind config to extend."
      >
        <div className="install-grid">
          <CodeBlock tag="Terminal" code={`pnpm add @royui/ui`} />
          <CodeBlock
            tag="Import"
            code={`import { Popover } from '@royui/ui';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Click the default 'i' trigger or wire a custom one through renderTrigger. Dismisses on outside-click, Escape, or another trigger click."
      >
        <DefaultExample />
        <CustomTriggerExample />
        <AlignmentExample />
        <WidthExample />
      </DocSection>

      <DocSection
        id="theming"
        eyebrow="03"
        title="Theming"
        description="Every visual surface is wired to a CSS variable scoped to .royui-popover. Override the ones you care about — locally on a wrapper or globally on :root."
      >
        <CodeBlock
          tag="CSS"
          code={`/* Dark-theme override, scoped to a wrapper */
.dark .royui-popover {
  --royui-popover-bg: #18181b;
  --royui-popover-border: #2a2a30;
  --royui-popover-title: #ffffff;
  --royui-popover-body: rgba(255, 255, 255, 0.75);
  --royui-popover-trigger-idle: rgba(255, 255, 255, 0.5);
  --royui-popover-trigger-hover: #ffffff;
  --royui-popover-trigger-bg: rgba(255, 255, 255, 0.08);
}`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="04"
        title="Props"
        description="Render a default info trigger or take full control with renderTrigger."
      >
        <PropsTable />
      </DocSection>

      <DocSection
        id="known-limits"
        eyebrow="05"
        title="Known limits"
        description="Honest about what this version doesn't do — saves you from finding out the hard way."
      >
        <ul className="limit-list">
          <li>
            <strong>No portal.</strong> The panel is absolutely positioned
            inside the trigger's wrapper, so an ancestor with{' '}
            <code className="code-inline">overflow: hidden</code> can clip it.
            Wrap the trigger in a container with visible overflow, or pin the
            popover to a top-level area.
          </li>
          <li>
            <strong>Click only.</strong> This is a click-toggled info panel,
            not a hover tooltip. A hover variant is on the roadmap.
          </li>
          <li>
            <strong>Below-only placement.</strong> Panel opens beneath the
            trigger, aligned left or right. Auto-flip and top/side placements
            are on the roadmap.
          </li>
        </ul>
      </DocSection>
    </>
  );
}

/* ─── Examples ────────────────────────────────────────── */

function DefaultExample() {
  return (
    <Example
      title="Default trigger"
      description="The built-in 'i' button. Click to open, click outside or press Escape to dismiss."
      code={`<Popover title="How this works" align="left">
  Billed monthly. Cancel any time
  from your dashboard.
</Popover>`}
    >
      <PreviewRow label="Pricing details">
        <Popover title="How this works" align="left">
          Billed monthly. Cancel any time from your dashboard. Taxes calculated
          at checkout based on your billing address.
        </Popover>
      </PreviewRow>
    </Example>
  );
}

function CustomTriggerExample() {
  return (
    <Example
      title="Custom trigger"
      description="Use renderTrigger for any button — bell, avatar, menu icon. The render prop receives isOpen and toggle so you can style the active state and wire the click yourself."
      code={`<Popover
  align="left"
  width="md"
  title="Notifications"
  renderTrigger={({ isOpen, toggle }) => (
    <button
      onClick={toggle}
      aria-expanded={isOpen}
      className={\`btn-icon \${isOpen ? 'is-on' : ''}\`}
    >
      Notifications
    </button>
  )}
>
  No new notifications.
</Popover>`}
    >
      <Popover
        align="left"
        width="md"
        title="Notifications"
        renderTrigger={({ isOpen, toggle }) => (
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isOpen}
            className={`demo-icon-btn ${isOpen ? 'is-on' : ''}`}
          >
            <BellIcon />
            <span>Notifications</span>
          </button>
        )}
      >
        You're all caught up. No new notifications.
      </Popover>
    </Example>
  );
}

function AlignmentExample() {
  return (
    <Example
      title="Alignment"
      description="The panel anchors to the trigger's left or right edge. Use align='left' near the right edge of the page so the panel doesn't overflow."
      code={`<Popover align="left">…</Popover>
<Popover align="right">…</Popover>`}
    >
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <PreviewRow label="align=left">
          <Popover align="left" title="Anchored left">
            The panel hugs the trigger's left edge.
          </Popover>
        </PreviewRow>
        <PreviewRow label="align=right">
          <Popover align="right" title="Anchored right">
            The panel hugs the trigger's right edge — the default.
          </Popover>
        </PreviewRow>
      </div>
    </Example>
  );
}

function WidthExample() {
  return (
    <Example
      title="Width"
      description="Width takes 'sm' (280), 'md' (360, default), 'lg' (420), or any number for a custom pixel width."
      code={`<Popover width="sm">…</Popover>
<Popover width="lg">…</Popover>
<Popover width={500}>…</Popover>`}
    >
      <div style={{ display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap' }}>
        <PreviewRow label="sm">
          <Popover width="sm" align="left" title="Small panel">
            280px wide. Best for short hints.
          </Popover>
        </PreviewRow>
        <PreviewRow label="lg">
          <Popover width="lg" align="left" title="Large panel">
            420px wide. Use for richer content with multiple sentences,
            inline links, or nested elements.
          </Popover>
        </PreviewRow>
        <PreviewRow label="number">
          <Popover width={500} align="left" title="Custom width">
            Any pixel value — pass a number and the panel takes that width.
          </Popover>
        </PreviewRow>
      </div>
    </Example>
  );
}

/* ─── Primitives ──────────────────────────────────────── */

function DocSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-section" id={id}>
      <div className="doc-section__head">
        <div className="doc-section__eyebrow">{eyebrow}</div>
        <h2 className="doc-section__title">{title}</h2>
        <p className="doc-section__desc">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Example({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <article className="example">
      <header className="example__header">
        <h3 className="example__title">{title}</h3>
        <p className="example__desc">{description}</p>
      </header>
      <div className="example__preview example__preview--overflow">
        {children}
      </div>
      <div className="example__code">
        <CodeBlock code={code} />
      </div>
    </article>
  );
}

function PreviewRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="popover-row">
      <span className="popover-row__label">{label}</span>
      {children}
    </div>
  );
}

function BellIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function PropsTable() {
  const rows = [
    {
      name: 'title',
      type: 'string',
      def: '—',
      desc: 'Optional bolded header inside the panel.',
    },
    {
      name: 'align',
      type: `'left' | 'right'`,
      def: `'right'`,
      desc: 'Which edge of the trigger the panel hugs.',
    },
    {
      name: 'width',
      type: `'sm' | 'md' | 'lg' | number`,
      def: `'md'`,
      desc: 'Preset (280/360/420) or any pixel value.',
    },
    {
      name: 'label',
      type: 'string',
      def: `'Open menu'`,
      desc: 'aria-label for the default info trigger.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      def: 'false',
      desc: 'Start in the open state — handy for stories and demos.',
    },
    {
      name: 'renderTrigger',
      type: '(api) => ReactNode',
      def: '—',
      desc: 'Replace the default info button. Receives { isOpen, toggle }.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      def: '—',
      desc: 'Body content rendered inside the panel.',
    },
  ];

  return (
    <table className="props">
      <thead>
        <tr>
          <th style={{ width: '22%' }}>Prop</th>
          <th style={{ width: '28%' }}>Type</th>
          <th style={{ width: '14%' }}>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td className="prop-name"><code>{r.name}</code></td>
            <td className="prop-type"><code>{r.type}</code></td>
            <td className="prop-default"><code>{r.def}</code></td>
            <td className="prop-desc">{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
