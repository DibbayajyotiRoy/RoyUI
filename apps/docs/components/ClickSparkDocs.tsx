import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';
import { ClickSparkScopedDemo, ClickSparkVariantsDemo } from './demos/ClickSparkDemo';

export function ClickSparkDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. ClickSpark draws a small star of rays at the pointer on every click. It renders nothing itself and needs no stylesheet."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { ClickSpark } from '@roy-ui/ui';

// or just this component:
import { ClickSpark } from '@roy-ui/ui/click-spark';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Mount it once, for example in your root layout, and every pointer click in the document sparks. Pass a target ref to limit it to one element. By default the rays take a soft tint of the clicked element's text colour, so they show up on light and dark surfaces alike."
      >
        <Example
          title="Scoped to an area"
          description="With target, only clicks inside that element spark. Try the buttons or the empty space around them."
          code={`const ref = useRef<HTMLDivElement>(null);

<div ref={ref}>
  <ClickSpark target={ref} />
  <button>Save</button>
  <button>Share</button>
  <button>Archive</button>
</div>

// or app-wide, once:
<ClickSpark />`}
        >
          <ClickSparkScopedDemo />
        </Example>
      </DocSection>

      <DocSection
        id="variants"
        eyebrow="03"
        title="Variations"
        description="Colour, ray count, length, travel, thickness and timing are all props. With jitter off, every burst uses the same angle."
      >
        <Example
          title="Colour, rays and timing"
          description="Each box has its own ClickSpark with different settings."
          code={`<ClickSpark target={a} color="#f59e0b" rays={8} />
<ClickSpark target={b} color="#60a5fa" rays={12} size={10} spread={14} thickness={1.5} />
<ClickSpark target={c} color="#f472b6" rays={4} duration={900} jitter={false} />`}
        >
          <ClickSparkVariantsDemo />
        </Example>
      </DocSection>

      <DocSection
        id="behavior"
        eyebrow="04"
        title="Behavior & accessibility"
        description="Only primary-button pointer clicks spark. Keyboard activation (Enter or Space, where event.detail is 0) never does, and nothing sparks under prefers-reduced-motion. Each burst is an aria-hidden, pointer-events: none node fixed to <body>. It is removed as soon as its Web Animations finish, so it never blocks clicks or stays in the DOM. The listener is passive and runs in the capture phase, so handlers that stop propagation still get a spark. Option changes apply to the next click without re-binding the listener. It is SSR-safe: nothing touches window or document until the component mounts."
      >
        <Code
          label="Toggle without unmounting"
          code={`<ClickSpark disabled={!settings.sparks} />`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="05"
        title="Props"
        description="ClickSpark renders null, so it takes no DOM props."
      >
        <PropsTable
          rows={[
            {
              name: 'target',
              type: 'RefObject<HTMLElement | null>',
              def: 'document',
              desc: 'Element to listen on. Omit it to spark on every click in the document.',
            },
            {
              name: 'color',
              type: 'string',
              def: 'text colour at 70%',
              desc: 'Ray colour (any CSS colour). The default is a soft tint of the clicked element’s text colour.',
            },
            { name: 'rays', type: 'number', def: '5', desc: 'Number of rays in each burst.' },
            { name: 'size', type: 'number', def: '6', desc: 'Length of each ray in px.' },
            { name: 'spread', type: 'number', def: '8', desc: 'How far each ray travels outward as it fades, in px.' },
            { name: 'thickness', type: 'number', def: '1.25', desc: 'Ray thickness in px.' },
            { name: 'duration', type: 'number', def: '520', desc: 'Burst duration in ms.' },
            {
              name: 'jitter',
              type: 'boolean',
              def: 'true',
              desc: 'Rotate each burst randomly so rapid clicks don’t all make the same star.',
            },
            { name: 'disabled', type: 'boolean', def: 'false', desc: 'Turn the effect off without unmounting.' },
          ]}
        />
      </DocSection>
    </>
  );
}
