'use client';

import { useState } from 'react';
import { TextMorph } from '@roy-ui/ui';

type Manager = 'pnpm' | 'npm' | 'yarn' | 'bun';

const managers: { id: Manager; label: string; cmd: (pkg: string) => string }[] = [
  { id: 'pnpm', label: 'pnpm', cmd: (pkg) => `pnpm add ${pkg}` },
  { id: 'npm', label: 'npm', cmd: (pkg) => `npm install ${pkg}` },
  { id: 'yarn', label: 'yarn', cmd: (pkg) => `yarn add ${pkg}` },
  { id: 'bun', label: 'bun', cmd: (pkg) => `bun add ${pkg}` },
];

export type InstallTabsVariant = 'card' | 'pill';

export function InstallTabs({
  pkg,
  variant = 'card',
}: {
  pkg: string;
  variant?: InstallTabsVariant;
}) {
  const [active, setActive] = useState<Manager>('pnpm');
  const [copied, setCopied] = useState(false);

  const activeCmd = managers.find((m) => m.id === active)!.cmd(pkg);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(activeCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked */
    }
  };

  if (variant === 'pill') {
    return (
      <div className="install-row" role="group" aria-label="Install command">
        <div
          className="install-row__tabs"
          role="tablist"
          aria-label="Package manager"
        >
          {managers.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={active === m.id}
              onClick={() => setActive(m.id)}
              className={`install-row__tab ${active === m.id ? 'is-active' : ''}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <span className="install-row__sep" aria-hidden />

        <div className="install-row__cmd-stage">
          <TextMorph
            value={activeCmd}
            className="install-row__cmd"
            renderText={(t) => <ColoredCmd text={t} />}
          />
        </div>

        <button
          type="button"
          onClick={copy}
          className={`install-row__copy ${copied ? 'is-copied' : ''}`}
          aria-label={copied ? 'Copied' : `Copy: ${activeCmd}`}
          title={copied ? 'Copied' : 'Copy command'}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    );
  }

  return (
    <div className="code-card code-card--install">
      <div className="code-card__head code-card__head--tabs">
        <div className="install-tabs" role="tablist" aria-label="Package manager">
          {managers.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={active === m.id}
              onClick={() => setActive(m.id)}
              className={`install-tab ${active === m.id ? 'is-active' : ''}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          className={`code-card__copy ${copied ? 'is-copied' : ''}`}
          aria-label={copied ? 'Copied' : `Copy: ${activeCmd}`}
          title={copied ? 'Copied' : 'Copy command'}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <div className="code-card__body install-cmd-stage">
        <TextMorph
          value={activeCmd}
          className="install-cmd"
          renderText={(t) => <ColoredCmd text={t} />}
        />
      </div>
    </div>
  );
}

function ColoredCmd({ text }: { text: string }) {
  const parts = text.split(' ');
  return (
    <code>
      {parts.map((part, i, arr) => {
        const cls =
          i === 0
            ? 'install-cmd__bin'
            : i === 1
              ? 'install-cmd__sub'
              : 'install-cmd__pkg';
        return (
          <span key={i} className={cls}>
            {part}
            {i < arr.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </code>
  );
}

function CopyIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="12" height="12" rx="2.4" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}
