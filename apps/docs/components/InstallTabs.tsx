'use client';

import { useState } from 'react';

type Manager = 'pnpm' | 'npm' | 'bun' | 'yarn';

const managers: { id: Manager; label: string; cmd: (pkg: string) => string }[] = [
  { id: 'pnpm', label: 'pnpm', cmd: (pkg) => `pnpm add ${pkg}` },
  { id: 'npm', label: 'npm', cmd: (pkg) => `npm install ${pkg}` },
  { id: 'yarn', label: 'yarn', cmd: (pkg) => `yarn add ${pkg}` },
  { id: 'bun', label: 'bun', cmd: (pkg) => `bun add ${pkg}` },
];

export function InstallTabs({ pkg }: { pkg: string }) {
  const [active, setActive] = useState<Manager>('pnpm');
  const [copied, setCopied] = useState(false);
  const current = managers.find((m) => m.id === active)!;
  const cmd = current.cmd(pkg);
  const [bin, subcommand, ...rest] = cmd.split(' ');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked */
    }
  };

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
          aria-label={copied ? 'Copied' : `Copy: ${cmd}`}
          title={copied ? 'Copied' : 'Copy command'}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <div className="code-card__body">
        <pre className="install-cmd">
          <code>
            <span className="install-cmd__bin">{bin}</span>
            <span className="install-cmd__sub"> {subcommand} </span>
            <span className="install-cmd__pkg">{rest.join(' ')}</span>
          </code>
        </pre>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
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
      width="14"
      height="14"
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
