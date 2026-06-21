import { Switch } from '@roy-ui/ui';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';

export function SwitchDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description={'Add the package. An accessible on/off switch (role="switch") backed by a native checkbox.'}
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { Switch } from '@roy-ui/ui';

// or just this component:
import { Switch } from '@roy-ui/ui/switch';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="A label and a thumb that slides on toggle. Put the label before the track with labelPosition, or surface an error string for inline validation."
      >
        <Example
          title="On, label-start, error"
          description="The thumb eases across on toggle; labelPosition moves the label to the leading side; an error string recolours the track and adds a helper line."
          code={`<Switch label="Email me product updates" defaultChecked />
<Switch label="Two-factor authentication" labelPosition="start" />
<Switch label="Accept marketing" error="Please choose an option" />`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 280 }}>
            <Switch theme="dark" label="Email me product updates" defaultChecked />
            <Switch theme="dark" label="Two-factor authentication" labelPosition="start" />
            <Switch theme="dark" label="Accept marketing" error="Please choose an option" />
          </div>
        </Example>
      </DocSection>

      <DocSection
        id="props"
        eyebrow="03"
        title="Props"
        description="Native input attributes (checked, defaultChecked, onChange, name, disabled…) spread onto the input; ref forwards to it."
      >
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', def: '—', desc: 'Label beside the track.' },
            { name: 'labelPosition', type: `'start' | 'end'`, def: `'end'`, desc: 'Which side the label sits on.' },
            { name: 'helperText', type: 'ReactNode', def: '—', desc: 'Quiet line beneath; replaced by an error string.' },
            { name: 'error', type: 'boolean | string', def: 'false', desc: 'Error state. A string becomes the helper line; the track shakes once.' },
            { name: 'size', type: `'sm' | 'md'`, def: `'md'`, desc: 'Track size.' },
            { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Follow the system or force a side.' },
          ]}
        />
      </DocSection>
    </>
  );
}
