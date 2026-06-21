import { Checkbox } from '@roy-ui/ui';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';

export function CheckboxDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. A real native input under the hood, so keyboard and form semantics come for free."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { Checkbox } from '@roy-ui/ui';

// or just this component:
import { Checkbox } from '@roy-ui/ui/checkbox';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="A label, a drawn tick, and a focus ring. Set indeterminate for a tri-state parent checkbox, or pass an error string for inline validation."
      >
        <Example
          title="Checked, indeterminate, error"
          description="The tick strokes itself in on check; indeterminate shows a centred bar; an error string recolours the box and adds a helper line."
          code={`<Checkbox label="Subscribe to the newsletter" defaultChecked />
<Checkbox label="Select all" indeterminate />
<Checkbox label="I agree to the terms" error="Required to continue" />`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Checkbox theme="dark" label="Subscribe to the newsletter" defaultChecked />
            <Checkbox theme="dark" label="Select all" indeterminate />
            <Checkbox theme="dark" label="I agree to the terms" error="Required to continue" />
          </div>
        </Example>
      </DocSection>

      <DocSection
        id="props"
        eyebrow="03"
        title="Props"
        description="Every native input attribute (checked, defaultChecked, onChange, name, disabled…) spreads onto the input; ref forwards to it."
      >
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', def: '—', desc: 'Label beside the box.' },
            { name: 'indeterminate', type: 'boolean', def: 'false', desc: 'Tri-state; also sets el.indeterminate.' },
            { name: 'helperText', type: 'ReactNode', def: '—', desc: 'Quiet line beneath; replaced by an error string.' },
            { name: 'error', type: 'boolean | string', def: 'false', desc: 'Error state. A string becomes the helper line; the box shakes once.' },
            { name: 'size', type: `'sm' | 'md'`, def: `'md'`, desc: 'Box edge length.' },
            { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Follow the system or force a side.' },
          ]}
        />
      </DocSection>
    </>
  );
}
