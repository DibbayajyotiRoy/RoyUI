import { MadeBy } from '@royui/ui';
import type { CSSProperties, ReactNode } from 'react';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { PreviewTabs } from './PreviewTabs';

// Override position:fixed on demos so the badge stays inside the example
// preview area instead of pinning to the page corner.
const demoStyle: CSSProperties = { position: 'static' };

export function MadeByDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Drop the package in. The badge ships with its own CSS — no global setup, no positioning utilities required."
      >
        <div className="install-grid">
          <InstallTabs pkg="@royui/ui" />
          <Code label="Import" code={`import { MadeBy } from '@royui/ui';`} />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Two required props: name and href. Default position is bottom-right, default style is italic. Render once anywhere — it pins itself to the viewport, not the parent."
      >
        <Example
          title="Default"
          description="Italic name, dark pill, glass backdrop, bottom-right of the viewport."
          code={`<MadeBy
  name="Roy"
  href="https://royrana.dev"
/>`}
        >
          <MadeBy name="Roy" href="https://example.com" style={demoStyle} />
        </Example>

        <Example
          title="Custom prefix"
          description='Override the "Made by" prefix with anything — "Building by", "Crafted by", "ⓒ", etc.'
          code={`<MadeBy
  name="Roy"
  href="https://royrana.dev"
  prefix="Building by"
/>`}
        >
          <MadeBy
            name="Roy"
            href="https://example.com"
            prefix="Building by"
            style={demoStyle}
          />
        </Example>

        <Example
          title="Custom font"
          description='Pass any CSS font-family string via nameFont. Pair an italic serif for elegance, a mono for tech, or a display face for a signature look.'
          code={`<MadeBy
  name="Roy"
  href="https://royrana.dev"
  nameFont="'Playfair Display', 'Times New Roman', serif"
/>`}
        >
          <MadeBy
            name="Roy"
            href="https://example.com"
            nameFont="'Playfair Display', 'Times New Roman', serif"
            style={demoStyle}
          />
        </Example>

        <Example
          title="Roman (non-italic)"
          description="Pass nameStyle='normal' if italic doesn't fit your brand."
          code={`<MadeBy
  name="Roy"
  href="https://royrana.dev"
  nameStyle="normal"
/>`}
        >
          <MadeBy
            name="Roy"
            href="https://example.com"
            nameStyle="normal"
            style={demoStyle}
          />
        </Example>

        <Example
          title="With icon"
          description="Pass any ReactNode to the icon slot — avatar, emoji, sparkle, dot."
          code={`<MadeBy
  name="Roy"
  href="https://royrana.dev"
  icon={<Sparkle />}
/>`}
        >
          <MadeBy
            name="Roy"
            href="https://example.com"
            icon={<SparkleIcon />}
            style={demoStyle}
          />
        </Example>
      </DocSection>

      <DocSection
        id="positions"
        eyebrow="03"
        title="Positions"
        description="Four viewport corners. Default is bottom-right — the least intrusive on most layouts."
      >
        <Code
          code={`<MadeBy name="Roy" href="..." position="bottom-right" /> // default
<MadeBy name="Roy" href="..." position="bottom-left" />
<MadeBy name="Roy" href="..." position="top-right" />
<MadeBy name="Roy" href="..." position="top-left" />`}
        />
      </DocSection>

      <DocSection
        id="theming"
        eyebrow="04"
        title="Theming"
        description="Every visual surface is wired to a CSS variable scoped to .royui-madeby. Tune the palette, the shadow, even the name's font and weight without touching the component."
      >
        <Code
          label="CSS"
          lang="css"
          code={`.royui-madeby {
  --royui-madeby-bg: #ffffff;
  --royui-madeby-border: rgba(0, 0, 0, 0.08);
  --royui-madeby-prefix: rgba(0, 0, 0, 0.55);
  --royui-madeby-name: #111;
  --royui-madeby-name-hover: #6366f1;
  --royui-madeby-name-font: 'Caveat', cursive;
  --royui-madeby-name-weight: 600;
}`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="05"
        title="Props"
        description="Every native anchor attribute is forwarded — onClick, target, rel, aria-*, ref."
      >
        <PropsTable />
      </DocSection>
    </>
  );
}

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

async function Example({
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
      <header className="example__head">
        <h3 className="example__title">{title}</h3>
        <p className="example__desc">{description}</p>
      </header>
      <PreviewTabs preview={children} code={<Code code={code} />} />
    </article>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={{ color: '#4ec6ff' }}
    >
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" />
    </svg>
  );
}

function PropsTable() {
  const rows = [
    {
      name: 'name',
      type: 'string',
      def: '—',
      desc: 'Display name shown after the prefix. Required.',
    },
    {
      name: 'href',
      type: 'string',
      def: '—',
      desc: 'URL the badge links to. Required.',
    },
    {
      name: 'prefix',
      type: 'ReactNode',
      def: `'Made by'`,
      desc: 'Copy shown before the name. Accepts strings or JSX.',
    },
    {
      name: 'position',
      type: `'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'`,
      def: `'bottom-right'`,
      desc: 'Which viewport corner the badge pins to.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      def: '—',
      desc: 'Optional leading slot — avatar, mark, emoji, etc.',
    },
    {
      name: 'nameFont',
      type: 'string',
      def: 'inherit',
      desc: 'CSS font-family for the author name only.',
    },
    {
      name: 'nameStyle',
      type: `'italic' | 'normal' | 'oblique'`,
      def: `'italic'`,
      desc: 'Font style for the author name.',
    },
    {
      name: '...rest',
      type: 'AnchorHTMLAttributes',
      def: '—',
      desc: 'All native <a> props (target, rel, onClick, aria-*, ref).',
    },
  ];

  return (
    <table className="props">
      <thead>
        <tr>
          <th style={{ width: '20%' }}>Prop</th>
          <th style={{ width: '34%' }}>Type</th>
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
