import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';
import {
  SegmentedTabsBasicDemo,
  SegmentedTabsUnderlineDemo,
  SegmentedTabsControlledDemo,
  SegmentedTabsFullWidthDemo,
} from './demos/SegmentedTabsDemo';

export function SegmentedTabsDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. SegmentedTabs is a segmented toggle or tab strip with one shared indicator that slides between options. It ships its own CSS."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { SegmentedTabs } from '@roy-ui/ui';

// or just this component:
import { SegmentedTabs } from '@roy-ui/ui/segmented-tabs';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Pass an items array. Without value it is uncontrolled and starts on defaultValue, or on the first enabled item. Give it an aria-label so screen readers can name the tab list."
      >
        <Example
          title="Segmented"
          description="The default boxed toggle, in md and sm. Disabled items are skipped by the keyboard."
          code={`<SegmentedTabs
  aria-label="Billing period"
  items={[
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'lifetime', label: 'Lifetime', disabled: true },
  ]}
/>

<SegmentedTabs size="sm" defaultValue="list" aria-label="View" items={views} />`}
        >
          <SegmentedTabsBasicDemo />
        </Example>
      </DocSection>

      <DocSection
        id="variants"
        eyebrow="03"
        title="Variants"
        description="variant='underline' gives a tab strip: a soft pill sits over an underline. Each item can take a leading icon, which is sized to 16px."
      >
        <Example
          title="Underline with icons"
          description="Icons sit before the label; the pill and underline glide together."
          code={`<SegmentedTabs
  variant="underline"
  aria-label="Sections"
  items={[
    { value: 'overview', label: 'Overview', icon: <HomeIcon /> },
    { value: 'analytics', label: 'Analytics', icon: <ChartIcon /> },
    { value: 'settings', label: 'Settings', icon: <GearIcon /> },
  ]}
/>`}
        >
          <SegmentedTabsUnderlineDemo />
        </Example>

        <Example
          title="Controlled, with panels"
          description="Pass value and onValueChange to control it. With panelIdPrefix, each tab gets aria-controls='{prefix}-{value}'. Give your panels those ids and role='tabpanel'. The value type is inferred from items, so onValueChange receives your union type."
          code={`const [tab, setTab] = useState<'code' | 'preview' | 'notes'>('code');

<SegmentedTabs
  aria-label="Content"
  items={items}
  value={tab}
  onValueChange={setTab}
  panelIdPrefix="content"
/>
{items.map((i) => (
  <div key={i.value} id={\`content-\${i.value}\`} role="tabpanel" hidden={i.value !== tab}>
    …
  </div>
))}`}
        >
          <SegmentedTabsControlledDemo />
        </Example>

        <Example
          title="Full width"
          description="fullWidth makes the items stretch to fill the container equally."
          code={`<SegmentedTabs fullWidth defaultValue="system" aria-label="Theme" items={themes} />`}
        >
          <SegmentedTabsFullWidthDemo />
        </Example>
      </DocSection>

      <DocSection
        id="behavior"
        eyebrow="04"
        title="Behavior & accessibility"
        description="It follows the WAI-ARIA tabs pattern: role='tablist' and role='tab', roving tabindex, and ←/→ to move and select (Home and End jump to the ends), skipping disabled items. The indicator glides with translate and width over 250ms. It snaps into place on first paint, on resize, and when items, variant or size change. Under prefers-reduced-motion it moves without animating. Labels reserve room for their heavier selected weight, so selecting a tab never shifts the layout. When the strip overflows, it scrolls sideways and keeps the selected tab in view. theme='auto' follows prefers-color-scheme."
      >
        <Code
          label="Theming"
          code={`/* Override on the component or on :root. */
.royui-segtabs {
  --royui-segtabs-track: rgba(140, 146, 158, 0.12);
  --royui-segtabs-pill: #ffffff;
  --royui-segtabs-pill-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  --royui-segtabs-fg: #111827;
  --royui-segtabs-muted: #6b7280;
  --royui-segtabs-underline: rgba(140, 146, 158, 0.3);
  --royui-segtabs-ring: #60a5fa;
  --royui-segtabs-duration: 250ms;
}`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="05"
        title="Props"
        description="Other props you pass (aria-label, className, style, data-*, event handlers) are spread onto the tablist div. The ref also points to that div."
      >
        <PropsTable
          rows={[
            {
              name: 'items',
              type: 'SegmentedTabsItem<V>[]',
              def: '—',
              desc: 'Options: { value, label, icon?, disabled? }. Required.',
            },
            { name: 'value', type: 'V', def: '—', desc: 'Controlled selected value.' },
            {
              name: 'defaultValue',
              type: 'V',
              def: 'first enabled item',
              desc: 'Initial value when uncontrolled.',
            },
            {
              name: 'onValueChange',
              type: '(value: V) => void',
              def: '—',
              desc: 'Called with the newly selected value.',
            },
            {
              name: 'variant',
              type: `'segmented' | 'underline'`,
              def: `'segmented'`,
              desc: 'Boxed toggle, or a tab strip with a pill over an underline.',
            },
            { name: 'size', type: `'sm' | 'md'`, def: `'md'`, desc: 'Control height and font size.' },
            { name: 'fullWidth', type: 'boolean', def: 'false', desc: 'Stretch items to fill the container.' },
            {
              name: 'theme',
              type: `'light' | 'dark' | 'auto'`,
              def: `'auto'`,
              desc: 'Colour scheme. auto follows prefers-color-scheme.',
            },
            {
              name: 'panelIdPrefix',
              type: 'string',
              def: '—',
              desc: 'When set, each tab gets aria-controls="{prefix}-{value}".',
            },
            { name: 'className', type: 'string', def: '—', desc: 'Extra classes for the tablist.' },
          ]}
        />
      </DocSection>
    </>
  );
}
