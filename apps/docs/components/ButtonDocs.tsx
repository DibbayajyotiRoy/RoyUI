import { Button } from '@roy-ui/ui/button';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { PreviewTabs } from './PreviewTabs';
import { ButtonLoadingDemo } from './demos/ButtonLoadingDemo';
import { ButtonColorPlayground } from './demos/ButtonColorPlayground';
import type { ReactNode } from 'react';

export function ButtonDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package to your project. Components ship with their own CSS — no global setup."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { Button } from '@roy-ui/ui';

// or import just this component (its own 'use client' island):
import { Button } from '@roy-ui/ui/button';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Inline by default. The depth is intrinsic — gradient and inner shadows — so it reads the same on light or dark backgrounds without a heavy drop shadow."
      >
        <Example
          title="Default"
          description="Sized to its content. Press it — the lit top edge dips into the face."
          code={`<Button onClick={handleClick}>Post</Button>`}
        >
          <Button>Post</Button>
        </Example>

        <Example
          title="Sizes"
          description="Three scales. The corner radius scales with the box, so the proportions hold."
          code={`<Button size="sm">Post</Button>
<Button size="md">Post</Button>
<Button size="lg">Post</Button>`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button size="sm">Post</Button>
            <Button size="md">Post</Button>
            <Button size="lg">Post</Button>
          </div>
        </Example>

        <Example
          title="Variants"
          description="Three weights for hierarchy. Primary is the solid depth button; secondary is a quieter raised chip; ghost stays flat until hovered."
          code={`<Button variant="primary">Post</Button>
<Button variant="secondary">Save draft</Button>
<Button variant="ghost">Cancel</Button>`}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            <Button variant="primary">Post</Button>
            <Button variant="secondary">Save draft</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </Example>

        <Example
          title="As a link"
          description="Set asChild to paint the button onto a link instead of a <button> — real anchor semantics (open-in-new-tab, right-click, prefetch, a crawlable href) are preserved. Works with Next's <Link> too."
          code={`import Link from 'next/link';

<Button asChild>
  <Link href="/components">Browse components</Link>
</Button>

// or a plain anchor
<Button asChild variant="secondary">
  <a href="https://github.com/DibbayajyotiRoy/RoyUI">GitHub</a>
</Button>`}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            <Button asChild>
              <a href="/components">Browse components</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="https://github.com/DibbayajyotiRoy/RoyUI" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
          </div>
        </Example>

        <article className="example">
          <header className="example__head">
            <h3 className="example__title">Any color</h3>
            <p className="example__desc">
              Pass one color and the whole depth treatment derives from it — a
              lighter top and darker base, a ring that adapts to the tone, and a
              label color chosen for contrast. Click a swatch or open the picker,
              then copy the config straight into your project.
            </p>
          </header>
          <ButtonColorPlayground />
        </article>

        <Example
          title="Loading state"
          description="Pass loading={true} to swap the label for a spinner and disable the button. Click to simulate an async submit."
          code={`const [loading, setLoading] = useState(false);

<Button
  type="submit"
  loading={loading}
  onClick={handleSubmit}
>
  Post
</Button>`}
        >
          <ButtonLoadingDemo />
        </Example>

        <Example
          title="Full width"
          description="Set fullWidth to stretch into a form column."
          code={`<Button fullWidth>Post</Button>`}
          stretchPreview
        >
          <div style={{ width: 280 }}>
            <Button fullWidth>Post</Button>
          </div>
        </Example>

        <Example
          title="Disabled"
          description="Hover lift and press are suppressed. Pointer falls back to not-allowed."
          code={`<Button disabled>Can't post</Button>`}
        >
          <Button disabled>Can&apos;t post</Button>
        </Example>
      </DocSection>

      <DocSection
        id="theming"
        eyebrow="03"
        title="Theming"
        description="Every surface is a CSS variable. Override them inline or in a stylesheet to retint the button without touching the depth recipe."
      >
        <Code
          label="Variables"
          code={`.royui-btn {
  --royui-btn-top: #323232;     /* gradient — top (lit) */
  --royui-btn-bottom: #222222;  /* gradient — base */
  --royui-btn-ring: #3a3a3a;    /* hairline edge */
  --royui-btn-fg: #ffffff;      /* label */
  --royui-btn-radius: 14px;
}`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="04"
        title="Props"
        description="Every native button attribute is forwarded — onClick, type, aria-*, data-*, ref, etc."
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
  stretchPreview = false,
}: {
  title: string;
  description: string;
  code: string;
  children: ReactNode;
  stretchPreview?: boolean;
}) {
  const codeNode = <Code code={code} />;
  return (
    <article className="example">
      <header className="example__head">
        <h3 className="example__title">{title}</h3>
        <p className="example__desc">{description}</p>
      </header>
      <PreviewTabs
        preview={children}
        code={codeNode}
        stretchPreview={stretchPreview}
      />
    </article>
  );
}

function PropsTable() {
  const rows = [
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      def: `'md'`,
      desc: 'Visual scale. Radius scales with the box.',
    },
    {
      name: 'variant',
      type: `'primary' | 'secondary' | 'ghost'`,
      def: `'primary'`,
      desc: 'Visual weight. Solid depth button, quieter raised chip, or flat-until-hover.',
    },
    {
      name: 'asChild',
      type: 'boolean',
      def: 'false',
      desc: 'Render the single child element (e.g. a link) with the button styles merged onto it.',
    },
    {
      name: 'color',
      type: 'string',
      def: 'near-black',
      desc: 'Base color (hex or rgb). Gradient, ring, label, and press all derive from it.',
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      def: 'false',
      desc: 'Stretch the button to fill its container.',
    },
    {
      name: 'loading',
      type: 'boolean',
      def: 'false',
      desc: 'Replaces children with a spinner and disables the button.',
    },
    {
      name: 'loadingLabel',
      type: 'ReactNode',
      def: 'spinner',
      desc: 'Optional override for the loading visual.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      def: 'false',
      desc: 'Standard disabled — applied automatically when loading.',
    },
    {
      name: '...rest',
      type: 'ButtonHTMLAttributes',
      def: '—',
      desc: 'All native button props (onClick, type, aria-*, data-*, ref).',
    },
  ];
  return (
    <table className="props">
      <thead>
        <tr>
          <th style={{ width: '22%' }}>Prop</th>
          <th style={{ width: '24%' }}>Type</th>
          <th style={{ width: '16%' }}>Default</th>
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
