'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Link } from './Link';

export function Header() {
  const pathname = usePathname();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPod|iPad/.test(navigator.platform));
  }, []);

  const openCommand = () => {
    window.dispatchEvent(new CustomEvent('royui:openCommand'));
  };

  return (
    <header className="header">
      <div className="header__inner">
        <Link href="/" className="brand" aria-label="RoyUI home">
          <span className="brand__mark" aria-hidden="true" />
          <span className="brand__name">RoyUI</span>
        </Link>

        <nav className="header__nav" aria-label="Primary">
          <Link
            href="/components"
            className={`header__nav-link ${pathname?.startsWith('/components') ? 'is-active' : ''}`}
          >
            Components
          </Link>
        </nav>

        <div className="header__actions">
          <button type="button" className="kbd-launcher" onClick={openCommand}>
            <span className="kbd-launcher__label">
              <SearchIcon />
              Search
            </span>
            <kbd className="kbd">{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>
          <a
            href="https://github.com"
            className="icon-btn"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
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

function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.4c.58.1.79-.25.79-.55v-2.02c-3.2.7-3.88-1.36-3.88-1.36-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.05 1.79 2.74 1.27 3.4.97.1-.76.4-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.79.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}
