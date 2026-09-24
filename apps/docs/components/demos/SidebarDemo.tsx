'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar, type SidebarSection } from '@roy-ui/ui';

const I = ({ d }: { d: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const icons = {
  home: <I d={<><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>} />,
  inbox: <I d={<><path d="M4 13l2-8h12l2 8" /><path d="M4 13v6h16v-6h-5a3 3 0 0 1-6 0z" /></>} />,
  chart: <I d={<><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" /></>} />,
  folder: <I d={<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />} />,
  users: <I d={<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M18 14a6 6 0 0 1 3.5 6" /></>} />,
  card: <I d={<><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 10h19" /></>} />,
  gear: <I d={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>} />,
};

export const demoSections: SidebarSection[] = [
  {
    label: 'Workspace',
    items: [
      { id: 'home', label: 'Home', icon: icons.home },
      { id: 'inbox', label: 'Inbox', icon: icons.inbox, badge: 12 },
      { id: 'analytics', label: 'Analytics', icon: icons.chart },
      { id: 'projects', label: 'Projects', icon: icons.folder },
    ],
  },
  {
    label: 'Team',
    items: [
      { id: 'members', label: 'Members', icon: icons.users },
      { id: 'billing', label: 'Billing', icon: icons.card },
      { id: 'settings', label: 'Settings', icon: icons.gear },
    ],
  },
];

const Brand = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
    <span
      style={{
        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
        background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
      }}
    />
    Acme
  </div>
);

const frame: React.CSSProperties = {
  display: 'flex',
  height: 440,
  width: '100%',
  borderRadius: 12,
  overflow: 'hidden',
  border: '1px solid rgba(127,127,127,0.18)',
};

export function SidebarDemo({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const [active, setActive] = useState('inbox');
  return (
    <div style={frame}>
      <Sidebar
        sections={demoSections}
        activeId={active}
        onSelect={(id) => setActive(id)}
        defaultCollapsed={defaultCollapsed}
        header={<Brand />}
        footer={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px', whiteSpace: 'nowrap', fontSize: 13 }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Roy D.</span>
          </div>
        }
      />
      <div style={{ flex: 1, padding: 24, fontSize: 14, opacity: 0.7 }}>
        Current page: <strong>{active}</strong>
      </div>
    </div>
  );
}

/** Controlled collapse from outside the sidebar. */
export function SidebarControlledDemo() {
  const [active, setActive] = useState('analytics');
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        style={{ alignSelf: 'flex-start', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(127,127,127,0.3)', background: 'transparent', color: 'inherit', cursor: 'pointer' }}
      >
        {collapsed ? 'Expand' : 'Collapse'}
      </button>
      <div style={frame}>
        <Sidebar
          sections={demoSections}
          activeId={active}
          onSelect={(id) => setActive(id)}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<Brand />}
        />
        <div style={{ flex: 1 }} />
      </div>
    </div>
  );
}

/** Small preview for the catalog card. */
export function SidebarPreview({ compact }: { compact: boolean }) {
  const [active, setActive] = useState('inbox');
  return (
    <div style={{ ...frame, height: compact ? 260 : 360, width: compact ? 'auto' : '100%', border: 0 }}>
      <Sidebar
        sections={compact ? demoSections.slice(0, 1) : demoSections}
        activeId={active}
        onSelect={(id) => setActive(id)}
        header={<Brand />}
        style={{ width: compact ? 200 : undefined }}
        collapsible={!compact}
      />
    </div>
  );
}
