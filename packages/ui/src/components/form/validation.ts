// The built-in, zero-dependency validation engine. Each rule is a pure function
// returning a message string on failure or null on pass; runSyncRules chains
// them (first failure wins); createBuiltinResolver turns a field tree into a
// FormResolver. The resolver is the ONLY interface the rest of the engine
// targets, so an external zod/yup/RHF adapter (which produces the same flat
// `path -> message` map) drops into the same slot without touching field config.

import type {
  FieldRules,
  FormErrors,
  FormField,
  FormResolver,
  FormValues,
} from './types';
import { getPath } from './paths';

type Message = string | null;

/** Empty for the purposes of `required` — covers text, arrays, and an
 *  unchecked boolean (a required checkbox must be ticked). */
function isEmpty(value: unknown): boolean {
  return (
    value == null ||
    value === '' ||
    value === false ||
    (Array.isArray(value) && value.length === 0)
  );
}

/** Length rules and bounds should not fire on an empty value — that is
 *  `required`'s job, and firing both produces noisy double errors. */
function isBlank(value: unknown): boolean {
  return value == null || value === '';
}

function num(rule: number | { value: number; message: string }): {
  value: number;
  message?: string;
} {
  return typeof rule === 'number' ? { value: rule } : rule;
}

function pat(rule: RegExp | { value: RegExp; message: string }): {
  value: RegExp;
  message?: string;
} {
  return rule instanceof RegExp ? { value: rule } : rule;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function checkRequired(value: unknown, rule: FieldRules['required']): Message {
  if (!rule) return null;
  if (!isEmpty(value)) return null;
  return typeof rule === 'string' ? rule : 'This field is required.';
}

export function checkMinLength(value: unknown, rule: FieldRules['minLength']): Message {
  if (rule == null || isBlank(value)) return null;
  const { value: min, message } = num(rule);
  const len =
    typeof value === 'string' || Array.isArray(value) ? value.length : String(value).length;
  return len >= min ? null : message ?? `Must be at least ${min} characters.`;
}

export function checkMaxLength(value: unknown, rule: FieldRules['maxLength']): Message {
  if (rule == null || isBlank(value)) return null;
  const { value: max, message } = num(rule);
  const len =
    typeof value === 'string' || Array.isArray(value) ? value.length : String(value).length;
  return len <= max ? null : message ?? `Must be at most ${max} characters.`;
}

export function checkMin(value: unknown, rule: FieldRules['min']): Message {
  if (rule == null || isBlank(value)) return null;
  const { value: min, message } = num(rule);
  const n = Number(value);
  if (Number.isNaN(n)) return null;
  return n >= min ? null : message ?? `Must be at least ${min}.`;
}

export function checkMax(value: unknown, rule: FieldRules['max']): Message {
  if (rule == null || isBlank(value)) return null;
  const { value: max, message } = num(rule);
  const n = Number(value);
  if (Number.isNaN(n)) return null;
  return n <= max ? null : message ?? `Must be at most ${max}.`;
}

export function checkPattern(value: unknown, rule: FieldRules['pattern']): Message {
  if (rule == null || isBlank(value)) return null;
  const { value: re, message } = pat(rule);
  return re.test(String(value)) ? null : message ?? 'Invalid format.';
}

export function checkEmail(value: unknown, rule: FieldRules['email']): Message {
  if (!rule || isBlank(value)) return null;
  return EMAIL_RE.test(String(value))
    ? null
    : typeof rule === 'string'
      ? rule
      : 'Enter a valid email address.';
}

export function checkUrl(value: unknown, rule: FieldRules['url']): Message {
  if (!rule || isBlank(value)) return null;
  try {
    // eslint-disable-next-line no-new
    new URL(String(value));
    return null;
  } catch {
    return typeof rule === 'string' ? rule : 'Enter a valid URL.';
  }
}

function runCustom(
  value: unknown,
  validate: FieldRules['validate'],
  values: FormValues,
): Message {
  if (!validate) return null;
  const result = validate(value, values);
  if (result === false) return 'Invalid value.';
  return typeof result === 'string' ? result : null;
}

/** Run every sync rule for one field; the first failure wins. */
export function runSyncRules(
  value: unknown,
  rules: FieldRules | undefined,
  values: FormValues,
): Message {
  if (!rules) return null;
  return (
    checkRequired(value, rules.required) ??
    checkMinLength(value, rules.minLength) ??
    checkMaxLength(value, rules.maxLength) ??
    checkMin(value, rules.min) ??
    checkMax(value, rules.max) ??
    checkEmail(value, rules.email) ??
    checkUrl(value, rules.url) ??
    checkPattern(value, rules.pattern) ??
    runCustom(value, rules.validate, values)
  );
}

/**
 * Build a FormResolver from a field tree. Walks each field, honours
 * ctx.hiddenPaths / ctx.scopePaths (no-ops until later phases populate them),
 * runs the sync rules, and returns the flat error map. This IS the seam adapter
 * for the built-in engine.
 */
export function createBuiltinResolver(fields: FormField[]): FormResolver {
  return (values, ctx) => {
    const errors: FormErrors = {};
    for (const field of fields) {
      if (field.type === 'hidden') continue;
      if (ctx.hiddenPaths?.has(field.name)) continue;
      if (ctx.scopePaths && !ctx.scopePaths.has(field.name)) continue;
      const message = runSyncRules(getPath(values, field.name), field.rules, values);
      if (message) errors[field.name] = message;
    }
    return errors;
  };
}
