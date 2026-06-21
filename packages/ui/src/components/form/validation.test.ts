import { describe, it, expect } from 'vitest';
import {
  checkRequired,
  checkMinLength,
  checkMaxLength,
  checkMin,
  checkMax,
  checkPattern,
  checkEmail,
  checkUrl,
  runSyncRules,
  createBuiltinResolver,
} from './validation';
import type { FormField } from './types';

describe('individual rules', () => {
  it('required treats empty string, null, false, and [] as missing', () => {
    expect(checkRequired('', true)).toBeTruthy();
    expect(checkRequired(null, true)).toBeTruthy();
    expect(checkRequired(false, true)).toBeTruthy();
    expect(checkRequired([], true)).toBeTruthy();
    expect(checkRequired('x', true)).toBeNull();
    expect(checkRequired(true, true)).toBeNull();
    expect(checkRequired(0, true)).toBeNull(); // 0 is a real value
  });

  it('required uses a custom message string', () => {
    expect(checkRequired('', 'Need it')).toBe('Need it');
  });

  it('length rules ignore empty values (required owns that)', () => {
    expect(checkMinLength('', 3)).toBeNull();
    expect(checkMinLength('ab', 3)).toBeTruthy();
    expect(checkMinLength('abc', 3)).toBeNull();
    expect(checkMaxLength('abcd', 3)).toBeTruthy();
    expect(checkMaxLength('abc', 3)).toBeNull();
  });

  it('numeric min/max', () => {
    expect(checkMin(4, 5)).toBeTruthy();
    expect(checkMin(5, 5)).toBeNull();
    expect(checkMax(6, 5)).toBeTruthy();
    expect(checkMax(5, 5)).toBeNull();
  });

  it('pattern, email, url', () => {
    expect(checkPattern('abc', /^[0-9]+$/)).toBeTruthy();
    expect(checkPattern('123', /^[0-9]+$/)).toBeNull();
    expect(checkEmail('nope', true)).toBeTruthy();
    expect(checkEmail('a@b.com', true)).toBeNull();
    expect(checkUrl('not a url', true)).toBeTruthy();
    expect(checkUrl('https://example.com', true)).toBeNull();
  });

  it('honours { value, message } overrides', () => {
    expect(checkMinLength('a', { value: 3, message: 'too short' })).toBe('too short');
    expect(checkPattern('x', { value: /\d/, message: 'digits only' })).toBe('digits only');
  });
});

describe('runSyncRules', () => {
  it('returns the first failing rule message', () => {
    const msg = runSyncRules('', { required: 'Required', minLength: 3 }, {});
    expect(msg).toBe('Required');
  });

  it('runs a custom validator with access to all values', () => {
    const rules = {
      validate: (v: unknown, values: Record<string, unknown>) =>
        v === values.confirm ? null : 'Must match',
    };
    expect(runSyncRules('a', rules, { confirm: 'a' })).toBeNull();
    expect(runSyncRules('a', rules, { confirm: 'b' })).toBe('Must match');
  });

  it('returns null when there are no rules', () => {
    expect(runSyncRules('x', undefined, {})).toBeNull();
  });
});

describe('createBuiltinResolver', () => {
  const fields: FormField[] = [
    { name: 'email', type: 'email', rules: { required: true, email: true } },
    { name: 'age', type: 'number', rules: { min: 18 } },
    { name: 'secret', type: 'hidden', rules: { required: true } },
    { name: 'bio', type: 'textarea' },
  ];
  const resolver = createBuiltinResolver(fields);

  it('collects errors across the field tree', async () => {
    const errors = await resolver({ email: '', age: 10 }, {});
    expect(errors.email).toBeTruthy();
    expect(errors.age).toBeTruthy();
    expect(errors.bio).toBeUndefined(); // no rules
  });

  it('skips hidden fields entirely', async () => {
    const errors = await resolver({ email: 'a@b.com', age: 20, secret: '' }, {});
    expect(errors.secret).toBeUndefined();
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('respects ctx.hiddenPaths', async () => {
    const errors = await resolver({ email: '', age: 20 }, { hiddenPaths: new Set(['email']) });
    expect(errors.email).toBeUndefined();
  });

  it('respects ctx.scopePaths (per-step validation)', async () => {
    const errors = await resolver({ email: '', age: 10 }, { scopePaths: new Set(['age']) });
    expect(errors.email).toBeUndefined();
    expect(errors.age).toBeTruthy();
  });
});
