'use client';

import { useState, type ReactNode } from 'react';
import { GradientButton } from '@royui/ui';
import { CodeBlock } from './CodeBlock';

export function GradientButtonDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package to your project. Components ship with their own CSS — no global setup."
      >
        <div className="install-grid">
          <CodeBlock tag="Terminal" code={`pnpm add @royui/ui`} />
          <CodeBlock
            tag="Import"
            code={`import { GradientButton } from '@royui/ui';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="The component is full-width by default and includes a spinner-based loading state out of the box."
      >
        <DefaultExample />
        <LoadingExample />
        <InlineExample />
        <DisabledExample />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="03"
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

function DefaultExample() {
  return (
    <Example
      title="Default"
      description="Full-width — drops into a form column with no extra wrapping."
      code={`<GradientButton onClick={handleClick}>
  Join the Waitlist
</GradientButton>`}
      stretchPreview
    >
      <GradientButton onClick={() => alert('clicked')}>
        Join the Waitlist
      </GradientButton>
    </Example>
  );
}

function LoadingExample() {
  const [loading, setLoading] = useState(false);
  const simulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2200);
  };
  return (
    <Example
      title="Loading state"
      description="Pass loading={true} to swap the label for a spinner and disable the button. Click to simulate an async submit."
      code={`const [loading, setLoading] = useState(false);

<GradientButton
  type="submit"
  loading={loading}
  onClick={handleSubmit}
>
  Join the Waitlist
</GradientButton>`}
      stretchPreview
    >
      <GradientButton
        type="submit"
        loading={loading}
        onClick={simulate}
      >
        Join the Waitlist
      </GradientButton>
    </Example>
  );
}

function InlineExample() {
  return (
    <Example
      title="Inline"
      description="Set fullWidth={false} to size the button to its content."
      code={`<GradientButton fullWidth={false}>
  Subscribe
</GradientButton>`}
    >
      <GradientButton fullWidth={false} onClick={() => alert('subscribed')}>
        Subscribe
      </GradientButton>
    </Example>
  );
}

function DisabledExample() {
  return (
    <Example
      title="Disabled"
      description="Hover lift is suppressed while disabled. Pointer falls back to not-allowed."
      code={`<GradientButton fullWidth={false} disabled>
  Can't click
</GradientButton>`}
    >
      <GradientButton fullWidth={false} disabled>
        Can't click
      </GradientButton>
    </Example>
  );
}

function Example({
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
  return (
    <article className="example">
      <header className="example__header">
        <h3 className="example__title">{title}</h3>
        <p className="example__desc">{description}</p>
      </header>
      <div className="example__preview">
        <div className={stretchPreview ? 'example__preview-stretch' : undefined}>
          {children}
        </div>
      </div>
      <div className="example__code">
        <CodeBlock code={code} />
      </div>
    </article>
  );
}

function PropsTable() {
  const rows = [
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
      name: 'fullWidth',
      type: 'boolean',
      def: 'true',
      desc: 'Stretch the button to fill its container.',
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
