// A tiny framework-agnostic pub/sub store. This is the notification layer that
// makes field-level subscription the default: components read a slice via
// useSyncExternalStore and only re-render when that slice actually changes.
// React context, by contrast, re-renders every consumer on any value change —
// so the engine deliberately does NOT put form state in a context value, only
// the stable store handle.

export type Listener = () => void;

export interface Store<T> {
  getState: () => T;
  setState: (next: T) => void;
  subscribe: (listener: Listener) => () => void;
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    getState: () => state,
    setState: (next) => {
      if (next === state) return; // reducers return the same ref for no-op actions
      state = next;
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
