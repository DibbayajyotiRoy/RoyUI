'use client';

import { GradientButton, Popover } from '@royui/ui';
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
    default:
      return null;
  }
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
