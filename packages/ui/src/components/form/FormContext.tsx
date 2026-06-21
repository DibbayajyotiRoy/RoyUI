'use client';

import { createContext, useContext } from 'react';
import type { FormController } from './useFormStore';

/** Carries ONLY the stable controller handle (store + action callbacks), never
 *  the form state itself — so context consumers don't re-render on value
 *  changes. State is read via useSyncExternalStore against the store. */
export const FormContext = createContext<FormController | null>(null);

export function useFormContext(): FormController {
  const ctrl = useContext(FormContext);
  if (ctrl === null) {
    throw new Error('Roy UI: form hooks must be used inside a <Form>.');
  }
  return ctrl;
}
