import type { ComponentEntry } from '../lib/registry';
import { Link } from './Link';
import { PreviewBox } from './PreviewBox';

export function ComponentCard({ entry }: { entry: ComponentEntry }) {
  const disabled = entry.status === 'coming-soon';

  const inner = (
    <>
      <div
        className="card__preview"
        style={{ viewTransitionName: `preview-${entry.slug}` }}
      >
        <PreviewBox entry={entry} compact />
      </div>
      <div className="card__body">
        <div className="card__meta">
          <span className="chip chip--category">{entry.category}</span>
          {disabled && <span className="chip chip--soon">Coming soon</span>}
        </div>
        <h3
          className="card__title"
          style={{ viewTransitionName: `title-${entry.slug}` }}
        >
          {entry.name}
        </h3>
        <p className="card__tagline">{entry.tagline}</p>
      </div>
    </>
  );

  if (disabled) {
    return <article className="card card--disabled">{inner}</article>;
  }

  return (
    <Link href={`/components/${entry.slug}`} className="card">
      {inner}
    </Link>
  );
}
