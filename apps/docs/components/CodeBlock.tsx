'use client';

import { useState } from 'react';

export function CodeBlock({
  code,
  language = 'tsx',
  tag,
}: {
  code: string;
  language?: string;
  tag?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="code-wrap">
      <div className="code-toolbar">
        <span className="code-tag">{tag ?? language}</span>
        <button
          type="button"
          onClick={copy}
          className="code-copy"
          aria-label="Copy code"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="code-block">
        <code>{code}</code>
      </pre>
    </div>
  );
}
