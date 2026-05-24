'use client';

import { useEffect, useState } from 'react';

export type TocItem = { id: string; label: string };

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: '-90px 0px -65% 0px',
        threshold: [0, 1],
      },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="toc" aria-label="On this page">
      <div className="toc__head">On this page</div>
      <ul className="toc__list">
        {items.map((item) => (
          <li
            key={item.id}
            className={`toc__item ${activeId === item.id ? 'is-active' : ''}`}
          >
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
