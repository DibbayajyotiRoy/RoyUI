import { Textarea } from '@roy-ui/ui';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';

export function TextareaDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. The field ships its own CSS and shares Input's floating-label motion — no separate stylesheet."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { Textarea } from '@roy-ui/ui';

// or just this component:
import { Textarea } from '@roy-ui/ui/textarea';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Same chrome as Input, multiline. Turn on autoGrow to let it expand with content up to maxRows, and showCount to surface a character counter that turns red past maxLength."
      >
        <Example
          title="Auto-grow with a counter"
          description="The field grows as you type up to maxRows, then scrolls. The counter ticks live and goes red over the limit."
          code={`<Textarea
  label="About your team"
  placeholder="A sentence or two…"
  autoGrow
  maxLength={160}
  showCount
/>`}
        >
          <div style={{ width: 360 }}>
            <Textarea
              theme="dark"
              label="About your team"
              placeholder="A sentence or two…"
              autoGrow
              maxLength={160}
              showCount
            />
          </div>
        </Example>

        <Example
          title="Error state"
          description="Pass a string to error and it both recolours the field and becomes the helper line, with a one-time shake on entry."
          code={`<Textarea label="Feedback" error="Tell us a little more" />`}
        >
          <div style={{ width: 360 }}>
            <Textarea theme="dark" label="Feedback" error="Tell us a little more" />
          </div>
        </Example>
      </DocSection>

      <DocSection
        id="props"
        eyebrow="03"
        title="Props"
        description="label is required. Every other native textarea attribute (value, onChange, rows, maxLength, name…) spreads onto the element."
      >
        <PropsTable
          rows={[
            { name: 'label', type: 'string', def: '—', desc: 'Required. Floating label.' },
            { name: 'autoGrow', type: 'boolean', def: 'false', desc: 'Grow with content up to maxRows, then scroll.' },
            { name: 'minRows', type: 'number', def: '3', desc: 'Initial / minimum visible rows.' },
            { name: 'maxRows', type: 'number', def: '8', desc: 'Cap for autoGrow before it scrolls.' },
            { name: 'showCount', type: 'boolean', def: 'false', desc: 'Show a character counter; goes red over maxLength.' },
            { name: 'helperText', type: 'ReactNode', def: '—', desc: 'Quiet line beneath the field; replaced by an error / success string.' },
            { name: 'error', type: 'boolean | string', def: 'false', desc: 'Error state. A string becomes the helper line; the field shakes once.' },
            { name: 'success', type: 'boolean | string', def: 'false', desc: 'Success state (outranked by error).' },
            { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Follow the system or force a side.' },
          ]}
        />
      </DocSection>
    </>
  );
}
