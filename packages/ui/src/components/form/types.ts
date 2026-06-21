import type { ReactNode } from 'react';

// ── Values, errors, and the resolver seam ─────────────────────────────────
// Values are stored as a (possibly nested) object addressed by dot/bracket
// paths — flat for Phase 1 fields, array-ready for later phases. Errors are a
// flat map keyed by the same path strings, which is exactly the shape a future
// zod/yup/RHF adapter produces, so the engine can be swapped without touching
// field config.

export type FormValues = Record<string, unknown>;
export type FormErrors = Record<string, string>;

/** Context handed to every resolver. The two sets are wired in later phases
 *  (hidden = conditional fields; scope = the current wizard step) but are part
 *  of the contract now so the seam never has to change shape. */
export interface ResolverContext {
  /** Paths currently hidden by a condition — skip validating these. (Phase 2) */
  hiddenPaths?: ReadonlySet<string>;
  /** When set, only these paths are in scope (per-step validation). (Phase 3) */
  scopePaths?: ReadonlySet<string>;
}

/** THE SEAM. Built-in validation is implemented as one of these; an external
 *  schema validator produces the same `path -> message` map. Sync or async. */
export type FormResolver = (
  values: FormValues,
  ctx: ResolverContext,
) => FormErrors | Promise<FormErrors>;

// ── Per-field validation rules (consumed by the built-in resolver only) ────

/** A rule that can be given bare or as `{ value, message }` for a custom copy. */
type Constrained<T> = T | { value: T; message: string };

export interface FieldRules {
  /** Non-empty (and, for booleans, must be true). String overrides the message. */
  required?: boolean | string;
  /** Numeric lower / upper bound. */
  min?: Constrained<number>;
  max?: Constrained<number>;
  /** String / array length bounds. */
  minLength?: Constrained<number>;
  maxLength?: Constrained<number>;
  /** Regex the value must match. */
  pattern?: RegExp | { value: RegExp; message: string };
  /** Shorthand validators. String overrides the message. */
  email?: boolean | string;
  url?: boolean | string;
  /** Custom sync check. Return a message (or `false`) to fail, `null`/`true` to pass. */
  validate?: (value: unknown, values: FormValues) => string | boolean | null | undefined;
}

// ── Field config (discriminated union by `type`) ───────────────────────────

export type FieldWidth = 'full' | 'half' | 'third';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface FieldBase {
  /** Unique key; also the value path (dot/bracket notation supported). */
  name: string;
  /** Visible label. Most controls require one for accessibility. */
  label?: string;
  /** Quiet line beneath the control. An error replaces it. */
  helperText?: ReactNode;
  placeholder?: string;
  /** Grid span within its row. Defaults to 'full'. */
  width?: FieldWidth;
  /** Id of the `FormSection` this field belongs to. */
  section?: string;
  disabled?: boolean;
  rules?: FieldRules;
}

export interface TextField extends FieldBase {
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  defaultValue?: string;
  /** Leading glyph forwarded to the underlying Input. */
  icon?: ReactNode;
}

export interface HiddenField extends FieldBase {
  type: 'hidden';
  defaultValue?: string;
}

export interface NumberField extends FieldBase {
  type: 'number';
  defaultValue?: number | '';
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}

export interface TextareaField extends FieldBase {
  type: 'textarea';
  defaultValue?: string;
  rows?: number;
  autoGrow?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export interface SelectField extends FieldBase {
  type: 'select';
  options: SelectOption[];
  /** When true the value is `string[]` and the control allows multiple. */
  multiple?: boolean;
  defaultValue?: string | string[];
}

export interface CheckboxField extends FieldBase {
  type: 'checkbox';
  defaultValue?: boolean;
}

export interface SwitchField extends FieldBase {
  type: 'switch';
  defaultValue?: boolean;
}

export interface RadioField extends FieldBase {
  type: 'radio';
  options: SelectOption[];
  orientation?: 'vertical' | 'horizontal';
  defaultValue?: string;
}

export interface CustomField extends FieldBase {
  type: 'custom';
  defaultValue?: unknown;
  /** Caller renders the control against the controlled-field contract. */
  render: (control: FieldControl) => ReactNode;
}

export type FormField =
  | TextField
  | HiddenField
  | NumberField
  | TextareaField
  | SelectField
  | CheckboxField
  | SwitchField
  | RadioField
  | CustomField;

/** The controlled contract every control is wired against. */
export interface FieldControl {
  id: string;
  name: string;
  value: unknown;
  error?: string;
  touched: boolean;
  validating: boolean;
  disabled?: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
}

// ── Layout, submission, and the public Form props ──────────────────────────

export interface FormSection {
  id: string;
  title?: string;
  description?: ReactNode;
}

export type SubmitState = 'idle' | 'submitting' | 'success' | 'error';
export type ValidateMode = 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched';

export interface SubmitHelpers {
  /** Replace the whole error map (e.g. server-side field errors). */
  setErrors: (errors: FormErrors) => void;
  /** Set one field's error by path. */
  setError: (name: string, message: string) => void;
  /** Reset to initial (or to `next`). */
  reset: (next?: FormValues) => void;
  /** Drive the submit state directly (e.g. back to 'idle' after a toast). */
  setSubmitState: (state: SubmitState) => void;
}

/** The store's single state object. */
export interface FormState {
  values: FormValues;
  errors: FormErrors;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  validating: Record<string, boolean>;
  submitState: SubmitState;
  submitCount: number;
}

export interface FormProps {
  /** Field config. The schema-driven heart of the form. */
  fields: FormField[];
  /** Optional titled groups; fields opt in via `field.section`. */
  sections?: FormSection[];
  /** Seed values. Wins over per-field `defaultValue`. */
  defaultValues?: FormValues;
  /** Controlled mode: parent owns values; pair with `onChange`. */
  values?: FormValues;
  onChange?: (values: FormValues, meta: { name: string }) => void;
  /** Swap the validation engine. Omit to use the built-in resolver. */
  resolver?: FormResolver;
  /** When validation first runs. Default 'onTouched'. */
  validateMode?: ValidateMode;
  /** When a field re-validates after its first error. Default 'onChange'. */
  reValidateMode?: 'onChange' | 'onBlur';
  /** Called with the clean values once validation passes. */
  onSubmit: (values: FormValues, helpers: SubmitHelpers) => void | Promise<void>;
  /** Called with the error map when a submit is blocked. */
  onInvalid?: (errors: FormErrors) => void;
  submitLabel?: ReactNode;
  successMessage?: ReactNode;
  errorMessage?: ReactNode;
  /** Base grid columns; collapses to one column on mobile. Default 1. */
  columns?: 1 | 2 | 3;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  id?: string;
}
