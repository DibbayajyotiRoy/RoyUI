'use client';

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { components } from '../lib/registry';

declare global {
  interface WindowEventMap {
    'royui:openCommand': Event;
  }
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        const target = e.target as HTMLElement;
        if (
          target?.tagName === 'INPUT' ||
          target?.tagName === 'TEXTAREA' ||
          target?.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const open = () => setOpen(true);
    document.addEventListener('keydown', down);
    window.addEventListener('royui:openCommand', open);
    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('royui:openCommand', open);
    };
  }, []);

  const go = (path: string) => {
    setOpen(false);
    setQuery('');
    if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
      document.startViewTransition(() => router.push(path));
    } else {
      router.push(path);
    }
  };

  if (!open) return null;

  return (
    <div
      className="cmd-overlay"
      data-state="open"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <Command label="Search RoyUI">
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Search components, docs, links…"
          autoFocus
        />
        <Command.List>
          <Command.Empty>No results. Try a different keyword.</Command.Empty>

          <Command.Group heading="Pages">
            <Command.Item value="home" onSelect={() => go('/')}>
              <PageIcon />
              <span>Home</span>
            </Command.Item>
            <Command.Item value="components catalog browse" onSelect={() => go('/components')}>
              <GridIcon />
              <span>Browse components</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Components">
            {components.map((c) => (
              <Command.Item
                key={c.slug}
                value={`${c.name} ${c.tagline} ${c.tags.join(' ')} ${c.category}`}
                disabled={c.status === 'coming-soon'}
                onSelect={() =>
                  c.status === 'available' && go(`/components/${c.slug}`)
                }
              >
                <span className="cmd-item__icon">
                  {c.name.charAt(0)}
                </span>
                <span>{c.name}</span>
                <span className="cmd-item__cat">
                  {c.status === 'coming-soon' ? 'Soon' : c.category}
                </span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="External">
            <Command.Item
              value="github source code"
              onSelect={() => window.open('https://github.com/DibbayajyotiRoy/RoyUI', '_blank')}
            >
              <ExternalIcon />
              <span>GitHub repository</span>
            </Command.Item>
            <Command.Item
              value="npm package registry"
              onSelect={() => window.open('https://www.npmjs.com/package/@roy-ui/ui', '_blank')}
            >
              <ExternalIcon />
              <span>npm package</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}

function PageIcon() {
  return (
    <svg className="cmd-item__icon" width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h7l5 5v13H7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg className="cmd-item__icon" width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="4" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="13" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="13" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function ExternalIcon() {
  return (
    <svg className="cmd-item__icon" width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 5h5v5M19 5l-8 8M12 5H5v14h14v-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
