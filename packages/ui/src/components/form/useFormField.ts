'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';
import { useFormContext } from './FormContext';
import { getPath } from './paths';
import type { FieldControl, FormState } from './types';

interface Slice {
  value: unknown;
  error: string | undefined;
  touched: boolean;
  validating: boolean;
}

/**
 * Subscribe to a single field's slice of the store. The snapshot is cached and
 * returned by reference when nothing in the slice changed, so a write to one
 * field never re-renders the others — useSyncExternalStore bails out on
 * Object.is equality.
 */
export function useFormField(name: string, id: string, disabled?: boolean): FieldControl {
  const ctrl = useFormContext();
  const lastRef = useRef<Slice | null>(null);

  const getSnapshot = useCallback((): Slice => {
    const s = ctrl.store.getState();
    const next: Slice = {
      value: getPath(s.values, name),
      error: s.errors[name],
      touched: Boolean(s.touched[name]),
      validating: Boolean(s.validating[name]),
    };
    const prev = lastRef.current;
    if (
      prev &&
      Object.is(prev.value, next.value) &&
      prev.error === next.error &&
      prev.touched === next.touched &&
      prev.validating === next.validating
    ) {
      return prev;
    }
    lastRef.current = next;
    return next;
  }, [ctrl, name]);

  const slice = useSyncExternalStore(ctrl.store.subscribe, getSnapshot, getSnapshot);

  const onChange = useCallback((value: unknown) => ctrl.setValue(name, value), [ctrl, name]);
  const onBlur = useCallback(() => ctrl.setTouched(name), [ctrl, name]);

  return {
    id,
    name,
    value: slice.value,
    error: slice.error,
    touched: slice.touched,
    validating: slice.validating,
    disabled,
    onChange,
    onBlur,
  };
}

/**
 * Subscribe to a derived primitive of form state (e.g. submit state). Pass a
 * module-stable selector that returns a primitive — object selectors would
 * defeat the Object.is bail-out and re-render every change.
 */
export function useFormSelector<T>(selector: (state: FormState) => T): T {
  const ctrl = useFormContext();
  const lastRef = useRef<{ value: T } | null>(null);

  const getSnapshot = useCallback(() => {
    const next = selector(ctrl.store.getState());
    const prev = lastRef.current;
    if (prev && Object.is(prev.value, next)) return prev.value;
    lastRef.current = { value: next };
    return next;
  }, [ctrl, selector]);

  return useSyncExternalStore(ctrl.store.subscribe, getSnapshot, getSnapshot);
}
