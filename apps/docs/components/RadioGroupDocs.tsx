import { RadioGroup } from '@roy-ui/ui';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';

export function RadioGroupDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. Native radios provide arrow-key selection and roving focus for free."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { RadioGroup } from '@roy-ui/ui';

// or just this component (Radio ships here too):
import { RadioGroup, Radio } from '@roy-ui/ui/radio-group';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Pass a legend and an options array. Arrow keys move and select; orientation lays the options out vertically or in a row."
      >
        <Example
          title="Vertical and horizontal"
          description="The same group, two orientations. An error string adds a helper line under the group."
          code={`<RadioGroup
  label="Plan"
  name="plan"
  defaultValue="growth"
  options={[
    { label: 'Starter', value: 'starter' },
    { label: 'Growth', value: 'growth' },
    { label: 'Scale', value: 'scale' },
  ]}
/>

<RadioGroup label="Billing" name="billing" orientation="horizontal"
  options={[{ label: 'Monthly', value: 'm' }, { label: 'Yearly', value: 'y' }]} />`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26, minWidth: 280 }}>
            <RadioGroup
              theme="dark"
              label="Plan"
              name="plan-demo"
              defaultValue="growth"
              options={[
                { label: 'Starter', value: 'starter' },
                { label: 'Growth', value: 'growth' },
                { label: 'Scale', value: 'scale' },
              ]}
            />
            <RadioGroup
              theme="dark"
              label="Billing"
              name="billing-demo"
              orientation="horizontal"
              options={[
                { label: 'Monthly', value: 'm' },
                { label: 'Yearly', value: 'y' },
              ]}
            />
          </div>
        </Example>
      </DocSection>

      <DocSection
        id="props"
        eyebrow="03"
        title="Props"
        description="Controlled with value + onChange, or uncontrolled with defaultValue."
      >
        <PropsTable
          rows={[
            { name: 'options', type: 'RadioOption[]', def: '—', desc: 'Required. { label, value, disabled? } per radio.' },
            { name: 'label', type: 'string', def: '—', desc: 'Group legend.' },
            { name: 'name', type: 'string', def: 'generated', desc: 'Native group name (exclusivity).' },
            { name: 'value', type: 'string', def: '—', desc: 'Controlled selected value.' },
            { name: 'defaultValue', type: 'string', def: '—', desc: 'Uncontrolled initial value.' },
            { name: 'onChange', type: '(value: string) => void', def: '—', desc: 'Fires on selection.' },
            { name: 'orientation', type: `'vertical' | 'horizontal'`, def: `'vertical'`, desc: 'Layout direction.' },
            { name: 'error', type: 'boolean | string', def: 'false', desc: 'Error state. A string becomes the helper line.' },
            { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Follow the system or force a side.' },
          ]}
        />
      </DocSection>
    </>
  );
}
