import { Input } from '@roy-ui/ui';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { PreviewTabs } from './PreviewTabs';
import {
  AtIcon,
  LockIcon,
  SearchIcon,
  UserIcon,
  InputEmailDemo,
  InputAvailabilityDemo,
} from './demos/InputDemo';
import type { ReactNode } from 'react';

export function InputDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package to your project. The field ships its own CSS and draws its own icons, label motion, and underline — there's no separate stylesheet and no animation library to wire up."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { Input } from '@roy-ui/ui';

// or import just this component (its own 'use client' island):
import { Input } from '@roy-ui/ui/input';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="At its smallest the field is just a label. Add an icon, a helper line, a placeholder hint, or validation state as you need them — every native input attribute (type, value, onChange, required, name, autoComplete…) spreads straight onto the input, so this one component covers email, username, password, and search. The previews run dark to read against this page; the field is theme-aware either way."
      >
        <Example
          title="Live email field"
          description="The full thing, wired up. The label lifts and recolours as you focus, the underline draws in from the left, and the @ pops as the cursor lands. Type a valid address and a check strokes in; leave a bad one and it shakes once, then turns red. Try it — focus the field and type."
          code={`function Field() {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const valid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
  const showError = touched && value.length > 0 && !valid;

  return (
    <Input
      type="email"
      label="Email address"
      icon={<AtIcon />}
      placeholder="you@company.com"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => setTouched(true)}
      error={showError ? 'Enter a valid email address' : false}
      success={valid}
      helperText="We'll only use this to send your receipt."
    />
  );
}`}
        >
          <InputEmailDemo theme="dark" />
        </Example>

        <Example
          title="Availability check"
          description="The async use case — is this username taken? Pass loading while a live check is in flight and a spinner turns at the trailing edge; resolve it to success (green, available) or error (red, taken). This demo debounces a fake lookup; swap the timeout for a real fetch and the states are identical. Type at least three characters — try 'roy' or 'admin' for a taken name."
          code={`const TAKEN = ['admin', 'roy', 'support'];

function Username() {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('idle'); // idle | checking | available | taken
  const timer = useRef();

  function onChange(next) {
    setValue(next);
    clearTimeout(timer.current);
    const handle = next.trim().toLowerCase();
    if (handle.length < 3) return setStatus('idle');
    setStatus('checking');
    timer.current = setTimeout(() => {
      setStatus(TAKEN.includes(handle) ? 'taken' : 'available');
    }, 750);
  }

  return (
    <Input
      label="Username"
      icon={<UserIcon />}
      placeholder="your_handle"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      loading={status === 'checking'}
      success={status === 'available' ? \`\${value} is available\` : false}
      error={status === 'taken' ? \`\${value} is already taken\` : false}
      helperText={status === 'idle' ? 'Pick a handle — at least 3 characters.'
        : status === 'checking' ? 'Checking availability…' : undefined}
    />
  );
}`}
        >
          <InputAvailabilityDemo theme="dark" />
        </Example>

        <Example
          title="Password and search"
          description={`Same component, different native type. Pass type="password" with a lock for a credential field, or type="search" with a magnifier — the floating label and motion are identical, only the icon and the keyboard behaviour change.`}
          code={`<Input type="password" label="Password" icon={<LockIcon />} />

<Input type="search" label="Search" icon={<SearchIcon />} placeholder="Search orders…" />`}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
            <div style={{ width: 280 }}>
              <Input
                theme="dark"
                type="password"
                label="Password"
                icon={<LockIcon />}
                helperText="At least 8 characters."
              />
            </div>
            <div style={{ width: 280 }}>
              <Input
                theme="dark"
                type="search"
                label="Search"
                icon={<SearchIcon />}
                placeholder="Search orders…"
              />
            </div>
          </div>
        </Example>

        <Example
          title="Just a label"
          description="No icon, no helper — the label rests flush-left over the input and floats straight up on focus. This is the whole component when you strip it back."
          code={`<Input label="Full name" />`}
        >
          <div style={{ width: 320 }}>
            <Input theme="dark" label="Full name" />
          </div>
        </Example>

        <Example
          title="Placeholder hint"
          description="A placeholder never collides with the label — it's held invisible until the label floats up on focus, then fades in as a faint example. Focus this field to see the hint appear."
          code={`<Input
  label="Email address"
  icon={<AtIcon />}
  placeholder="you@company.com"
/>`}
        >
          <div style={{ width: 320 }}>
            <Input
              theme="dark"
              label="Email address"
              icon={<AtIcon />}
              placeholder="you@company.com"
            />
          </div>
        </Example>

        <Example
          title="Error and success"
          description={`Pass a string to error or success and it both recolours the field and becomes the helper line — red with a shake on entry, green with a check that draws itself in. A boolean keeps your helperText and only recolours. Error always outranks success.`}
          code={`<Input
  label="Email address"
  icon={<AtIcon />}
  defaultValue="not-an-email"
  error="Enter a valid email address"
/>

<Input
  label="Email address"
  icon={<AtIcon />}
  defaultValue="hi@royui.dev"
  success="Looks good"
/>`}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
            <div style={{ width: 280 }}>
              <Input
                theme="dark"
                label="Email address"
                icon={<AtIcon />}
                defaultValue="not-an-email"
                error="Enter a valid email address"
              />
            </div>
            <div style={{ width: 280 }}>
              <Input
                theme="dark"
                label="Email address"
                icon={<AtIcon />}
                defaultValue="hi@royui.dev"
                success="Looks good"
              />
            </div>
          </div>
        </Example>

        <Example
          title="Disabled"
          description="The disabled attribute dims the whole field and blocks interaction — it spreads through like any other native input prop."
          code={`<Input label="Email address" icon={<AtIcon />} disabled />`}
        >
          <div style={{ width: 320 }}>
            <Input theme="dark" label="Email address" icon={<AtIcon />} disabled />
          </div>
        </Example>

        <Example
          title="Light and dark"
          description={`By default the field follows the system (theme="auto"), so it inherits your site's mode. It ships its own light and dark tokens — no Tailwind, no theme provider. Force either side with theme="light" or theme="dark".`}
          code={`// default — follows the system / your site theme
<Input label="Email address" icon={<AtIcon />} />

// force one side
<Input theme="light" label="Email address" icon={<AtIcon />} />
<Input theme="dark" label="Email address" icon={<AtIcon />} />`}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
            <div
              style={{
                width: 280,
                padding: '8px 20px 20px',
                borderRadius: 14,
                background: '#ffffff',
              }}
            >
              <Input
                theme="light"
                label="Email address"
                icon={<AtIcon />}
                placeholder="you@company.com"
                helperText="Helper text goes here"
              />
            </div>
            <div
              style={{
                width: 280,
                padding: '8px 20px 20px',
                borderRadius: 14,
                background: '#161617',
              }}
            >
              <Input
                theme="dark"
                label="Email address"
                icon={<AtIcon />}
                placeholder="you@company.com"
                helperText="Helper text goes here"
              />
            </div>
          </div>
        </Example>
      </DocSection>

      <DocSection
        id="theming"
        eyebrow="03"
        title="Theming"
        description={`The field exposes its ink, accent, line, and state colours as CSS variables. Override them inline or in a stylesheet — it already ships a prefers-color-scheme: dark theme, and theme="dark" forces it.`}
      >
        <Code
          label="Variables"
          code={`.royui-input {
  --royui-input-fg: #0f172a;           /* what the user types */
  --royui-input-label: #98a2b3;        /* resting label + focus hint */
  --royui-input-label-filled: #475467; /* floated, blurred, has a value */
  --royui-input-faint: #667085;        /* helper text + spinner */
  --royui-input-icon: #98a2b3;         /* leading glyph at rest */
  --royui-input-line-rest: #d0d5dd;    /* the always-there hairline */
  --royui-input-accent: #2575f0;       /* focus: label, icon, the line */
  --royui-input-error: #d92d20;
  --royui-input-success: #15a34a;
  --royui-input-font: 16px;
}`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="04"
        title="Props"
        description="label is the only required prop. Every other native input attribute — type, value, onChange, required, name, autoComplete, disabled — spreads onto the underlying <input>; className lands on the wrapper, and the ref forwards to the input."
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

function Example({
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
    { name: 'label', type: 'string', def: '—', desc: 'Required. Rests over the field and lifts on focus / when filled.' },
    { name: 'icon', type: 'ReactNode', def: '—', desc: 'Leading glyph in a fixed 20px slot. Greyed at rest, tints to the accent on focus.' },
    { name: 'helperText', type: 'ReactNode', def: '—', desc: 'Quiet line beneath the field. Replaced by an error / success string.' },
    { name: 'placeholder', type: 'string', def: '—', desc: 'Faint hint revealed only once the label floats up — never doubled with the label.' },
    { name: 'error', type: 'boolean | string', def: 'false', desc: 'Error state. A string becomes the helper line; the field shakes once and turns red.' },
    { name: 'success', type: 'boolean | string', def: 'false', desc: 'Success state (outranked by error). A string becomes the helper line; a check draws in.' },
    { name: 'loading', type: 'boolean', def: 'false', desc: 'Async-pending state. Spins a glyph at the trailing edge — for live checks like availability.' },
    { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Follow the system (default), or force the built-in light or dark tokens.' },
    { name: 'disabled', type: 'boolean', def: 'false', desc: 'Native — dims the field and blocks interaction. Spreads onto the input.' },
    { name: 'className', type: 'string', def: '—', desc: 'Extra classes on the wrapper. Other native input attributes spread onto the input.' },
    { name: 'ref', type: 'Ref<HTMLInputElement>', def: '—', desc: 'Forwarded to the underlying <input>.' },
  ];
  return (
    <table className="props">
      <thead>
        <tr>
          <th style={{ width: '22%' }}>Prop</th>
          <th style={{ width: '26%' }}>Type</th>
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
