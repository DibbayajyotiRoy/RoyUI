'use client';

import { useRouter } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';
import type { ComponentEntry } from '../lib/registry';
import { Link } from './Link';

export function ShowcaseCard({
  entry,
  children,
}: {
  entry: ComponentEntry;
  children: ReactNode;
}) {
  const router = useRouter();
  const href = `/components/${entry.slug}`;

  const navigate = () => {
    if (
      typeof document !== 'undefined' &&
      typeof document.startViewTransition === 'function'
    ) {
      document.startViewTransition(() => router.push(href));
    } else {
      router.push(href);
    }
  };

  const onStageDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    navigate();
  };

  return (
    <article className="showcase">
      <div
        className="showcase__stage"
        style={{ viewTransitionName: `preview-${entry.slug}` }}
        onDoubleClick={onStageDoubleClick}
        title="Double-click to open docs"
      >
        {children}
      </div>
      <div className="showcase__meta">
        <div className="showcase__head">
          <Link href={href} className="showcase__name-link">
            <h3
              className="showcase__name"
              style={{ viewTransitionName: `title-${entry.slug}` }}
            >
              {entry.name}
            </h3>
          </Link>
          <span className="showcase__cat">{entry.category}</span>
        </div>
        <p className="showcase__desc">{entry.tagline}</p>
      </div>
    </article>
  );
}
