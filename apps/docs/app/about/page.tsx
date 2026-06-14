import type { Metadata } from 'next';
import { Link } from '../../components/Link';
import { getAvailable } from '../../lib/registry';

const SITE_URL = 'https://roy-ui-docs.vercel.app';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Roy UI is a free, open-source React component library of animated, RSC-safe components for Next.js, Vite, and Remix — a lightweight shadcn/ui, Aceternity UI, and Magic UI alternative. TypeScript-first, tree-shakable, MIT licensed.',
  keywords: [
    'what is Roy UI',
    'Roy UI vs shadcn',
    'animated React component library',
    'shadcn alternative',
    'Aceternity UI alternative',
    'Magic UI alternative',
    'RSC-safe React components',
    'React Server Components library',
    'Next.js 15 components',
    'React data table',
    'React date range picker',
    'free open source React components',
    '@roy-ui/ui',
  ],
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'article',
    title: 'About Roy UI — animated, open-source React components',
    description:
      'Why Roy UI exists, what is in the library, how it compares to shadcn/ui, Aceternity UI and Magic UI, and who builds it.',
    url: `${SITE_URL}/about`,
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Roy UI',
  url: `${SITE_URL}/about`,
  description:
    'Roy UI is a free, open-source React component library of animated, RSC-safe components for Next.js, Vite, and Remix.',
  about: {
    '@type': 'SoftwareApplication',
    name: 'Roy UI',
    alternateName: ['@roy-ui/ui', 'RoyUI'],
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web, Node.js',
    softwareVersion: '0.0.16',
    license: 'https://opensource.org/licenses/MIT',
    programmingLanguage: 'TypeScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: {
      '@type': 'Person',
      name: 'Dibbayajyoti Roy',
      url: 'https://dibbayajyoti.com/about',
    },
    sameAs: [
      'https://dibbayajyoti.com/projects/roy-ui',
      'https://github.com/DibbayajyotiRoy/RoyUI',
      'https://www.npmjs.com/package/@roy-ui/ui',
    ],
  },
};

// One readable column for long-form prose, matching the .section container width.
const prose: React.CSSProperties = { maxWidth: '68ch' };
const h2: React.CSSProperties = {
  fontSize: 'clamp(22px, 2.6vw, 28px)',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  marginTop: 56,
  marginBottom: 14,
};
const p: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.65,
  color: 'var(--fg-2)',
  margin: '0 0 16px',
};

export default function AboutPage() {
  const components = getAvailable();

  return (
    <main className="section" style={{ paddingBottom: 96 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      <div style={prose}>
        <div className="eyebrow" style={{ color: 'var(--accent)' }}>
          About
        </div>
        <h1
          style={{
            fontSize: 'clamp(34px, 5vw, 56px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            margin: '14px 0 0',
          }}
        >
          Animated React components that survive Server Components.
        </h1>

        <p style={{ ...p, fontSize: 19, color: 'var(--fg)', marginTop: 28 }}>
          <strong>Roy UI</strong> (<code>@roy-ui/ui</code>) is a free,
          open-source React component library of animated, production-ready
          components for Next.js App Router, TanStack Start, Vite, and Remix.
          Every component ships correct <code>&quot;use client&quot;</code>{' '}
          boundaries, brings its own styles, and is fully typed — TypeScript-first,
          tree-shakable, and under 12&nbsp;KB. MIT licensed.
        </p>

        <h2 style={h2}>What is Roy UI?</h2>
        <p style={p}>
          Roy UI is a React UI library you install from npm (
          <code>@roy-ui/ui</code>) or copy into your project with a CLI. It
          focuses on the components that are tedious to build well — an animated{' '}
          <Link href="/components/gradient-button" className="link-quiet">
            gradient button
          </Link>
          , a batteries-included{' '}
          <Link href="/components/data-table" className="link-quiet">
            data table
          </Link>{' '}
          with search, date-range and time pickers, CSV/JSON import-export, a
          drag-and-drop{' '}
          <Link href="/components/upload-files" className="link-quiet">
            file uploader
          </Link>
          , a diff-typing{' '}
          <Link href="/components/text-morph" className="link-quiet">
            text morph
          </Link>
          , and more. It is designed to work in React Server Component
          environments without the &quot;cannot use hooks in a Server
          Component&quot; errors that plague drop-in libraries.
        </p>

        <h2 style={h2}>Why we built it</h2>
        <p style={p}>
          Most React component libraries were written before the App Router and
          React Server Components landed. Drop them into a modern Next.js or
          TanStack Start app and you hit hydration mismatches, missing{' '}
          <code>&quot;use client&quot;</code> directives, or a global stylesheet
          that fights your design tokens. The alternative — copy-paste libraries —
          gives you the source but leaves you maintaining it forever.
        </p>
        <p style={p}>
          Roy UI takes the middle path. Components are RSC-safe out of the box and
          own their styles through tree-shakable side-effect imports, so there is
          no Tailwind config to wire up and no global CSS to leak. You can{' '}
          <code>npm install</code> them as a versioned dependency, or use the CLI
          to copy the source in when you need full control. Two distribution
          models, one library.
        </p>

        <h2 style={h2}>What&apos;s in the library</h2>
        <p style={p}>
          {components.length} components ship today, with more in progress:
        </p>
        <ul style={{ ...p, paddingLeft: 22, lineHeight: 1.9 }}>
          {components.map((c) => (
            <li key={c.slug}>
              <Link href={`/components/${c.slug}`} className="link-quiet">
                {c.name}
              </Link>{' '}
              — {c.tagline}
            </li>
          ))}
        </ul>

        <h2 style={h2}>How does Roy UI compare to shadcn/ui, Aceternity UI, and Magic UI?</h2>
        <p style={p}>
          <strong>shadcn/ui</strong> is a copy-in collection of unstyled Radix
          primitives — excellent foundations, but you build the motion and polish
          yourself. <strong>Aceternity UI</strong> and{' '}
          <strong>Magic UI</strong> ship the eye-catching animations but lean on
          Framer Motion and Tailwind and often need adapting for Server
          Components. Roy UI sits between them: motion is built in like Aceternity,
          but components are RSC-safe, dependency-light, and own their styles like
          shadcn — and you can still install from npm <em>or</em> copy the source.
          It is a practical alternative when you want animated components that just
          drop into a Next.js&nbsp;15 app.
        </p>

        <h2 style={h2}>Which frameworks does Roy UI support?</h2>
        <p style={p}>
          Roy UI works with any React 18 or 19 setup. It is tested against
          Next.js App Router (including Server Components), TanStack Start, Vite,
          Remix, and Astro&apos;s React islands. Components forward refs and spread
          every native HTML attribute, so <code>onClick</code>, <code>aria-*</code>
          , <code>data-*</code>, and <code>ref</code> all behave exactly as you
          expect.
        </p>

        <h2 style={h2}>Is Roy UI free?</h2>
        <p style={p}>
          Yes. Roy UI is MIT licensed and free to use in personal and commercial
          projects, with no sign-up and no paid tier. The source lives on{' '}
          <a
            href="https://github.com/DibbayajyotiRoy/RoyUI"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>{' '}
          and ships to npm as{' '}
          <a
            href="https://www.npmjs.com/package/@roy-ui/ui"
            target="_blank"
            rel="noreferrer"
          >
            @roy-ui/ui
          </a>
          .
        </p>

        <h2 style={h2}>Who builds Roy UI?</h2>
        <p style={p}>
          Roy UI is built and maintained by{' '}
          <a
            href="https://dibbayajyoti.com/about"
            target="_blank"
            rel="noreferrer"
          >
            Dibbayajyoti Roy
          </a>{' '}
          and contributors. It is part of a small family of open-source developer
          tools — alongside{' '}
          <a href="https://dibbayajyoti.com/projects" target="_blank" rel="noreferrer">
            other projects
          </a>{' '}
          on the same portfolio. Issues, pull requests, and feature requests are
          welcome on{' '}
          <a
            href="https://github.com/DibbayajyotiRoy/RoyUI"
            target="_blank"
            rel="noreferrer"
          >
            the GitHub repo
          </a>
          .
        </p>

        <h2 style={h2}>Get started</h2>
        <p style={p}>
          Install the package and import the first component:
        </p>
        <pre
          style={{
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '14px 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            overflowX: 'auto',
            margin: '0 0 24px',
          }}
        >
          <code>npm install @roy-ui/ui</code>
        </pre>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
          <Link href="/components" className="btn btn-primary">
            Browse components
          </Link>
          <a
            href="https://github.com/DibbayajyotiRoy/RoyUI"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
          >
            Star on GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
