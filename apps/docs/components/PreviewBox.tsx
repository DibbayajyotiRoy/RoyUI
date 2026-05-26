'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import {
  GradientButton,
  MadeBy,
  Popover,
  TextMorph,
  TreeNav,
  TreeNavItem,
} from '@roy-ui/ui';
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
    case 'tree-nav':
      return <TreeNavPreview compact={compact} />;
    case 'data-table':
      return <DataTableThumb compact={compact} />;
    default:
      return null;
  }
}

function DataTableThumb({ compact }: { compact: boolean }) {
  const rows = [
    { id: 'INV-4201', name: 'Aarav Okafor', status: 'paid', total: '$148.32' },
    { id: 'INV-4202', name: 'Mira Lindqvist', status: 'pending', total: '$92.05' },
    { id: 'INV-4203', name: 'Theo Reyes', status: 'paid', total: '$310.40' },
    { id: 'INV-4204', name: 'Yuna Tanaka', status: 'refunded', total: '$58.00' },
  ];
  const colorByStatus: Record<string, string> = {
    paid: 'rgba(110, 220, 150, 0.95)',
    pending: 'rgba(240, 196, 88, 0.95)',
    refunded: 'rgba(200, 200, 210, 0.7)',
  };
  return (
    <div
      style={{
        width: compact ? 240 : 340,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: compact ? 10.5 : 11.5,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.4fr 0.8fr 0.8fr',
          gap: 0,
          padding: '7px 10px',
          fontSize: compact ? 9 : 10,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span>Order</span>
        <span>Customer</span>
        <span>Status</span>
        <span style={{ textAlign: 'right' }}>Total</span>
      </div>
      {rows.map((r) => (
        <div
          key={r.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1.4fr 0.8fr 0.8fr',
            padding: '8px 10px',
            color: 'rgba(255,255,255,0.9)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'ui-monospace, Menlo, monospace',
              color: 'rgba(255,255,255,0.65)',
              fontSize: compact ? 10 : 11,
            }}
          >
            {r.id}
          </span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {r.name}
          </span>
          <span style={{ color: colorByStatus[r.status] }}>{r.status}</span>
          <span
            style={{
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
              color: 'rgba(255,255,255,0.92)',
            }}
          >
            {r.total}
          </span>
        </div>
      ))}
    </div>
  );
}

function TreeNavPreview({ compact }: { compact: boolean }) {
  return (
    <div
      style={{
        width: compact ? 200 : 240,
        padding: compact ? 12 : 16,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.92)',
          paddingLeft: 8,
          marginBottom: 4,
        }}
      >
        Pricing
      </div>
      <TreeNav
        style={
          {
            ['--royui-treenav-branch']: 'rgba(255,255,255,0.22)',
            ['--royui-treenav-branch-active']: 'rgba(255,255,255,0.6)',
            ['--royui-treenav-label']: 'rgba(255,255,255,0.6)',
            ['--royui-treenav-label-hover']: 'rgba(255,255,255,0.95)',
            ['--royui-treenav-label-active']: '#fff',
            ['--royui-treenav-hover-bg']: 'rgba(255,255,255,0.06)',
            ['--royui-treenav-active-bg']: 'rgba(255,255,255,0.08)',
          } as CSSProperties
        }
      >
        <TreeNavItem
          href="#"
          active
          linkProps={{ onClick: (e) => e.preventDefault() }}
        >
          Pay per use
        </TreeNavItem>
        <TreeNavItem
          href="#"
          linkProps={{ onClick: (e) => e.preventDefault() }}
        >
          Packages
        </TreeNavItem>
      </TreeNav>
    </div>
  );
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
