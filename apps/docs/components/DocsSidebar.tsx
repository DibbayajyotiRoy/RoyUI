'use client';

import { usePathname } from 'next/navigation';
import { Link } from './Link';
import { components } from '../lib/registry';

const categoryOrder = ['Inputs', 'Overlay', 'Display', 'Feedback'] as const;

export function DocsSidebar() {
  const pathname = usePathname();

  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    items: components.filter((c) => c.category === cat),
  }));

  return (
    <aside className="docs-sidebar" aria-label="Components navigation">
      <div className="docs-sidebar__group">
        <div className="docs-sidebar__heading">Getting started</div>
        <Link
          href="/components"
          className={`docs-sidebar__link ${pathname === '/components' ? 'is-active' : ''}`}
        >
          All components
        </Link>
      </div>

      {grouped.map(
        (g) =>
          g.items.length > 0 && (
            <div className="docs-sidebar__group" key={g.category}>
              <div className="docs-sidebar__heading">{g.category}</div>
              {g.items.map((c) => {
                const href = `/components/${c.slug}`;
                const active = pathname === href;
                const soon = c.status === 'coming-soon';
                if (soon) {
                  return (
                    <span
                      key={c.slug}
                      className="docs-sidebar__link docs-sidebar__link--soon"
                      aria-disabled
                    >
                      <span>{c.name}</span>
                      <span className="docs-sidebar__badge">Soon</span>
                    </span>
                  );
                }
                return (
                  <Link
                    key={c.slug}
                    href={href}
                    className={`docs-sidebar__link ${active ? 'is-active' : ''}`}
                  >
                    <span>{c.name}</span>
                  </Link>
                );
              })}
            </div>
          ),
      )}
    </aside>
  );
}
