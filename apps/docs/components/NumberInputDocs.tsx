import { NumberInput } from '@roy-ui/ui';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';

export function NumberInputDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. Input's floating-label chrome plus stepper buttons and keyboard stepping."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { NumberInput } from '@roy-ui/ui';

// or just this component:
import { NumberInput } from '@roy-ui/ui/number-input';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Steppers in the trailing slot, ArrowUp / ArrowDown to step, PageUp / PageDown to jump by ten, clamped to min and max. precision rounds on blur and step. onChange gives you a number or null."
      >
        <Example
          title="Seats, with bounds"
          description="Step with the buttons or the arrow keys; the value clamps to [1, 200] and the steppers disable at the bounds."
          code={`<NumberInput
  label="Seats"
  defaultValue={5}
  min={1}
  max={200}
  step={1}
  onChange={(n) => console.log(n)}
/>`}
        >
          <div style={{ width: 240 }}>
            <NumberInput theme="dark" label="Seats" defaultValue={5} min={1} max={200} />
          </div>
        </Example>

        <Example
          title="Currency with precision"
          description="precision rounds to two decimals on blur and step; step moves by 0.5."
          code={`<NumberInput label="Hourly rate" defaultValue={49.5} step={0.5} precision={2} />`}
        >
          <div style={{ width: 240 }}>
            <NumberInput theme="dark" label="Hourly rate" defaultValue={49.5} step={0.5} precision={2} />
          </div>
        </Example>
      </DocSection>

      <DocSection
        id="props"
        eyebrow="03"
        title="Props"
        description="Controlled with value (number | null) + onChange, or uncontrolled with defaultValue."
      >
        <PropsTable
          rows={[
            { name: 'label', type: 'string', def: '—', desc: 'Required. Floating label.' },
            { name: 'value', type: 'number | null', def: '—', desc: 'Controlled value; null means empty.' },
            { name: 'defaultValue', type: 'number | null', def: '—', desc: 'Uncontrolled initial value.' },
            { name: 'onChange', type: '(value: number | null) => void', def: '—', desc: 'Fires with the parsed number (or null).' },
            { name: 'min / max', type: 'number', def: '—', desc: 'Clamp bounds; steppers disable at the edges.' },
            { name: 'step', type: 'number', def: '1', desc: 'Increment for steppers and arrow keys.' },
            { name: 'precision', type: 'number', def: '—', desc: 'Decimal places to round to on blur / step.' },
            { name: 'steppers', type: 'boolean', def: 'true', desc: 'Show the +/- buttons.' },
            { name: 'error', type: 'boolean | string', def: 'false', desc: 'Error state. A string becomes the helper line.' },
            { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Follow the system or force a side.' },
          ]}
        />
      </DocSection>
    </>
  );
}
