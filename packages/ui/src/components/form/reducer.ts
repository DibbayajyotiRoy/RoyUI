// Pure state transitions for the form store. No React, no side effects — every
// action maps (state, action) -> state and returns the SAME reference for
// no-ops so the store can skip notifying listeners. Kept pure so it can be unit
// tested directly.

import type { FormErrors, FormState, SubmitState } from './types';
import { setPath } from './paths';

export type FormAction =
  | { type: 'SET_VALUE'; name: string; value: unknown; dirty: boolean }
  | { type: 'SET_TOUCHED'; name: string; touched?: boolean }
  | { type: 'SET_ERRORS'; errors: FormErrors }
  | { type: 'MERGE_ERRORS'; errors: FormErrors }
  | { type: 'CLEAR_ERROR'; name: string }
  | { type: 'SET_VALIDATING'; name: string; validating: boolean }
  | { type: 'TOUCH_ALL'; names: string[] }
  | { type: 'SET_SUBMIT_STATE'; submitState: SubmitState; incrementCount?: boolean }
  | { type: 'RESET'; state: FormState };

function omit(map: Record<string, string>, key: string): Record<string, string> {
  if (!(key in map)) return map;
  const { [key]: _removed, ...rest } = map;
  return rest;
}

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_VALUE': {
      const values = setPath(state.values, action.name, action.value);
      // Editing a field clears its standing error; it re-validates per the mode.
      const errors = omit(state.errors, action.name);
      const dirty =
        state.dirty[action.name] === action.dirty
          ? state.dirty
          : { ...state.dirty, [action.name]: action.dirty };
      return { ...state, values, errors, dirty };
    }

    case 'SET_TOUCHED': {
      const touched = action.touched ?? true;
      if (Boolean(state.touched[action.name]) === touched) return state;
      return { ...state, touched: { ...state.touched, [action.name]: touched } };
    }

    case 'SET_ERRORS':
      return { ...state, errors: action.errors };

    case 'MERGE_ERRORS':
      return { ...state, errors: { ...state.errors, ...action.errors } };

    case 'CLEAR_ERROR': {
      const errors = omit(state.errors, action.name);
      if (errors === state.errors) return state;
      return { ...state, errors };
    }

    case 'SET_VALIDATING': {
      if (Boolean(state.validating[action.name]) === action.validating) return state;
      const validating = { ...state.validating };
      if (action.validating) validating[action.name] = true;
      else delete validating[action.name];
      return { ...state, validating };
    }

    case 'TOUCH_ALL': {
      const touched = { ...state.touched };
      let changed = false;
      for (const name of action.names) {
        if (!touched[name]) {
          touched[name] = true;
          changed = true;
        }
      }
      return changed ? { ...state, touched } : state;
    }

    case 'SET_SUBMIT_STATE': {
      const submitCount = action.incrementCount ? state.submitCount + 1 : state.submitCount;
      if (state.submitState === action.submitState && submitCount === state.submitCount) {
        return state;
      }
      return { ...state, submitState: action.submitState, submitCount };
    }

    case 'RESET':
      return action.state;

    default:
      return state;
  }
}
