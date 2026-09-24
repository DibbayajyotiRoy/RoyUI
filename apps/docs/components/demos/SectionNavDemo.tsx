'use client';

import { useId, useState } from 'react';
import { SectionNav } from '@roy-ui/ui';

const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum.',
  'Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Maecenas faucibus mollis interdum. Nullam quis risus eget urna mollis ornare vel eu leo.',
  'Aenean lacinia bibendum nulla sed consectetur. Curabitur blandit tempus porttitor. Etiam porta sem malesuada magna mollis euismod. Sed posuere consectetur est at lobortis.',
];

const TITLES = ['Overview', 'Getting started', 'Configuration', 'Deployment', 'FAQ'];

function useSections(prefix: string, paragraphs: number) {
  return TITLES.map((label, i) => ({
    id: `${prefix}-s${i}`,
    label,
    body: LOREM.slice(0, paragraphs - (i % 2)),
  }));
}

function Article({ sections }: { sections: ReturnType<typeof useSections> }) {
  return (
    <div style={{ padding: '4px 20px 40px' }}>
      {sections.map((s) => (
        <section key={s.id} id={s.id} style={{ scrollMarginTop: 12, paddingTop: 12 }}>
          <h3 data-section-heading style={{ margin: '0 0 8px', fontSize: 17, outline: 'none' }}>
            {s.label}
          </h3>
          {s.body.map((p, j) => (
            <p key={j} style={{ margin: '0 0 12px', lineHeight: 1.65, opacity: 0.78, fontSize: 14 }}>
              {p}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}

const box: React.CSSProperties = {
  display: 'flex',
  gap: 20,
  width: '100%',
  border: '1px solid rgba(127,127,127,0.2)',
  borderRadius: 12,
  overflow: 'hidden',
};

/** Vertical rail beside a fixed-height scroll box. */
export function SectionNavDemo() {
  const prefix = useId().replace(/:/g, '');
  const sections = useSections(`sn${prefix}`, 3);
  const [active, setActive] = useState<string>('');
  return (
    <div style={{ width: '100%' }}>
      <div style={{ ...box, height: 380 }}>
        <div data-scroll-root style={{ flex: 1, minWidth: 0, overflowY: 'auto', position: 'relative' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Article sections={sections} />
            </div>
            <div style={{ width: 170, flexShrink: 0, position: 'sticky', top: 16, alignSelf: 'flex-start', paddingRight: 16 }}>
              <SectionNav
                title="On this page"
                items={sections.map(({ id, label }) => ({ id, label }))}
                onActiveChange={(id) => setActive(sections.find((s) => s.id === id)?.label ?? '')}
              />
            </div>
          </div>
        </div>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: 12, opacity: 0.6 }}>onActiveChange → {active || '—'}</p>
    </div>
  );
}

/** Horizontal pill row pinned to the top of the scroll box. */
export function SectionNavHorizontalDemo() {
  const prefix = useId().replace(/:/g, '');
  const sections = useSections(`snh${prefix}`, 2);
  return (
    <div style={{ ...box, height: 340, display: 'block' }}>
      <div data-scroll-root style={{ height: '100%', overflowY: 'auto' }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            padding: '10px 12px 8px',
            background: 'var(--bg, Canvas)',
            borderBottom: '1px solid rgba(127,127,127,0.15)',
          }}
        >
          <SectionNav orientation="horizontal" items={sections.map(({ id, label }) => ({ id, label }))} />
        </div>
        <Article sections={sections} />
      </div>
    </div>
  );
}

/** Small self-scrolling card for the catalog grid. */
export function SectionNavPreview({ compact = false }: { compact?: boolean }) {
  const prefix = useId().replace(/:/g, '');
  const sections = useSections(`snp${prefix}`, compact ? 1 : 2).slice(0, 4);
  return (
    <div style={{ ...box, height: compact ? 170 : 240, border: 0, borderRadius: 0 }}>
      <div data-scroll-root style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0, fontSize: 12 }}>
            <Article sections={sections} />
          </div>
          <div style={{ width: 120, flexShrink: 0, position: 'sticky', top: 8, alignSelf: 'flex-start', paddingRight: 8 }}>
            <SectionNav items={sections.map(({ id, label }) => ({ id, label }))} aria-label="Preview sections" />
          </div>
        </div>
      </div>
    </div>
  );
}
