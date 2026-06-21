'use client';

import { Form } from '@roy-ui/ui';
import type { FormField, FormSection } from '@roy-ui/ui';

type Theme = 'light' | 'dark' | 'auto';

const registrationFields: FormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Work email',
    section: 'account',
    width: 'half',
    placeholder: 'you@company.com',
    rules: { required: true, email: true },
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    section: 'account',
    width: 'half',
    rules: { required: true, minLength: 8 },
  },
  {
    name: 'tos',
    type: 'checkbox',
    label: 'I agree to the terms of service',
    section: 'account',
    rules: { required: 'You must accept the terms.' },
  },
  {
    name: 'role',
    type: 'select',
    label: 'Role',
    section: 'workspace',
    width: 'half',
    placeholder: 'Choose a role',
    options: [
      { label: 'Engineer', value: 'eng' },
      { label: 'Designer', value: 'design' },
      { label: 'Product', value: 'pm' },
    ],
    rules: { required: true },
  },
  {
    name: 'seats',
    type: 'number',
    label: 'Seats',
    section: 'workspace',
    width: 'half',
    min: 1,
    max: 200,
    rules: { required: true, min: 1 },
  },
  {
    name: 'plan',
    type: 'radio',
    label: 'Plan',
    section: 'workspace',
    orientation: 'horizontal',
    options: [
      { label: 'Starter', value: 'starter' },
      { label: 'Growth', value: 'growth' },
      { label: 'Scale', value: 'scale' },
    ],
    rules: { required: true },
  },
  {
    name: 'bio',
    type: 'textarea',
    label: 'About your team',
    section: 'workspace',
    autoGrow: true,
    maxLength: 160,
    showCount: true,
  },
  {
    name: 'notifications',
    type: 'switch',
    label: 'Email me product updates',
    section: 'workspace',
  },
];

const registrationSections: FormSection[] = [
  { id: 'account', title: 'Account', description: 'How you sign in.' },
  { id: 'workspace', title: 'Workspace', description: 'Set up your team.' },
];

export function RegistrationFormDemo({ theme = 'dark' }: { theme?: Theme }) {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Form
        theme={theme}
        columns={2}
        fields={registrationFields}
        sections={registrationSections}
        submitLabel="Create account"
        successMessage="Account created — check your inbox."
        validateMode="onTouched"
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 700));
          // eslint-disable-next-line no-console
          console.log('submit', values);
        }}
      />
    </div>
  );
}

const signInFields: FormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'you@company.com',
    rules: { required: true, email: true },
  },
  { name: 'password', type: 'password', label: 'Password', rules: { required: true } },
  { name: 'remember', type: 'checkbox', label: 'Keep me signed in' },
];

export function SignInFormDemo({ theme = 'dark' }: { theme?: Theme }) {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Form
        theme={theme}
        fields={signInFields}
        submitLabel="Sign in"
        successMessage="Signed in."
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 600));
        }}
      />
    </div>
  );
}

// Validation-on-submit: empty fields block the submit and surface an error
// summary + per-field messages with focus moved to the first invalid field.
const validationFields: FormField[] = [
  { name: 'name', type: 'text', label: 'Full name', rules: { required: true } },
  { name: 'email', type: 'email', label: 'Email', rules: { required: true, email: true } },
  {
    name: 'age',
    type: 'number',
    label: 'Age',
    min: 18,
    rules: { required: true, min: { value: 18, message: 'Must be 18 or older.' } },
  },
];

export function ValidationFormDemo({ theme = 'dark' }: { theme?: Theme }) {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Form
        theme={theme}
        fields={validationFields}
        submitLabel="Submit"
        validateMode="onSubmit"
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 500));
        }}
      />
    </div>
  );
}
