import { StatCard } from '@roy-ui/ui';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { PreviewTabs } from './PreviewTabs';
import {
  statCardSamples,
  RevenueIcon,
} from './demos/stat-card-sample';
import { StatCardClickableDemo } from './demos/StatCardClickableDemo';
import type { ReactNode } from 'react';

export function StatCardDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package to your project. The card ships its own CSS, draws its own sparkline, and pulls in no icon or chart library — there's nothing else to wire up."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { StatCard } from '@roy-ui/ui';

// or import just this component (its own 'use client' island):
import { StatCard } from '@roy-ui/ui/stat-card';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="At its smallest the card is a label and a value. Layer on a delta chip, a sparkline, an icon, or a link as the metric earns them. The previews below run dark to read against this page; the card is theme-aware either way."
      >
        <Example
          title="Minimal"
          description="A label and a value. The label truncates if it runs long; the value is the hero. Nothing else is drawn, so a bare metric stays bare."
          code={`<StatCard label="Active orgs" value="276" />`}
        >
          <div style={{ width: 240 }}>
            <StatCard theme="dark" label="Active orgs" value="276" />
          </div>
        </Example>

        <Example
          title="With a sparkline and trend"
          description="Pass a real data series and the card draws a smooth monotone sparkline beneath the value, stroked in the accent color. Hover the card and the line redraws itself from the start; tune the pace with drawDuration (it runs at a relaxed 1200ms here). A signed delta becomes a chip whose arrow and color follow the change."
          code={`<StatCard
  label="Revenue"
  value="$125.4K"
  sub="+$42.1K this month"
  delta={12.4}
  data={[56, 47, 42, 52, 66, 83, 98]}
  icon={<RevenueIcon />}
/>`}
        >
          <div style={{ width: 240 }}>
            <StatCard
              theme="dark"
              label="Revenue"
              value="$125.4K"
              sub="+$42.1K this month"
              delta={12.4}
              data={[56, 47, 42, 52, 66, 83, 98]}
              icon={<RevenueIcon />}
            />
          </div>
        </Example>

        <Example
          title="Sentiment-aware trend"
          description={`Color tracks sentiment, not raw direction. Revenue is up, so its chip is green. Error rate is down — but a falling error rate is the good outcome, so with goodDirection="down" that drop reads green too. The component knows which way is the right way for each metric.`}
          code={`// up is good by default — a rising number reads green
<StatCard label="Revenue" value="$125.4K" delta={12.4} />

// down is good here — a falling number reads green, not red
<StatCard
  label="Error rate"
  value="0.42%"
  sub="Down from 0.71%"
  delta={-12.5}
  goodDirection="down"
/>`}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <div style={{ width: 220 }}>
              <StatCard
                theme="dark"
                label="Revenue"
                value="$125.4K"
                sub="+$42.1K this month"
                delta={12.4}
                data={[56, 47, 42, 52, 66, 83, 98]}
              />
            </div>
            <div style={{ width: 220 }}>
              <StatCard
                theme="dark"
                label="Error rate"
                value="0.42%"
                sub="Down from 0.71%"
                delta={-12.5}
                goodDirection="down"
                data={[0.71, 0.63, 0.67, 0.56, 0.52, 0.45, 0.42]}
              />
            </div>
          </div>
        </Example>

        <Example
          title="Compact grid"
          description="Set compact for a denser card, then drop a handful into an auto-fitting grid — this is the dashboard shape. Each card carries its own accent, and a few of these data series prove the no-chart cases below sit comfortably alongside the charted ones."
          code={`<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: 8,
}}>
  {statCardSamples.map((s) => (
    <StatCard key={s.label} compact {...s} />
  ))}
</div>`}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 8,
              width: '100%',
            }}
          >
            {statCardSamples.map((s) => (
              <StatCard key={s.label} theme="dark" compact {...s} />
            ))}
          </div>
        </Example>

        <Example
          title="Clickable"
          description="Pass onClick and the whole card becomes a real <button> — keyboard-focusable, with a focus ring and an aria-label composed from the label and value. Pass href instead and it renders as an <a>. With neither it stays a plain <div>, so it never invites a click it can't honor."
          code={`<StatCard
  label="Active users"
  value="12,840"
  sub="+1,930 this week"
  delta={6.8}
  data={[10180, 10520, 17640, 13080, 12200, 12460, 12840]}
  icon={<PulseIcon />}
  onClick={() => router.push('/users')}
/>`}
        >
          <StatCardClickableDemo />
        </Example>

        <Example
          title="Loading"
          description="Set loading and the value and sparkline become a shimmer skeleton while the real numbers are in flight. The label and icon stay put, so the card holds its shape and doesn't jump when the data lands."
          code={`<StatCard
  label="p95 latency"
  value="184ms"
  data={[241, 233, 218, 205, 199, 190, 184]}
  loading
/>`}
        >
          <div style={{ width: 240 }}>
            <StatCard
              theme="dark"
              label="p95 latency"
              value="184ms"
              data={[241, 233, 218, 205, 199, 190, 184]}
              loading
            />
          </div>
        </Example>

        <Example
          title="No data, no chart"
          description="Never fabricate a series. When there's no honest data to plot, omit the data prop — the card renders cleanly with just the value, no invented line. A single point or an all-NaN array draws nothing either."
          code={`<StatCard
  label="Avg. score"
  value="7.6 / 10"
  sub="Last 30 days"
/>`}
        >
          <div style={{ width: 240 }}>
            <StatCard
              theme="dark"
              label="Avg. score"
              value="7.6 / 10"
              sub="Last 30 days"
            />
          </div>
        </Example>

        <Example
          title="Light and dark"
          description={`By default the card follows the system (theme="auto"), so it inherits your site's mode. It ships its own light and dark tokens — no Tailwind, no theme provider. Force either side with theme="light" or theme="dark".`}
          code={`// default — follows the system / your site theme
<StatCard {...kpi} />

// force one side
<StatCard theme="light" {...kpi} />
<StatCard theme="dark" {...kpi} />`}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
            <div style={{ width: 220 }}>
              <StatCard
                theme="light"
                label="Revenue"
                value="$125.4K"
                sub="+$42.1K this month"
                delta={12.4}
                data={[56, 47, 42, 52, 66, 83, 98]}
                icon={<RevenueIcon />}
              />
            </div>
            <div style={{ width: 220 }}>
              <StatCard
                theme="dark"
                label="Revenue"
                value="$125.4K"
                sub="+$42.1K this month"
                delta={12.4}
                data={[56, 47, 42, 52, 66, 83, 98]}
                icon={<RevenueIcon />}
              />
            </div>
          </div>
        </Example>
      </DocSection>

      <DocSection
        id="theming"
        eyebrow="03"
        title="Theming"
        description={`The card exposes its surface, ink, and accents as CSS variables. Override them inline or in a stylesheet — it already ships a prefers-color-scheme: dark theme, and theme="dark" forces it.`}
      >
        <Code
          label="Variables"
          code={`.royui-statcard {
  --royui-statcard-bg: #ffffff;     /* card surface */
  --royui-statcard-fg: #171717;     /* the hero value (neutral ink) */
  --royui-statcard-label: #666666;  /* label */
  --royui-statcard-faint: #8f8f8f;  /* sub + flat chip */
  --royui-statcard-line: #ededed;   /* border */
  --royui-statcard-accent: #b8880a; /* default icon + sparkline */
  --royui-statcard-good: #15803d;   /* good-direction chip */
  --royui-statcard-bad: #c4332b;    /* bad-direction chip */
  --royui-statcard-radius: 12px;
}`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="04"
        title="Props"
        description="label and value are the only required props. Any other native HTML attribute spreads onto the root element — whether that's a div, a button, or an anchor."
      >
        <PropsTable />
      </DocSection>
    </>
  );
}

function DocSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-section" id={id}>
      <div className="doc-section__head">
        <div className="doc-section__eyebrow">{eyebrow}</div>
        <h2 className="doc-section__title">{title}</h2>
        <p className="doc-section__desc">{description}</p>
      </div>
      {children}
    </section>
  );
}

async function Example({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <article className="example">
      <header className="example__head">
        <h3 className="example__title">{title}</h3>
        <p className="example__desc">{description}</p>
      </header>
      <PreviewTabs preview={children} code={<Code code={code} />} />
    </article>
  );
}

function PropsTable() {
  const rows = [
    { name: 'label', type: 'ReactNode', def: '—', desc: 'Required. The KPI title. Truncates if it runs long.' },
    { name: 'value', type: 'ReactNode', def: '—', desc: 'Required. The hero metric. Empty (null / undefined / "" / NaN) falls back to emptyValue.' },
    { name: 'sub', type: 'ReactNode', def: '—', desc: 'Muted secondary line beneath the value.' },
    { name: 'trend', type: `'up' | 'down' | 'flat'`, def: '—', desc: 'Explicit chip direction — sets the arrow and sentiment color.' },
    { name: 'delta', type: 'number', def: '—', desc: 'Signed percentage. The chip shows its absolute value plus "%".' },
    { name: 'goodDirection', type: `'up' | 'down'`, def: `'up'`, desc: 'Which direction reads green. Set "down" so falling churn or latency reads positive.' },
    { name: 'data', type: 'number[]', def: '—', desc: 'Sparkline series, real data only. Draws only with two or more finite points.' },
    { name: 'color', type: 'string', def: 'gold', desc: 'Accent for the icon and sparkline stroke. Any CSS color.' },
    { name: 'icon', type: 'ReactNode', def: '—', desc: 'Leading glyph, tinted with color. Bring your own.' },
    { name: 'href', type: 'string', def: '—', desc: 'Renders the whole card as an <a> link.' },
    { name: 'onClick', type: '() => void', def: '—', desc: 'Renders the whole card as a keyboard-accessible <button>.' },
    { name: 'loading', type: 'boolean', def: 'false', desc: 'Shimmer skeleton for the value and sparkline.' },
    { name: 'emptyValue', type: 'ReactNode', def: `'—'`, desc: 'Placeholder shown when value is empty.' },
    { name: 'compact', type: 'boolean', def: 'false', desc: 'Denser variant for dashboard grids.' },
    { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Follow the system (default), or force the built-in light or dark tokens.' },
    { name: 'drawDuration', type: 'number', def: '1200', desc: 'Milliseconds for the hover draw-in of the sparkline. Lower is snappier; 0 disables it.' },
    { name: 'className', type: 'string', def: '—', desc: 'Extra classes. Other native HTML attributes spread onto the root, too.' },
  ];
  return (
    <table className="props">
      <thead>
        <tr>
          <th style={{ width: '22%' }}>Prop</th>
          <th style={{ width: '24%' }}>Type</th>
          <th style={{ width: '16%' }}>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td className="prop-name"><code>{r.name}</code></td>
            <td className="prop-type"><code>{r.type}</code></td>
            <td className="prop-default"><code>{r.def}</code></td>
            <td className="prop-desc">{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
