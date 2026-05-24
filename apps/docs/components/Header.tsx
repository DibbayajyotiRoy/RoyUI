'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Link } from './Link';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    const target = q ? `/components?q=${encodeURIComponent(q)}` : '/components';
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => router.push(target));
    } else {
      router.push(target);
    }
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden="true" />
          <span className="brand__name">RoyUI</span>
          <span className="brand__ver">v0.0.1</span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <Link
            href="/"
            className={`site-nav__link ${pathname === '/' ? 'is-active' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/components"
            className={`site-nav__link ${pathname?.startsWith('/components') ? 'is-active' : ''}`}
          >
            Components
          </Link>
          <a
            href="https://github.com"
            className="site-nav__link"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>

        <form className="search" role="search" onSubmit={submit}>
          <SearchIcon />
          <input
            type="search"
            placeholder="Search components"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search__input"
            aria-label="Search components"
          />
          <kbd className="search__kbd" aria-hidden="true">/</kbd>
        </form>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      className="search__icon"
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
