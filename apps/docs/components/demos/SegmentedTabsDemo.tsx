'use client';

import { useState } from 'react';
import { SegmentedTabs, type SegmentedTabsItem } from '@roy-ui/ui';

const svg = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const HomeIcon = () => (
  <svg {...svg}>
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
);
const ChartIcon = () => (
  <svg {...svg}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);
const GearIcon = () => (
  <svg {...svg}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  </svg>
);

export function SegmentedTabsBasicDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <SegmentedTabs
        aria-label="Billing period"
        items={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Yearly' },
          { value: 'lifetime', label: 'Lifetime', disabled: true },
        ]}
      />
      <SegmentedTabs
        aria-label="View"
        size="sm"
        defaultValue="list"
        items={[
          { value: 'grid', label: 'Grid' },
          { value: 'list', label: 'List' },
          { value: 'board', label: 'Board' },
        ]}
      />
    </div>
  );
}

export function SegmentedTabsUnderlineDemo() {
  return (
    <SegmentedTabs
      variant="underline"
      aria-label="Sections"
      items={[
        { value: 'overview', label: 'Overview', icon: <HomeIcon /> },
        { value: 'analytics', label: 'Analytics', icon: <ChartIcon /> },
        { value: 'settings', label: 'Settings', icon: <GearIcon /> },
      ]}
    />
  );
}

type Plan = 'code' | 'preview' | 'notes';
const panels: Record<Plan, string> = {
  code: 'The source for this component lives in one .tsx file and one .css file.',
  preview: 'A live render of the component, re-drawn as you change props.',
  notes: 'Release notes: indicator now re-measures when items change.',
};

export function SegmentedTabsControlledDemo() {
  const [tab, setTab] = useState<Plan>('code');
  const items: SegmentedTabsItem<Plan>[] = [
    { value: 'code', label: 'Code' },
    { value: 'preview', label: 'Preview' },
    { value: 'notes', label: 'Notes' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <SegmentedTabs<Plan>
        aria-label="Content"
        items={items}
        value={tab}
        onValueChange={setTab}
        panelIdPrefix="segtabs-demo"
      />
      {items.map((i) => (
        <div
          key={i.value}
          id={`segtabs-demo-${i.value}`}
          role="tabpanel"
          hidden={i.value !== tab}
          style={{ fontSize: 14, opacity: 0.8 }}
        >
          {panels[i.value]}
        </div>
      ))}
    </div>
  );
}

export function SegmentedTabsFullWidthDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <SegmentedTabs
        fullWidth
        aria-label="Theme"
        defaultValue="system"
        items={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'System' },
        ]}
      />
    </div>
  );
}

/** Catalog card preview. */
export function SegmentedTabsPreview({ compact = false }: { compact?: boolean }) {
  return (
    <SegmentedTabs
      aria-label="Preview"
      size={compact ? 'sm' : 'md'}
      items={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
    />
  );
}
