import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { components, getComponent } from '../../../lib/registry';
import { Link } from '../../../components/Link';
import { PreviewBox } from '../../../components/PreviewBox';
import { ButtonDocs } from '../../../components/ButtonDocs';
import { GradientButtonDocs } from '../../../components/GradientButtonDocs';
import { PopoverDocs } from '../../../components/PopoverDocs';
import { MadeByDocs } from '../../../components/MadeByDocs';
import { TextMorphDocs } from '../../../components/TextMorphDocs';
import { TreeNavDocs } from '../../../components/TreeNavDocs';
import { DataTableDocs } from '../../../components/DataTableDocs';
import { DocsSidebar } from '../../../components/DocsSidebar';
import { TableOfContents, type TocItem } from '../../../components/TableOfContents';

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

const SITE_URL = 'https://roy-ui-docs.vercel.app';

const baseKeywords = [
  'React component library',
  'React UI library',
  'animated React components',
  'TypeScript React components',
  'Next.js 15 components',
  'React Server Components',
  'shadcn alternative',
  'Aceternity UI alternative',
  'Magic UI alternative',
  'free React components',
  'open source React components',
  'tree-shakable',
  'Roy UI',
  '@roy-ui/ui',
];

const slugKeywords: Record<string, string[]> = {
  button: [
    'React button component',
    'tactile button React',
    'button with depth React',
    'skeuomorphic button React',
    'React button with spinner',
    'loading button React',
    'accessible button React',
  ],
  'gradient-button': [
    'React gradient button',
    'animated gradient button',
    'gradient button component',
    'React CTA button',
    'loading button React',
    'React button with spinner',
    'Tailwind gradient button alternative',
  ],
  popover: [
    'React popover',
    'animated popover',
    'React popover component',
    'click popover',
    'tooltip React',
    'accessible popover',
    'Radix popover alternative',
  ],
  'made-by': [
    'made by badge',
    'React attribution badge',
    'floating credit badge',
    'portfolio badge',
    'React floating pill',
    'corner badge React',
  ],
  'text-morph': [
    'React text animation',
    'text morph React',
    'typing animation React',
    'animated counter React',
    'live text React',
    'text transition React',
  ],
  'tree-nav': [
    'React tree navigation',
    'React sidebar navigation',
    'React file tree nav',
    'docs sidebar React',
    'router-agnostic nav React',
    'sub-nav React',
  ],
  input: ['React input component', 'accessible input React', 'form input React'],
  card: ['React card component', 'React container card', 'layout card React'],
  dialog: ['React dialog', 'React modal', 'accessible modal React', 'Radix dialog alternative'],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getComponent(slug);
  if (!entry) return {};

  const title = `${entry.name} — ${entry.tagline}`;
  const description = entry.tagline;
  const url = `${SITE_URL}/components/${entry.slug}`;
  const componentKeywords = slugKeywords[entry.slug] ?? [];

  return {
    title: entry.name,
    description,
    keywords: [...componentKeywords, ...baseKeywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'Roy UI',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

const docsBySlug: Record<string, () => React.ReactNode> = {
  button: () => <ButtonDocs />,
  'gradient-button': () => <GradientButtonDocs />,
  popover: () => <PopoverDocs />,
  'made-by': () => <MadeByDocs />,
  'text-morph': () => <TextMorphDocs />,
  'tree-nav': () => <TreeNavDocs />,
  'data-table': () => <DataTableDocs />,
};

const tocBySlug: Record<string, TocItem[]> = {
  button: [
    { id: 'installation', label: 'Installation' },
    { id: 'usage', label: 'Usage' },
    { id: 'theming', label: 'Theming' },
    { id: 'props', label: 'Props' },
  ],
  'gradient-button': [
    { id: 'installation', label: 'Installation' },
    { id: 'usage', label: 'Usage' },
    { id: 'props', label: 'Props' },
  ],
  popover: [
    { id: 'installation', label: 'Installation' },
    { id: 'usage', label: 'Usage' },
    { id: 'theming', label: 'Theming' },
    { id: 'props', label: 'Props' },
    { id: 'known-limits', label: 'Known limits' },
  ],
  'made-by': [
    { id: 'installation', label: 'Installation' },
    { id: 'usage', label: 'Usage' },
    { id: 'positions', label: 'Positions' },
    { id: 'theming', label: 'Theming' },
    { id: 'props', label: 'Props' },
  ],
  'text-morph': [
    { id: 'installation', label: 'Installation' },
    { id: 'usage', label: 'Usage' },
    { id: 'custom-render', label: 'Custom render' },
    { id: 'behavior', label: 'Behavior' },
    { id: 'props', label: 'Props' },
  ],
  'tree-nav': [
    { id: 'installation', label: 'Installation' },
    { id: 'usage', label: 'Usage' },
    { id: 'router', label: 'Router integration' },
    { id: 'theming', label: 'Theming' },
    { id: 'props', label: 'Props' },
  ],
  'data-table': [
    { id: 'full', label: 'Everything, on' },
    { id: 'installation', label: 'Installation' },
    { id: 'minimal', label: 'The minimum' },
    { id: 'search', label: 'Search' },
    { id: 'pagination', label: 'Pagination' },
    { id: 'dates-and-times', label: 'Range + time' },
    { id: 'columns', label: 'Reorder, resize, hide' },
    { id: 'fit-columns', label: 'Fit to width' },
    { id: 'export-import', label: 'Export & import' },
    { id: 'typography', label: 'Typography' },
    { id: 'primitives', label: 'Primitives' },
    { id: 'props', label: 'Props' },
  ],
};

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getComponent(slug);
  if (!entry) notFound();

  const renderDocs = docsBySlug[entry.slug];
  const toc = tocBySlug[entry.slug] ?? [];

  return (
    <div className="detail">
      <DocsSidebar />

      <main className="detail__main">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/components">Components</Link>
          <span className="breadcrumb__sep" aria-hidden="true">·</span>
          <span>{entry.category}</span>
          <span className="breadcrumb__sep" aria-hidden="true">·</span>
          <span style={{ color: 'var(--fg)' }}>{entry.name}</span>
        </nav>

        <header className="detail__hero">
          <div className="detail__hero-meta">
            <span className="tag tag--category">{entry.category}</span>
            {entry.status === 'coming-soon' && (
              <span className="tag tag--soon">Coming soon</span>
            )}
          </div>
          <h1
            className="detail__title"
            style={{ viewTransitionName: `title-${entry.slug}` }}
          >
            {entry.name}
          </h1>
          <p className="detail__tagline">{entry.tagline}</p>
          <p className="detail__description">{entry.description}</p>
        </header>

        <div
          className="detail__preview"
          style={{ viewTransitionName: `preview-${entry.slug}` }}
        >
          <PreviewBox entry={entry} />
        </div>

        {entry.status === 'available' && renderDocs ? (
          <div>{renderDocs()}</div>
        ) : (
          <div className="detail__placeholder">
            <h2>Documentation coming soon</h2>
            <p>
              This component is on the roadmap. Track progress on{' '}
              <a href="https://github.com/DibbayajyotiRoy/RoyUI" target="_blank" rel="noreferrer">
                GitHub
              </a>
              .
            </p>
          </div>
        )}

        <NextComponentNav slug={entry.slug} />
      </main>

      {toc.length > 0 && <TableOfContents items={toc} />}
    </div>
  );
}

function NextComponentNav({ slug }: { slug: string }) {
  const available = components.filter((c) => c.status === 'available');
  const idx = available.findIndex((c) => c.slug === slug);
  const prev = idx > 0 ? available[idx - 1] : null;
  const next = idx < available.length - 1 ? available[idx + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav className="detail__nav" aria-label="Component navigation">
      <div>
        {prev && (
          <Link href={`/components/${prev.slug}`} className="detail__nav-link">
            <span className="detail__nav-label">Previous</span>
            <span className="detail__nav-name">{prev.name}</span>
          </Link>
        )}
      </div>
      <div style={{ textAlign: 'right' }}>
        {next && (
          <Link href={`/components/${next.slug}`} className="detail__nav-link">
            <span className="detail__nav-label">Next</span>
            <span className="detail__nav-name">{next.name}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
