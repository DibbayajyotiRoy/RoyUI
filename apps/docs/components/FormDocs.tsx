import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { PreviewTabs } from './PreviewTabs';
import {
  RegistrationFormDemo,
  SignInFormDemo,
  ValidationFormDemo,
} from './demos/FormDemo';
import type { ReactNode } from 'react';

export function FormDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. Form ships its own CSS and pulls in the controls it renders — there's no separate stylesheet, no form library, and no validation dependency to wire up."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { Form } from '@roy-ui/ui';

// or import just this component (its own 'use client' island):
import { Form } from '@roy-ui/ui/form';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="You describe the form as a fields array; Form renders the controls, validates them, lays them out in a responsive grid, and handles submission. Each field's type picks the control — text, number, textarea, select, checkbox, radio, switch. The previews run dark to read against this page; the form is theme-aware either way."
      >
        <Example
          title="Schema-driven registration"
          description="One fields array with two titled sections and a two-column grid (it collapses to one column on mobile). Validation runs once a field is touched; the submit button shows a spinner while onSubmit resolves, then the success line appears. Submit it empty to see the error summary and focus jump to the first invalid field."
          code={`import { Form } from '@roy-ui/ui';
import type { FormField, FormSection } from '@roy-ui/ui';

const fields: FormField[] = [
  { name: 'email', type: 'email', label: 'Work email', section: 'account',
    width: 'half', rules: { required: true, email: true } },
  { name: 'password', type: 'password', label: 'Password', section: 'account',
    width: 'half', rules: { required: true, minLength: 8 } },
  { name: 'tos', type: 'checkbox', label: 'I agree to the terms', section: 'account',
    rules: { required: 'You must accept the terms.' } },
  { name: 'role', type: 'select', label: 'Role', section: 'workspace', width: 'half',
    options: [{ label: 'Engineer', value: 'eng' }, { label: 'Designer', value: 'design' }],
    rules: { required: true } },
  { name: 'seats', type: 'number', label: 'Seats', section: 'workspace', width: 'half',
    min: 1, rules: { required: true, min: 1 } },
  { name: 'plan', type: 'radio', label: 'Plan', section: 'workspace', orientation: 'horizontal',
    options: [{ label: 'Starter', value: 'starter' }, { label: 'Growth', value: 'growth' }],
    rules: { required: true } },
  { name: 'bio', type: 'textarea', label: 'About your team', section: 'workspace',
    autoGrow: true, maxLength: 160, showCount: true },
  { name: 'notifications', type: 'switch', label: 'Email me product updates', section: 'workspace' },
];

const sections: FormSection[] = [
  { id: 'account', title: 'Account', description: 'How you sign in.' },
  { id: 'workspace', title: 'Workspace', description: 'Set up your team.' },
];

<Form
  columns={2}
  fields={fields}
  sections={sections}
  submitLabel="Create account"
  successMessage="Account created — check your inbox."
  onSubmit={async (values) => { await api.register(values); }}
/>`}
        >
          <RegistrationFormDemo theme="dark" />
        </Example>

        <Example
          title="The minimum"
          description="No sections, no grid — three fields and a submit. validateMode defaults to onTouched, so a field validates after you leave it and then re-checks as you type."
          code={`const fields = [
  { name: 'email', type: 'email', label: 'Email', rules: { required: true, email: true } },
  { name: 'password', type: 'password', label: 'Password', rules: { required: true } },
  { name: 'remember', type: 'checkbox', label: 'Keep me signed in' },
];

<Form fields={fields} submitLabel="Sign in" onSubmit={signIn} />`}
        >
          <SignInFormDemo theme="dark" />
        </Example>

        <Example
          title="Validate on submit"
          description={'Set validateMode="onSubmit" to hold all errors until the form is submitted. A blocked submit marks every field touched, renders the error summary, and moves focus to the first invalid field — each summary line jumps to its field.'}
          code={`<Form
  fields={fields}
  validateMode="onSubmit"
  submitLabel="Submit"
  onSubmit={save}
/>`}
        >
          <ValidationFormDemo theme="dark" />
        </Example>
      </DocSection>

      <DocSection
        id="validation"
        eyebrow="03"
        title="Validation"
        description="Each field carries a rules object: required, min / max, minLength / maxLength, pattern, email, url, and a custom validate function with access to every value (for cross-field checks). The built-in engine is the default; pass a resolver to swap it for an external schema later — same path → message contract, so field config never changes."
      >
        <Code
          label="Rules + cross-field validate"
          code={`const fields = [
  { name: 'password', type: 'password', label: 'Password',
    rules: { required: true, minLength: 8 } },
  { name: 'confirm', type: 'password', label: 'Confirm password',
    rules: {
      required: true,
      validate: (value, values) =>
        value === values.password ? null : 'Passwords must match',
    } },
];`}
        />
        <Code
          label="Swap the engine later (the resolver seam)"
          code={`// Built-in today — drop in a schema validator tomorrow with no field changes:
// import { zodResolver } from 'your-adapter';
// <Form fields={fields} resolver={zodResolver(schema)} onSubmit={save} />

// A resolver is just: (values, ctx) => Record<fieldName, message>
const upperEmail: FormResolver = (values) =>
  /[A-Z]/.test(String(values.email)) ? { email: 'Use lowercase' } : {};

<Form fields={fields} resolver={upperEmail} onSubmit={save} />`}
        />
      </DocSection>

      <DocSection
        id="architecture"
        eyebrow="04"
        title="How it renders"
        description="Form is a thin schema layer over a headless core: an external store plus per-field subscriptions. Typing in one field updates the store and only that field re-renders — the rest of the form, including sibling fields, stays put. That keeps large forms responsive without a state library. Server errors map back by field name through the submit helpers."
      >
        <Code
          label="Server-side errors"
          code={`<Form
  fields={fields}
  onSubmit={async (values, helpers) => {
    const res = await api.register(values);
    if (res.error) {
      // Map server validation back onto fields by name:
      helpers.setErrors({ email: 'That email is already registered' });
    }
  }}
/>`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="05"
        title="Props"
        description="fields and onSubmit are required. Everything else is optional. The field config types (FormField, FieldRules, FormSection, FormResolver) are exported for typed schemas."
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
    { name: 'fields', type: 'FormField[]', def: '—', desc: 'Required. The field config — name, type, label, width, section, rules, and per-type options.' },
    { name: 'onSubmit', type: '(values, helpers) => void | Promise', def: '—', desc: 'Required. Called with clean values once validation passes. helpers carry setErrors / setError / reset / setSubmitState.' },
    { name: 'sections', type: 'FormSection[]', def: '—', desc: 'Titled groups; fields opt in via field.section. Fields with no section render first.' },
    { name: 'defaultValues', type: 'Record<string, unknown>', def: '—', desc: 'Seed values; wins over each field’s defaultValue.' },
    { name: 'values', type: 'Record<string, unknown>', def: '—', desc: 'Controlled mode: parent owns the values; pair with onChange.' },
    { name: 'onChange', type: '(values, { name }) => void', def: '—', desc: 'Fires on every field change with the full values object.' },
    { name: 'resolver', type: 'FormResolver', def: 'built-in', desc: 'Swap the validation engine. (values, ctx) => Record<name, message>, sync or async.' },
    { name: 'validateMode', type: `'onChange' | 'onBlur' | 'onSubmit' | 'onTouched'`, def: `'onTouched'`, desc: 'When validation first runs for a field.' },
    { name: 'reValidateMode', type: `'onChange' | 'onBlur'`, def: `'onChange'`, desc: 'When a field re-checks after its first error.' },
    { name: 'onInvalid', type: '(errors) => void', def: '—', desc: 'Called with the error map when a submit is blocked.' },
    { name: 'submitLabel', type: 'ReactNode', def: `'Submit'`, desc: 'Submit button label.' },
    { name: 'successMessage', type: 'ReactNode', def: '—', desc: 'Shown after a successful submit.' },
    { name: 'errorMessage', type: 'ReactNode', def: '—', desc: 'Shown if onSubmit throws.' },
    { name: 'columns', type: '1 | 2 | 3', def: '1', desc: 'Base grid columns (sets the default field width). Collapses to one column on mobile.' },
    { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Follow the system (default) or force the built-in light / dark tokens.' },
    { name: 'className', type: 'string', def: '—', desc: 'Extra classes on the <form>. ref forwards to the form element.' },
  ];
  return (
    <table className="props">
      <thead>
        <tr>
          <th style={{ width: '20%' }}>Prop</th>
          <th style={{ width: '30%' }}>Type</th>
          <th style={{ width: '12%' }}>Default</th>
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
