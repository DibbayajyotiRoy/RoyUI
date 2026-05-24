'use client';

import type { MouseEvent } from 'react';
import type { ComponentEntry } from '../lib/registry';
import { Link } from './Link';
import { PreviewBox } from './PreviewBox';

export function ComponentCard({ entry }: { entry: ComponentEntry }) {
  const disabled = entry.status === 'coming-soon';

  const onMouseMove = (e: MouseEvent<HTMLAnchorElement | HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const el = e.currentTarget as HTMLElement;
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

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
          <span className="tag tag--category">{entry.category}</span>
          {disabled && <span className="tag tag--soon">Soon</span>}
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
    <Link
      href={`/components/${entry.slug}`}
      className="card"
      onMouseMove={onMouseMove}
    >
      {inner}
    </Link>
  );
}
