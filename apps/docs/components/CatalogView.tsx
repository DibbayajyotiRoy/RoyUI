'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { components, categories, type Category } from '../lib/registry';
import { ComponentCard } from './ComponentCard';

export function CatalogView() {
  const params = useSearchParams();
  const initialQ = params?.get('q') ?? '';

  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState<Category>('All');

  useEffect(() => {
    setQuery(initialQ);
  }, [initialQ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return components.filter((c) => {
      if (category !== 'All' && c.category !== category) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.tags.some((t) => t.includes(q))
      );
    });
  }, [query, category]);

  return (
    <>
      <div className="catalog-toolbar">
        <div className="catalog-search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Filter components"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="catalog-search__input"
            aria-label="Filter components"
          />
        </div>

        <div className="catalog-chips" role="tablist">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              className={`catalog-chip ${category === c ? 'is-active' : ''}`}
              onClick={() => setCategory(c)}
              type="button"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-result-count">
        {filtered.length} component{filtered.length === 1 ? '' : 's'}
      </div>

      {filtered.length === 0 ? (
        <div className="catalog-empty">
          <p>No matches. Try a different keyword.</p>
        </div>
      ) : (
        <div className="catalog-grid">
          {filtered.map((c) => (
            <ComponentCard key={c.slug} entry={c} />
          ))}
        </div>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      className="catalog-search__icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
