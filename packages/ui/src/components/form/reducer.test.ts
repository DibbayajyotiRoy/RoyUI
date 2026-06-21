import { describe, it, expect } from 'vitest';
import { formReducer } from './reducer';
import type { FormState } from './types';

const base = (over: Partial<FormState> = {}): FormState => ({
  values: { a: 1 },
  errors: {},
  touched: {},
  dirty: {},
  validating: {},
  submitState: 'idle',
  submitCount: 0,
  ...over,
});

describe('formReducer', () => {
  it('SET_VALUE updates the value, clears its error, and marks dirty', () => {
    const start = base({ errors: { a: 'bad' } });
    const next = formReducer(start, { type: 'SET_VALUE', name: 'a', value: 9, dirty: true });
    expect(next.values.a).toBe(9);
    expect(next.errors.a).toBeUndefined();
    expect(next.dirty.a).toBe(true);
    expect(next).not.toBe(start);
  });

  it('SET_TOUCHED sets the flag and is a no-op when already set', () => {
    const t1 = formReducer(base(), { type: 'SET_TOUCHED', name: 'a' });
    expect(t1.touched.a).toBe(true);
    const t2 = formReducer(t1, { type: 'SET_TOUCHED', name: 'a' });
    expect(t2).toBe(t1); // unchanged ref → store skips notifying
  });

  it('SET_ERRORS replaces and MERGE_ERRORS merges', () => {
    const replaced = formReducer(base({ errors: { a: 'x' } }), {
      type: 'SET_ERRORS',
      errors: { b: 'y' },
    });
    expect(replaced.errors).toEqual({ b: 'y' });
    const merged = formReducer(base({ errors: { a: 'x' } }), {
      type: 'MERGE_ERRORS',
      errors: { b: 'y' },
    });
    expect(merged.errors).toEqual({ a: 'x', b: 'y' });
  });

  it('CLEAR_ERROR removes one error and is a no-op when absent', () => {
    const cleared = formReducer(base({ errors: { a: 'x', b: 'y' } }), {
      type: 'CLEAR_ERROR',
      name: 'a',
    });
    expect(cleared.errors).toEqual({ b: 'y' });
    const start = base();
    expect(formReducer(start, { type: 'CLEAR_ERROR', name: 'a' })).toBe(start);
  });

  it('SET_VALIDATING toggles per-field flag and prunes on clear', () => {
    const on = formReducer(base(), { type: 'SET_VALIDATING', name: 'a', validating: true });
    expect(on.validating.a).toBe(true);
    const off = formReducer(on, { type: 'SET_VALIDATING', name: 'a', validating: false });
    expect(off.validating.a).toBeUndefined();
  });

  it('TOUCH_ALL marks every named field and is a no-op when all set', () => {
    const all = formReducer(base(), { type: 'TOUCH_ALL', names: ['a', 'b'] });
    expect(all.touched).toEqual({ a: true, b: true });
    expect(formReducer(all, { type: 'TOUCH_ALL', names: ['a', 'b'] })).toBe(all);
  });

  it('SET_SUBMIT_STATE updates state and optionally increments count', () => {
    const submitting = formReducer(base(), {
      type: 'SET_SUBMIT_STATE',
      submitState: 'submitting',
      incrementCount: true,
    });
    expect(submitting.submitState).toBe('submitting');
    expect(submitting.submitCount).toBe(1);
  });

  it('RESET swaps in the given state', () => {
    const fresh = base({ values: { a: 0 } });
    expect(formReducer(base(), { type: 'RESET', state: fresh })).toBe(fresh);
  });
});
