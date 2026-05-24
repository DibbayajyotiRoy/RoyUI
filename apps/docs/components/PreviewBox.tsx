'use client';

import { useEffect, useState } from 'react';
import { GradientButton, MadeBy, Popover, TextMorph } from '@roy-ui/ui';
import type { ComponentEntry } from '../lib/registry';

export function PreviewBox({
  entry,
  compact = false,
}: {
  entry: ComponentEntry;
  compact?: boolean;
}) {
  if (entry.status === 'coming-soon') {
    return (
      <div className={`preview preview--placeholder ${compact ? 'preview--compact' : ''}`}>
        <div className="preview__placeholder-grid" aria-hidden="true" />
        <span className="preview__placeholder-label">Coming soon</span>
      </div>
    );
  }

  return (
    <div className={`preview ${compact ? 'preview--compact' : ''}`}>
      <div className="preview__stage">{renderLivePreview(entry, compact)}</div>
    </div>
  );
}

function renderLivePreview(entry: ComponentEntry, compact: boolean) {
  switch (entry.slug) {
    case 'gradient-button':
      return (
        <div style={{ width: compact ? 200 : 280 }}>
          <GradientButton>Join the Waitlist</GradientButton>
        </div>
      );
    case 'popover':
      return compact ? <PopoverThumb /> : <PopoverLive />;
    case 'made-by':
      return <MadeByPreview />;
    case 'text-morph':
      return <TextMorphPreview />;
    default:
      return null;
  }
}

function TextMorphPreview() {
  const phrases = ['Crafted with care.', 'Built with focus.', 'Shipped with joy.'];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % phrases.length), 2400);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <span
      style={{
        fontFamily: 'inherit',
        fontSize: 18,
        fontWeight: 500,
        color: 'rgba(255,255,255,0.95)',
      }}
    >
      <TextMorph value={phrases[i] ?? phrases[0]!} />
    </span>
  );
}

function MadeByPreview() {
  return (
    <div
      style={{
        transform: 'scale(1.6)',
        transformOrigin: 'center center',
        display: 'inline-flex',
      }}
    >
      <MadeBy
        name="Roy"
        href="https://example.com"
        style={{ position: 'static' }}
      />
    </div>
  );
}

/* Non-interactive thumb for catalog cards — Card is a Link, so we can't put
   real interactive content inside without conflicts. */
function PopoverThumb() {
  return (
    <div className="popover-thumb" aria-hidden>
      <div className="popover-thumb__row">
        <span className="popover-thumb__label">Pricing details</span>
        <span className="popover-thumb__i">i</span>
      </div>
      <div className="popover-thumb__panel">
        <div className="popover-thumb__panel-title">How this works</div>
        <div className="popover-thumb__panel-body">
          Billed monthly. Cancel any time from your dashboard.
        </div>
      </div>
    </div>
  );
}

function PopoverLive() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff' }}>
      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
        Pricing details
      </span>
      <Popover title="How this works" align="left" width="md">
        Billed monthly. Cancel any time from your dashboard. Taxes calculated at
        checkout based on your billing address.
      </Popover>
    </div>
  );
}
