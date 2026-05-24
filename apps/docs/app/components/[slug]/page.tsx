import { notFound } from 'next/navigation';
import { components, getComponent } from '../../../lib/registry';
import { Link } from '../../../components/Link';
import { PreviewBox } from '../../../components/PreviewBox';
import { GradientButtonDocs } from '../../../components/GradientButtonDocs';
import { PopoverDocs } from '../../../components/PopoverDocs';
import { MadeByDocs } from '../../../components/MadeByDocs';
import { DocsSidebar } from '../../../components/DocsSidebar';
import { TableOfContents, type TocItem } from '../../../components/TableOfContents';

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getComponent(slug);
  if (!entry) return {};
  return {
    title: `${entry.name} · RoyUI`,
    description: entry.tagline,
  };
}

const docsBySlug: Record<string, () => React.ReactNode> = {
  'gradient-button': () => <GradientButtonDocs />,
  popover: () => <PopoverDocs />,
  'made-by': () => <MadeByDocs />,
};

const tocBySlug: Record<string, TocItem[]> = {
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
              <a href="https://github.com" target="_blank" rel="noreferrer">
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
