import { notFound } from 'next/navigation';
import { components, getComponent } from '../../../lib/registry';
import { Link } from '../../../components/Link';
import { PreviewBox } from '../../../components/PreviewBox';
import { GradientButtonDocs } from '../../../components/GradientButtonDocs';
import { PopoverDocs } from '../../../components/PopoverDocs';

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

  return (
    <main className="detail">
      <div className="detail__inner">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/components">Components</Link>
          <span className="breadcrumb__sep" aria-hidden="true">·</span>
          <span className="breadcrumb__current">{entry.category}</span>
        </nav>

        <header className="detail__hero">
          <div className="detail__hero-meta">
            <span className="chip chip--category">{entry.category}</span>
            {entry.status === 'coming-soon' && (
              <span className="chip chip--soon">Coming soon</span>
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
          <div className="detail__docs">{renderDocs()}</div>
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
      </div>
    </main>
  );
}

function NextComponentNav({ slug }: { slug: string }) {
  const list = components;
  const idx = list.findIndex((c) => c.slug === slug);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx < list.length - 1 ? list[idx + 1] : null;

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
