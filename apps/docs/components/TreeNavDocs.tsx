'use client';

import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { TreeNav, TreeNavItem } from '@roy-ui/ui';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { PreviewTabs } from './PreviewTabs';
import { TreeNavThreeParentsDemo } from './demos/TreeNavThreeParentsDemo';

const noNav = (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault();

const lightCard: CSSProperties = {
  background: '#fafafa',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 10,
  padding: 16,
  width: 240,
};

const groupHeader: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'rgba(0,0,0,0.85)',
  paddingLeft: 8,
  marginBottom: 4,
};

const lightTokens = {
  ['--royui-treenav-branch']: 'rgba(0,0,0,0.2)',
  ['--royui-treenav-branch-active']: 'rgba(0,0,0,0.55)',
  ['--royui-treenav-label']: 'rgba(0,0,0,0.55)',
  ['--royui-treenav-label-hover']: 'rgba(0,0,0,0.92)',
  ['--royui-treenav-label-active']: '#0a0a0a',
  ['--royui-treenav-hover-bg']: 'rgba(0,0,0,0.04)',
  ['--royui-treenav-active-bg']: 'rgba(0,0,0,0.06)',
} as CSSProperties;

export function TreeNavDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Two components ship together — a TreeNav container and TreeNavItem rows. CSS is auto-imported."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { TreeNav, TreeNavItem } from '@roy-ui/ui';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Drop TreeNav inside a parent group label. Items are <a> by default — pass asChild to plug in your router's Link."
      >
        <Example
          title="Default"
          description="L-corner connector + triangle tip. Active item is marked with the active prop, which sets aria-current and pulls the branch into its active color."
          code={`<TreeNav>
  <TreeNavItem href="/pricing/pay-per-use" active>
    Pay per use
  </TreeNavItem>
  <TreeNavItem href="/pricing/packages">Packages</TreeNavItem>
</TreeNav>`}
        >
          <div style={lightCard}>
            <div style={groupHeader}>Pricing</div>
            <TreeNav style={lightTokens}>
              <TreeNavItem
                href="#"
                active
                linkProps={{ onClick: noNav }}
              >
                Pay per use
              </TreeNavItem>
              <TreeNavItem href="#" linkProps={{ onClick: noNav }}>
                Packages
              </TreeNavItem>
            </TreeNav>
          </div>
        </Example>

        <Example
          title="With icons"
          description="Icon slot accepts any ReactNode — Lucide, Heroicons, or your own SVG. Renders before the label, inside the same row."
          code={`<TreeNav>
  <TreeNavItem href="/pricing/pay-per-use" icon={<DollarIcon />}>
    Pay per use
  </TreeNavItem>
  <TreeNavItem href="/pricing/packages" icon={<PackageIcon />}>
    Packages
  </TreeNavItem>
</TreeNav>`}
        >
          <div style={lightCard}>
            <div style={groupHeader}>Pricing</div>
            <TreeNav style={lightTokens}>
              <TreeNavItem
                href="#"
                icon={<DollarIcon />}
                active
                linkProps={{ onClick: noNav }}
              >
                Pay per use
              </TreeNavItem>
              <TreeNavItem
                href="#"
                icon={<PackageIcon />}
                linkProps={{ onClick: noNav }}
              >
                Packages
              </TreeNavItem>
            </TreeNav>
          </div>
        </Example>

        <Example
          title="No triangle tip"
          description="Pass hideTip on individual items if you want only the L-corner without the file-explorer arrow."
          code={`<TreeNav>
  <TreeNavItem href="/pricing/pay-per-use" hideTip active>
    Pay per use
  </TreeNavItem>
  <TreeNavItem href="/pricing/packages" hideTip>
    Packages
  </TreeNavItem>
</TreeNav>`}
        >
          <div style={lightCard}>
            <div style={groupHeader}>Pricing</div>
            <TreeNav style={lightTokens}>
              <TreeNavItem
                href="#"
                hideTip
                active
                linkProps={{ onClick: noNav }}
              >
                Pay per use
              </TreeNavItem>
              <TreeNavItem
                href="#"
                hideTip
                linkProps={{ onClick: noNav }}
              >
                Packages
              </TreeNavItem>
            </TreeNav>
          </div>
        </Example>

        <Example
          title="Tighter group"
          description="Indent and gap are tokens. Drop indent for a compact sub-nav; bump gap when items need breathing room."
          code={`<TreeNav indent={16} gap={1}>
  <TreeNavItem href="/p1">Item one</TreeNavItem>
  <TreeNavItem href="/p2" active>Item two</TreeNavItem>
  <TreeNavItem href="/p3">Item three</TreeNavItem>
</TreeNav>`}
        >
          <div style={lightCard}>
            <div style={groupHeader}>Settings</div>
            <TreeNav indent={16} gap={1} style={lightTokens}>
              <TreeNavItem href="#" linkProps={{ onClick: noNav }}>
                Profile
              </TreeNavItem>
              <TreeNavItem
                href="#"
                active
                linkProps={{ onClick: noNav }}
              >
                Billing
              </TreeNavItem>
              <TreeNavItem href="#" linkProps={{ onClick: noNav }}>
                API keys
              </TreeNavItem>
            </TreeNav>
          </div>
        </Example>

        <Example
          title="Full sidebar — three parents"
          description="A real sub-nav layout: each parent label sits on its own row, with a TreeNav of children indented below. One active leaf colors only its own branch."
          code={`<aside>
  <div className="parent">Library</div>
  <TreeNav>
    <TreeNavItem href="/library/articles">Articles</TreeNavItem>
    <TreeNavItem href="/library/guides" active>Guides</TreeNavItem>
    <TreeNavItem href="/library/changelog">Changelog</TreeNavItem>
  </TreeNav>

  <div className="parent">Workspace</div>
  <TreeNav>
    <TreeNavItem href="/workspace/boards">Boards</TreeNavItem>
    <TreeNavItem href="/workspace/members">Members</TreeNavItem>
    <TreeNavItem href="/workspace/activity">Activity</TreeNavItem>
  </TreeNav>

  <div className="parent">Account</div>
  <TreeNav>
    <TreeNavItem href="/account/profile">Profile</TreeNavItem>
    <TreeNavItem href="/account/sessions">Sessions</TreeNavItem>
  </TreeNav>
</aside>`}
        >
          <TreeNavThreeParentsDemo />
        </Example>
      </DocSection>

      <DocSection
        id="router"
        eyebrow="03"
        title="Router integration"
        description="TreeNavItem renders an <a> by default. Pass asChild to render the consumer's element instead — works with next/link, react-router, TanStack Router, anything that sets aria-current on the active link."
      >
        <Code
          label="Next.js"
          code={`import Link from 'next/link';
import { TreeNav, TreeNavItem } from '@roy-ui/ui';

<TreeNav>
  <TreeNavItem asChild active={pathname === '/pricing/pay-per-use'}>
    <Link href="/pricing/pay-per-use">Pay per use</Link>
  </TreeNavItem>
  <TreeNavItem asChild active={pathname === '/pricing/packages'}>
    <Link href="/pricing/packages">Packages</Link>
  </TreeNavItem>
</TreeNav>`}
        />
        <Code
          label="TanStack Router"
          code={`import { Link } from '@tanstack/react-router';
import { TreeNav, TreeNavItem } from '@roy-ui/ui';

<TreeNav>
  <TreeNavItem asChild>
    <Link to="/pricing/pay-per-use" activeProps={{ 'aria-current': 'page' }}>
      Pay per use
    </Link>
  </TreeNavItem>
</TreeNav>`}
        />
        <p className="doc-section__desc" style={{ marginTop: 12 }}>
          Branches react to <code>aria-current=&quot;page&quot;</code> on the
          inner link via <code>:has()</code>, so any router that follows the
          standard works without configuration.
        </p>
      </DocSection>

      <DocSection
        id="theming"
        eyebrow="04"
        title="Theming"
        description="Every visual surface is wired to a CSS variable scoped to .royui-treenav. Override on the element with style, on a parent class, or globally on :root."
      >
        <Code
          label="CSS"
          lang="css"
          code={`.royui-treenav {
  --royui-treenav-branch: rgba(0, 0, 0, 0.28);
  --royui-treenav-branch-active: rgba(0, 0, 0, 0.65);

  --royui-treenav-label: rgba(0, 0, 0, 0.6);
  --royui-treenav-label-hover: rgba(0, 0, 0, 0.92);
  --royui-treenav-label-active: rgba(0, 0, 0, 1);
  --royui-treenav-hover-bg: rgba(0, 0, 0, 0.04);
  --royui-treenav-active-bg: rgba(0, 0, 0, 0.06);

  --royui-treenav-font-size: 13px;
  --royui-treenav-font-weight: 500;
  --royui-treenav-font-weight-active: 600;
}`}
        />
        <p className="doc-section__desc" style={{ marginTop: 12 }}>
          A dark-scheme override ships under{' '}
          <code>@media (prefers-color-scheme: dark)</code>. To force a specific
          palette, set the tokens on the component directly via{' '}
          <code>style</code> or a wrapper class.
        </p>
      </DocSection>

      <DocSection
        id="props"
        eyebrow="05"
        title="Props"
        description="Both components forward every native HTML attribute and accept ref."
      >
        <h3 className="example__title" style={{ marginTop: 0 }}>
          TreeNav
        </h3>
        <TreeNavPropsTable />
        <h3 className="example__title" style={{ marginTop: 24 }}>
          TreeNavItem
        </h3>
        <TreeNavItemPropsTable />
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
      <header className="example__head">
        <h3 className="example__title">{title}</h3>
        <p className="example__desc">{description}</p>
      </header>
      <PreviewTabs preview={children} code={<Code code={code} />} />
    </article>
  );
}

function DollarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.27 6.96 8.73 5.05 8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  );
}

function TreeNavPropsTable() {
  const rows = [
    {
      name: 'indent',
      type: 'number',
      def: '24',
      desc: 'Left margin of the branched group, in pixels.',
    },
    {
      name: 'gap',
      type: 'number',
      def: '2',
      desc: 'Vertical gap between items, in pixels.',
    },
    {
      name: '...rest',
      type: 'HTMLAttributes<HTMLUListElement>',
      def: '—',
      desc: 'All native <ul> props (className, style, role, aria-*, ref).',
    },
  ];
  return <PropsTable rows={rows} />;
}

function TreeNavItemPropsTable() {
  const rows = [
    {
      name: 'href',
      type: 'string',
      def: '—',
      desc: 'Link target. Used when asChild is false.',
    },
    {
      name: 'active',
      type: 'boolean',
      def: 'false',
      desc: 'Marks this item active. Adds aria-current="page" to the inner link, which colors the branch.',
    },
    {
      name: 'asChild',
      type: 'boolean',
      def: 'false',
      desc: 'Render the single React element child as the link (next/link, TanStack Link, etc.) instead of <a>.',
    },
    {
      name: 'hideTip',
      type: 'boolean',
      def: 'false',
      desc: 'Hide the triangle tip at the elbow of the L-branch.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      def: '—',
      desc: 'Leading icon slot. Ignored when asChild is true (consumer handles their link contents).',
    },
    {
      name: 'linkProps',
      type: 'AnchorHTMLAttributes<HTMLAnchorElement>',
      def: '—',
      desc: 'Forwarded to the rendered <a> (onClick, target, rel, aria-*). Default-link mode only.',
    },
    {
      name: '...rest',
      type: 'LiHTMLAttributes<HTMLLIElement>',
      def: '—',
      desc: 'All native <li> props (className, style, role, aria-*, ref).',
    },
  ];
  return <PropsTable rows={rows} />;
}

function PropsTable({
  rows,
}: {
  rows: { name: string; type: string; def: string; desc: string }[];
}) {
  return (
    <table className="props">
      <thead>
        <tr>
          <th style={{ width: '18%' }}>Prop</th>
          <th style={{ width: '36%' }}>Type</th>
          <th style={{ width: '12%' }}>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td className="prop-name">
              <code>{r.name}</code>
            </td>
            <td className="prop-type">
              <code>{r.type}</code>
            </td>
            <td className="prop-default">
              <code>{r.def}</code>
            </td>
            <td className="prop-desc">{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
