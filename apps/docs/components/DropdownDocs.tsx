import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';
import { ExportDropdownDemo, SelectDropdownDemo } from './demos/DropdownDemo';

export function DropdownDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. A custom, accessible listbox dropdown — keyboard-driven, themeable, with a soft pill trigger and a floating panel. No separate stylesheet."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { Dropdown } from '@roy-ui/ui';

// or just this component:
import { Dropdown } from '@roy-ui/ui/dropdown';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Two modes from one component. Give it a fixed label and it's an action menu (the trigger text never changes — selecting fires onChange). Omit the label and it's a select: the trigger shows the chosen option, or a placeholder. Open it and use Arrow keys, Home / End, type-ahead, Enter to choose, Escape to close."
      >
        <Example
          title="Action menu"
          description="A fixed label plus a leading icon. Selecting an option fires onChange (e.g. to kick off an export) without changing the trigger. Open it and hover or arrow through — the active option lights up in the accent."
          code={`<Dropdown
  label="Export as"
  icon={<DownloadIcon />}
  aria-label="Export as"
  options={[
    { label: 'Export as .pdf', value: 'pdf' },
    { label: 'Export as .csv', value: 'csv' },
    { label: 'Export as .xlsx', value: 'xlsx' },
  ]}
  onChange={(format) => exportFile(format)}
/>`}
        >
          <ExportDropdownDemo theme="auto" />
        </Example>

        <Example
          title="Select"
          description="No label, so the trigger shows the selected option (or the placeholder). fullWidth stretches it to fill a form field. The chosen option keeps a check."
          code={`const [role, setRole] = useState('');

<Dropdown
  fullWidth
  placeholder="Choose a role"
  value={role}
  onChange={setRole}
  options={[
    { label: 'Engineer', value: 'eng' },
    { label: 'Designer', value: 'design' },
    { label: 'Product', value: 'pm' },
  ]}
/>`}
        >
          <SelectDropdownDemo theme="dark" />
        </Example>
      </DocSection>

      <DocSection
        id="in-forms"
        eyebrow="03"
        title="In a Form"
        description={'The schema Form uses this Dropdown for every single-select field — set type: "select" with options and it renders here automatically (multi-select stays a native list). See the Form docs for the full schema.'}
      >
        <Code
          label="Schema field"
          code={`const fields = [
  { name: 'role', type: 'select', label: 'Role',
    placeholder: 'Choose a role',
    options: [
      { label: 'Engineer', value: 'eng' },
      { label: 'Designer', value: 'design' },
    ],
    rules: { required: true } },
];

<Form fields={fields} onSubmit={save} />`}
        />
      </DocSection>

      <DocSection
        id="theming"
        eyebrow="04"
        title="Theming"
        description="Every surface is a CSS variable. The accent is purple by default to match the reference — override --royui-dropdown-accent (and its tint) to re-brand it."
      >
        <Code
          label="Variables"
          code={`.royui-dropdown {
  --royui-dropdown-accent: #6d4afe;        /* active / selected text */
  --royui-dropdown-accent-bg: #f1ecfe;     /* active option background */
  --royui-dropdown-surface: #ffffff;       /* trigger + panel */
  --royui-dropdown-icon-bg: #1e2233;       /* leading icon circle */
  --royui-dropdown-icon-fg: #ffffff;
}`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="05"
        title="Props"
        description="options is the only required prop. Controlled with value + onChange, or uncontrolled with defaultValue."
      >
        <PropsTable
          rows={[
            { name: 'options', type: 'DropdownOption[]', def: '—', desc: 'Required. { label, value, disabled? } per row.' },
            { name: 'value', type: 'string', def: '—', desc: 'Controlled selected value.' },
            { name: 'defaultValue', type: 'string', def: '—', desc: 'Uncontrolled initial value.' },
            { name: 'onChange', type: '(value: string) => void', def: '—', desc: 'Fires when an option is chosen.' },
            { name: 'label', type: 'ReactNode', def: '—', desc: 'Fixed trigger text (menu mode). Omit for select mode.' },
            { name: 'placeholder', type: 'ReactNode', def: '—', desc: 'Trigger text in select mode when nothing is selected.' },
            { name: 'icon', type: 'ReactNode', def: '—', desc: 'Leading glyph in the trigger circle.' },
            { name: 'fullWidth', type: 'boolean', def: 'false', desc: 'Stretch the trigger to fill its container.' },
            { name: 'align', type: `'left' | 'right'`, def: `'left'`, desc: 'Which edge the panel aligns to.' },
            { name: 'invalid', type: 'boolean', def: 'false', desc: 'Recolour the trigger border for an invalid field.' },
            { name: 'disabled', type: 'boolean', def: 'false', desc: 'Dim and block interaction.' },
            { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Follow the system or force a side.' },
          ]}
        />
      </DocSection>
    </>
  );
}
