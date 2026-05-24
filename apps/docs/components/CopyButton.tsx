'use client';

import { useState } from 'react';

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`code-card__copy ${copied ? 'is-copied' : ''}`}
      aria-label={`Copy ${label}`}
    >
      {copied ? 'Copied' : label}
    </button>
  );
}
