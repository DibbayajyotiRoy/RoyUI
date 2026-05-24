import type { ReactNode } from 'react';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { PreviewTabs } from './PreviewTabs';
import { TextMorphCurrencyDemo } from './demos/TextMorphCurrencyDemo';
import { TextMorphStatsDemo } from './demos/TextMorphStatsDemo';
import { TextMorphToneDemo } from './demos/TextMorphToneDemo';
import { TextMorphInstallDemo } from './demos/TextMorphInstallDemo';
import { TextMorphCustomRenderDemo } from './demos/TextMorphCustomRenderDemo';

export function TextMorphDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="One install. The primitive exports nothing but the component and its prop types."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code label="Import" code={`import { TextMorph } from '@roy-ui/ui';`} />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Hand TextMorph any string. When the string changes, it diff-types from the old value to the new one — backspacing only the differing middle, pausing a beat, then typing in the replacement."
      >
        <Example
          title="Tone switch"
          description="Toggle between two phrases. Watch the shared characters stay put while only the differing parts change."
          code={`const [tone, setTone] = useState<'casual' | 'formal'>('casual');
const lines = {
  casual: "Hey, glad you're here.",
  formal: "Welcome, we're delighted to see you.",
};

<TextMorph value={lines[tone]} />`}
        >
          <TextMorphToneDemo />
        </Example>

        <Example
          title="Live counter"
          description="Numbers in a stat block — switching between time periods. Common digits get reused, new digits get typed in."
          code={`const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
const counts = {
  today: '1,287 signups',
  week: '12,431 signups',
  month: '50,892 signups',
};

<TextMorph value={counts[period]} />`}
        >
          <TextMorphStatsDemo />
        </Example>

        <Example
          title="Currency switch"
          description="Symbol and amount change together. The 'mo' suffix stays put."
          code={`const [cur, setCur] = useState<'USD' | 'EUR' | 'GBP'>('USD');
const prices = {
  USD: '$99/mo',
  EUR: '€89/mo',
  GBP: '£69/mo',
};

<TextMorph value={prices[cur]} />`}
        >
          <TextMorphCurrencyDemo />
        </Example>

        <Example
          title="Install command"
          description="A real-world use case — package-manager switcher. This is the same primitive that powers the install pill in this site's hero."
          code={`const [pm, setPm] = useState('pnpm');
const cmds = {
  pnpm: 'pnpm add @roy-ui/ui',
  npm:  'npm install @roy-ui/ui',
  yarn: 'yarn add @roy-ui/ui',
  bun:  'bun add @roy-ui/ui',
};

<TextMorph value={cmds[pm]} />`}
        >
          <TextMorphInstallDemo />
        </Example>
      </DocSection>

      <DocSection
        id="custom-render"
        eyebrow="03"
        title="Custom render"
        description="Pass a renderText prop to control how the in-progress string is rendered. The renderer fires on every keystroke with the current partial string — so syntax highlighting, gradient spans, or word-by-word styling stay correct mid-animation."
      >
        <Example
          title="Syntax-tinted command"
          description="First word colored as the binary, second as the subcommand, rest as the package. The colors recompute on every frame, so partial states like 'n', 'np', 'npm' are tinted correctly."
          code={`<TextMorph
  value={cmd}
  renderText={(text) => {
    const parts = text.split(' ');
    return (
      <>
        {parts.map((part, i, arr) => {
          const cls = i === 0 ? 'bin' : i === 1 ? 'sub' : 'pkg';
          return (
            <span key={i} className={cls}>
              {part}{i < arr.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </>
    );
  }}
/>`}
        >
          <TextMorphCustomRenderDemo />
        </Example>
      </DocSection>

      <DocSection
        id="behavior"
        eyebrow="04"
        title="Behavior"
        description="Things you get for free, things you can tune."
      >
        <ul className="limit-list">
          <li>
            <strong>Minimal diff.</strong> Computes the longest common prefix
            and suffix between the previous text and the new value. Only the
            differing middle is backspaced and re-typed. Shared characters
            never blink.
          </li>
          <li>
            <strong>Per-char jitter.</strong> Every keystroke picks a delay
            from the configured range. Default <code className="code-inline">[30, 60]</code>{' '}
            ms for typing, <code className="code-inline">[18, 30]</code> ms for
            backspace. No two delays match — it reads as a person typing.
          </li>
          <li>
            <strong>Harder characters take longer.</strong> The default
            pattern <code className="code-inline">/[\/{'{}'}\-_@]/</code> catches
            slashes, braces, hyphens, underscores, and at-signs — characters
            that take a real human a beat longer to reach. They get an extra{' '}
            <code className="code-inline">[30, 65]</code> ms delay.
          </li>
          <li>
            <strong>Interruptible.</strong> Change the <code className="code-inline">value</code>{' '}
            prop mid-animation and the previous animation cancels cleanly —
            the new one starts from whatever character is on screen right now.
            No queued ghost typings.
          </li>
          <li>
            <strong>Reduced-motion safe.</strong> Users with{' '}
            <code className="code-inline">prefers-reduced-motion: reduce</code>{' '}
            get an instant text swap. No animation, no jitter.
          </li>
        </ul>
      </DocSection>

      <DocSection
        id="props"
        eyebrow="05"
        title="Props"
        description="Every native span attribute is forwarded — id, style, aria-*, data-*, ref."
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
    {
      name: 'value',
      type: 'string',
      def: '—',
      desc: 'The current text. Changing this triggers the diff-type animation.',
    },
    {
      name: 'renderText',
      type: '(current: string) => ReactNode',
      def: '—',
      desc: 'Optional renderer for the in-progress text. Fires every keystroke with the partial string.',
    },
    {
      name: 'typeDelay',
      type: '[min, max]',
      def: '[30, 60]',
      desc: 'Per-character typing delay range in ms.',
    },
    {
      name: 'backspaceDelay',
      type: '[min, max]',
      def: '[18, 30]',
      desc: 'Per-character backspace delay range in ms.',
    },
    {
      name: 'hardChars',
      type: 'RegExp',
      def: '/[\\/{}\\-_@]/',
      desc: 'Characters that get an additional delay (slower to reach on a keyboard).',
    },
    {
      name: 'hardCharExtraDelay',
      type: '[min, max]',
      def: '[30, 65]',
      desc: 'Extra delay range for hard chars in ms.',
    },
    {
      name: 'pauseMs',
      type: 'number',
      def: '70',
      desc: 'Pause between the backspace phase and the typing phase.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      def: 'false',
      desc: 'Skip animation entirely and swap text instantly. Also implicit when prefers-reduced-motion is set.',
    },
    {
      name: '...rest',
      type: 'HTMLAttributes<HTMLSpanElement>',
      def: '—',
      desc: 'All native span props (className, style, aria-*, ref).',
    },
  ];
  return (
    <table className="props">
      <thead>
        <tr>
          <th style={{ width: '22%' }}>Prop</th>
          <th style={{ width: '32%' }}>Type</th>
          <th style={{ width: '14%' }}>Default</th>
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
