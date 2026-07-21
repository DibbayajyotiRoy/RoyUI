import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';
import {
  ProgressPillTonesDemo,
  ProgressPillSettledDemo,
  ProgressPillLiveDemo,
} from './demos/ProgressPillDemo';

export function ProgressPillDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. A presentational status pill for long-running operations — spinner glyph, shimmer sweep, and an optional step caption. It ships its own CSS, so there's nothing else to wire up."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { ProgressPill } from '@roy-ui/ui';

// or just this component:
import { ProgressPill } from '@roy-ui/ui/progress-pill';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="ProgressPill is purely presentational — it has no polling, no queries, and no domain types. Your code maps its state machine to four props: label (the pill text), tone (the color), active (whether it's still running), and caption (the human description of the current step). That keeps one pill reusable across deletes, deploys, imports, exports, syncs, and batch jobs."
      >
        <Example
          title="A live operation"
          description="While active, the pill shows a braille spinner and a gradient shimmer sweeps across it. The caption is the live description of what is happening right now — always pass real, state-derived text, never hardcoded fiction. When the operation settles, flip active off and swap the label: spinner and shimmer simply stop."
          code={`// running
<ProgressPill
  label="Deploying…"
  tone="info"
  caption={currentStepLabel}   // e.g. "Uploading assets"
/>

// settled
<ProgressPill
  label="Deployed"
  tone="success"
  active={false}
  caption="Live at royui.dibbayajyoti.com"
/>`}
        >
          <ProgressPillLiveDemo />
        </Example>
      </DocSection>

      <DocSection
        id="tones"
        eyebrow="03"
        title="Tones & states"
        description="Five tones cover the usual operation flavors: danger for destructive work, warning for degraded or retryable states, info and neutral for benign progress, success for done. Color is never the only signal — the label text always states the state, so pick the label first and the tone second."
      >
        <Example
          title="All five tones, active"
          description="Each tone tints the border, background, and text of the pill. The spinner and shimmer run in every tone while active."
          code={`<ProgressPill label="Deleting…" tone="danger" />
<ProgressPill label="Retrying…" tone="warning" />
<ProgressPill label="Queued…" tone="neutral" />
<ProgressPill label="Finishing…" tone="success" />
<ProgressPill label="Syncing…" tone="info" />`}
        >
          <ProgressPillTonesDemo />
        </Example>

        <Example
          title="Settled states"
          description="With active={false} the pill is visually calm: no spinner, no shimmer. Use it for terminal states — completed, failed, partial failure — or quiet waiting states like a pending purge window."
          code={`<ProgressPill label="Completed" tone="success" active={false} />
<ProgressPill label="Failed" tone="danger" active={false} />
<ProgressPill label="Partially failed — retry" tone="warning" active={false} />
<ProgressPill label="Deleted — purge in 29d" tone="neutral" active={false} />`}
        >
          <ProgressPillSettledDemo />
        </Example>
      </DocSection>

      <DocSection
        id="behavior"
        eyebrow="04"
        title="Behavior & accessibility"
        description="Long labels and captions truncate with an ellipsis instead of shifting layout, and the spinner glyph reserves a fixed width so its frames never nudge the text. The shimmer rides on a ::after overlay with pointer-events: none, so it never blocks clicks on anything under or inside the pill. Under prefers-reduced-motion the shimmer sweep is removed and the spinner becomes a static ellipsis. The pill renders with role='status' and aria-live='polite' while active, so screen readers announce label and caption changes; the spinner glyph itself is aria-hidden. Caption changes crossfade in over 120ms — there's no layout animation, and no exit animation when the pill settles (row-level exits belong to your list, not this component)."
      >
        <Code
          label="Theming"
          code={`/* Every tone color is a CSS variable — override on the pill or :root. */
.royui-progresspill {
  --royui-progresspill-info-fg: #60a5fa;
  --royui-progresspill-info-bg: rgba(96, 165, 250, 0.1);
  --royui-progresspill-info-border: rgba(96, 165, 250, 0.32);
  --royui-progresspill-caption-fg: rgba(140, 146, 158, 0.85);
  --royui-progresspill-shimmer: rgba(255, 255, 255, 0.14);
}`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="05"
        title="Props"
        description="Everything else you pass (className, style, data-*, event handlers) is spread onto the outer container div."
      >
        <PropsTable
          rows={[
            {
              name: 'label',
              type: 'string',
              def: '—',
              desc: 'Pill text, e.g. "Deleting…", "Deploying…", "Synced". Required.',
            },
            {
              name: 'tone',
              type: `'danger' | 'warning' | 'neutral' | 'success' | 'info'`,
              def: `'neutral'`,
              desc: 'Color tone of the pill.',
            },
            {
              name: 'active',
              type: 'boolean',
              def: 'true',
              desc: 'Drives the spinner glyph and shimmer sweep. false renders a settled, calm pill.',
            },
            {
              name: 'caption',
              type: 'string | null',
              def: 'null',
              desc: 'Secondary muted line under the pill describing the current step.',
            },
            {
              name: 'title',
              type: 'string',
              def: 'caption ?? label',
              desc: 'Native tooltip on the container.',
            },
            {
              name: 'className',
              type: 'string',
              def: '—',
              desc: 'Extra classes for the outer container.',
            },
          ]}
        />
      </DocSection>
    </>
  );
}
