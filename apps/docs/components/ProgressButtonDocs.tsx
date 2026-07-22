import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';
import {
  ProgressButtonDemo,
  ProgressButtonErrorDemo,
  ProgressButtonDurationDemo,
} from './demos/ProgressButtonDemo';

export function ProgressButtonDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. A self-reverting async action button — click, watch it work, see the verdict, and it's a button again. Ships its own CSS; nothing else to wire up."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { ProgressButton } from '@roy-ui/ui';

// or just this component:
import { ProgressButton } from '@roy-ui/ui/progress-button';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Pass your async work as onAction. On click the button disables itself and morphs into a progress state — braille spinner, wave dots, and a shimmer sweep. When the promise resolves, a check draws itself in with your successLabel; if it rejects, a cross with your errorLabel. After resultDuration (2s by default) the button returns to its idle form, ready to press again. Actions that finish instantly still show progress for a moment, so the state never flashes."
      >
        <Example
          title="Happy path"
          description="The action resolves after two seconds. Notice the trailing dots in the progress label bob in a wave — write the label with a trailing … and the button animates it for you."
          code={`<ProgressButton
  onAction={() => deploy()}       // any promise
  progressLabel="Deploying…"
  successLabel="Deployed"
>
  Deploy
</ProgressButton>`}
        >
          <ProgressButtonDemo />
        </Example>

        <Example
          title="Failure path"
          description="A rejected promise flips the verdict to the error flag instead — no try/catch needed on your side. Progress looks the same as any other run; the color only turns red at the moment of failure, with the same one-shot shake the form fields use."
          code={`<ProgressButton
  onAction={async () => {
    await deploy();               // throws → error flag + shake
  }}
  progressLabel="Deploying…"
  errorLabel="Deploy failed"
>
  Deploy
</ProgressButton>`}
        >
          <ProgressButtonErrorDemo />
        </Example>
      </DocSection>

      <DocSection
        id="result-duration"
        eyebrow="03"
        title="Result duration"
        description="resultDuration controls how long the success or error flag lingers before the button reverts to idle. Keep it short (~800ms) for repeated actions like Save, longer for verdicts the user should register."
      >
        <Example
          title="Quick vs lingering"
          description="Both buttons run the same 1.2s action; only the flag time differs."
          code={`<ProgressButton onAction={save} resultDuration={800} successLabel="Saved">
  Save
</ProgressButton>

<ProgressButton onAction={save} resultDuration={4000} successLabel="Saved">
  Save
</ProgressButton>`}
        >
          <ProgressButtonDurationDemo />
        </Example>
      </DocSection>

      <DocSection
        id="behavior"
        eyebrow="04"
        title="Behavior & accessibility"
        description="All four states render stacked on a single grid cell, so the button's width never jumps — states crossfade with opacity, a slight rise, and a 2px blur that masks the swap. The transitions are CSS transitions (not keyframes), so rapid state changes retarget smoothly instead of restarting. The button disables itself while busy, scales down 3% on press for tactile feedback, and announces each state change via aria-live='polite' with aria-busy during progress. Under prefers-reduced-motion the shimmer, wave dots, rise, and blur are all removed — states simply fade. Every color is a CSS variable if you want to rebrand it."
      >
        <Code
          label="Controlled mode"
          code={`// Drive the states yourself — clicks only call onAction.
<ProgressButton status={status} onAction={start}>
  Deploy
</ProgressButton>`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="05"
        title="Props"
        description="Everything else you pass (className, style, data-*, disabled) is spread onto the native button. onClick is replaced by onAction."
      >
        <PropsTable
          rows={[
            {
              name: 'children',
              type: 'ReactNode',
              def: '—',
              desc: 'Idle button content, e.g. "Deploy". Required.',
            },
            {
              name: 'onAction',
              type: '() => void | Promise<unknown>',
              def: '—',
              desc: 'Async work started on click. Resolve → success flag, reject → error flag.',
            },
            {
              name: 'progressLabel',
              type: 'string',
              def: `'Working…'`,
              desc: 'Text shown while the action runs. A trailing … becomes animated wave dots.',
            },
            {
              name: 'successLabel',
              type: 'string',
              def: `'Done'`,
              desc: 'Text shown with the check when the action resolves.',
            },
            {
              name: 'errorLabel',
              type: 'string',
              def: `'Failed'`,
              desc: 'Text shown with the cross when the action rejects.',
            },
            {
              name: 'resultDuration',
              type: 'number',
              def: '2000',
              desc: 'How long the success/error flag stays before reverting to idle, in ms.',
            },
            {
              name: 'tone',
              type: `'danger' | 'warning' | 'neutral' | 'success' | 'info'`,
              def: `'info'`,
              desc: 'Tone of the in-progress state. Success/error states use their own colors.',
            },
            {
              name: 'rememberOutcome',
              type: 'boolean',
              def: 'true',
              desc: 'After reverting to idle, keep a subtle green/red edge from the last outcome. Set false to return to the untouched look.',
            },
            {
              name: 'status',
              type: `'idle' | 'progress' | 'success' | 'error'`,
              def: '—',
              desc: 'Controlled status. When set, clicks only call onAction — you drive the states.',
            },
          ]}
        />
      </DocSection>
    </>
  );
}
