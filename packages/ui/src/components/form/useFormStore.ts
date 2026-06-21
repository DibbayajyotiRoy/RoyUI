'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type FormEvent,
  type MutableRefObject,
} from 'react';
import { createStore, type Store } from './store';
import { formReducer, type FormAction } from './reducer';
import { createBuiltinResolver, runSyncRules } from './validation';
import { getPath } from './paths';
import type {
  FormErrors,
  FormField,
  FormProps,
  FormState,
  FormValues,
  SubmitHelpers,
} from './types';

/** The stable handle stored in context. Every member is reference-stable for
 *  the life of the form, so the context value never churns. */
export interface FormController {
  store: Store<FormState>;
  formRef: MutableRefObject<HTMLFormElement | null>;
  setValue: (name: string, value: unknown) => void;
  setTouched: (name: string) => void;
  validateField: (name: string) => void;
  handleSubmit: (event?: FormEvent) => void;
  reset: (next?: FormValues) => void;
}

// Dev-only diagnostics. Read NODE_ENV off globalThis so the bare `process`
// global isn't referenced (the package ships without @types/node) and so it
// stays safe in the browser, where `process` may be absent.
const isDev =
  (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV ===
  'development';

/** The empty value a field starts at when no default is given. */
function emptyForType(field: FormField): unknown {
  switch (field.type) {
    case 'checkbox':
    case 'switch':
      return false;
    case 'number':
      return '';
    case 'select':
      return field.multiple ? [] : '';
    default:
      return '';
  }
}

function buildInitial(props: FormProps): FormState {
  const values: FormValues = {};
  for (const field of props.fields) {
    // Priority: controlled value > defaultValues > per-field default > typed empty.
    let v: unknown = props.values?.[field.name];
    if (v === undefined) v = props.defaultValues?.[field.name];
    if (v === undefined) v = (field as { defaultValue?: unknown }).defaultValue;
    if (v === undefined) v = emptyForType(field);
    values[field.name] = v;
  }
  return {
    values,
    errors: {},
    touched: {},
    dirty: {},
    validating: {},
    submitState: 'idle',
    submitCount: 0,
  };
}

function shallowEqualValues(a: FormValues, b: FormValues): boolean {
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (!Object.is(a[k], b[k])) return false;
  return true;
}

function attrEscape(value: string): string {
  return value.replace(/(["\\])/g, '\\$1');
}

/** Focus + scroll to the first field (in declaration order) that has an error. */
function focusFirstInvalid(
  formEl: HTMLFormElement | null,
  fields: FormField[],
  errors: FormErrors,
): void {
  if (!formEl) return;
  const firstName = fields.map((f) => f.name).find((n) => n in errors);
  if (!firstName) return;
  const wrapper = formEl.querySelector<HTMLElement>(
    `[data-royui-field="${attrEscape(firstName)}"]`,
  );
  if (!wrapper) return;
  const focusable = wrapper.querySelector<HTMLElement>(
    'input, select, textarea, button, [tabindex]:not([tabindex="-1"])',
  );
  (focusable ?? wrapper).scrollIntoView({ block: 'center', behavior: 'smooth' });
  focusable?.focus();
}

export function useFormStore(props: FormProps): FormController {
  const propsRef = useRef(props);
  propsRef.current = props;

  // Store + initial snapshot built exactly once.
  const storeRef = useRef<Store<FormState> | null>(null);
  const initialRef = useRef<FormState | null>(null);
  if (storeRef.current === null) {
    const initial = buildInitial(props);
    initialRef.current = initial;
    storeRef.current = createStore(initial);
  }
  const store = storeRef.current;
  const formRef = useRef<HTMLFormElement | null>(null);

  // Built-in resolver unless the caller supplies one (the seam).
  const resolver = useMemo(
    () => props.resolver ?? createBuiltinResolver(props.fields),
    [props.resolver, props.fields],
  );
  const resolverRef = useRef(resolver);
  resolverRef.current = resolver;

  const dispatch = useCallback(
    (action: FormAction) => {
      store.setState(formReducer(store.getState(), action));
    },
    [store],
  );

  const validateField = useCallback(
    (name: string) => {
      const field = propsRef.current.fields.find((f) => f.name === name);
      if (!field || field.type === 'hidden') return;
      const state = store.getState();
      const message = runSyncRules(getPath(state.values, name), field.rules, state.values);
      if (message) dispatch({ type: 'MERGE_ERRORS', errors: { [name]: message } });
      else dispatch({ type: 'CLEAR_ERROR', name });
    },
    [store, dispatch],
  );

  const setValue = useCallback(
    (name: string, value: unknown) => {
      const hadError = name in store.getState().errors;
      const initialValue = getPath(initialRef.current!.values, name);
      dispatch({ type: 'SET_VALUE', name, value, dirty: !Object.is(value, initialValue) });

      const next = store.getState();
      propsRef.current.onChange?.(next.values, { name });

      const mode = propsRef.current.validateMode ?? 'onTouched';
      const reMode = propsRef.current.reValidateMode ?? 'onChange';
      const shouldValidate =
        mode === 'onChange' ||
        (mode === 'onTouched' && Boolean(next.touched[name])) ||
        (hadError && reMode === 'onChange');
      if (shouldValidate) validateField(name);
    },
    [store, dispatch, validateField],
  );

  const setTouched = useCallback(
    (name: string) => {
      const hadError = name in store.getState().errors;
      dispatch({ type: 'SET_TOUCHED', name });
      const mode = propsRef.current.validateMode ?? 'onTouched';
      const reMode = propsRef.current.reValidateMode ?? 'onChange';
      const shouldValidate =
        mode === 'onBlur' || mode === 'onTouched' || (hadError && reMode === 'onBlur');
      if (shouldValidate) validateField(name);
    },
    [store, dispatch, validateField],
  );

  const reset = useCallback(
    (nextValues?: FormValues) => {
      const base = initialRef.current!;
      store.setState({
        values: nextValues ?? base.values,
        errors: {},
        touched: {},
        dirty: {},
        validating: {},
        submitState: 'idle',
        submitCount: 0,
      });
    },
    [store],
  );

  const handleSubmit = useCallback(
    async (event?: FormEvent) => {
      event?.preventDefault();
      const p = propsRef.current;
      dispatch({ type: 'SET_SUBMIT_STATE', submitState: 'submitting', incrementCount: true });

      const values = store.getState().values;
      let errors: FormErrors;
      try {
        errors = await Promise.resolve(resolverRef.current(values, {}));
      } catch {
        dispatch({ type: 'SET_SUBMIT_STATE', submitState: 'error' });
        return;
      }

      if (Object.keys(errors).length > 0) {
        dispatch({ type: 'SET_ERRORS', errors });
        dispatch({ type: 'TOUCH_ALL', names: p.fields.map((f) => f.name) });
        dispatch({ type: 'SET_SUBMIT_STATE', submitState: 'idle' });
        p.onInvalid?.(errors);
        focusFirstInvalid(formRef.current, p.fields, errors);
        return;
      }

      const helpers: SubmitHelpers = {
        setErrors: (errs) => dispatch({ type: 'SET_ERRORS', errors: errs }),
        setError: (name, message) =>
          dispatch({ type: 'MERGE_ERRORS', errors: { [name]: message } }),
        reset,
        setSubmitState: (s) => dispatch({ type: 'SET_SUBMIT_STATE', submitState: s }),
      };

      try {
        await p.onSubmit(values, helpers);
        dispatch({ type: 'SET_SUBMIT_STATE', submitState: 'success' });
      } catch {
        dispatch({ type: 'SET_SUBMIT_STATE', submitState: 'error' });
      }
    },
    [store, dispatch, reset],
  );

  // Controlled reconcile + a dev warning if the form flips controlled-ness.
  const wasControlled = useRef(props.values !== undefined);
  useEffect(() => {
    const isControlled = props.values !== undefined;
    if (isDev && isControlled !== wasControlled.current) {
      // eslint-disable-next-line no-console
      console.warn(
        'Roy UI <Form>: do not switch between controlled (`values`) and ' +
          'uncontrolled in the same form — pick one for the form\'s lifetime.',
      );
    }
    wasControlled.current = isControlled;
    if (props.values) {
      const cur = store.getState();
      if (!shallowEqualValues(cur.values, props.values)) {
        store.setState({ ...cur, values: props.values });
      }
    }
  }, [props.values, store]);

  // Every member is stable, so the controller identity never changes.
  return useMemo<FormController>(
    () => ({ store, formRef, setValue, setTouched, validateField, handleSubmit, reset }),
    [store, setValue, setTouched, validateField, handleSubmit, reset],
  );
}
