'use client';

// Shared, INTERNAL-only field chrome. Not a published subpath (no index.ts in
// this folder), so tsup folds it into a shared chunk imported by each primitive
// rather than copying it into every entry. Holds the glyphs, the helper-line,
// the shake-on-error effect, and the error/success/helper message resolution
// that the form controls would otherwise each duplicate from Input.

import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Info "i" for the resting helper line. */
export const InfoIcon = () => (
  <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 7.2v3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="5" r="0.95" fill="currentColor" />
  </svg>
);

/** Warning triangle for the error line. */
export const WarnIcon = () => (
  <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" aria-hidden="true">
    <path d="M8 2.2l6 10.4H2L8 2.2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M8 6.4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r="0.9" fill="currentColor" />
  </svg>
);

/** Check mark, reused for success lines and control ticks. */
export const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
    <path
      d="M4.5 12.5l4.6 4.6L19.5 6.8"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Trailing spinner for pending/checking states. */
export const SpinnerIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.4" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

/** An explicit error / success *string* wins over helperText; a boolean state
 *  keeps the helper text and only recolours the row. */
export function resolveMessage(
  error: boolean | string | undefined,
  success: boolean | string | undefined,
  helperText: ReactNode,
): ReactNode {
  return (
    (typeof error === 'string' && error) ||
    (typeof success === 'string' && success) ||
    helperText ||
    null
  );
}

/** Shake once each time the control *enters* the error state — not on every
 *  render while errored, and never when it mounts already invalid. */
export function useShake(isError: boolean): boolean {
  const [shake, setShake] = useState(false);
  const wasError = useRef(false);
  useEffect(() => {
    if (!isError) {
      wasError.current = false;
      return;
    }
    if (wasError.current) return;
    wasError.current = true;
    setShake(true);
    const t = setTimeout(() => setShake(false), 420);
    return () => clearTimeout(t);
  }, [isError]);
  return shake;
}

/** The helper / error / success line. `block` is the component's BEM root (e.g.
 *  "royui-textarea") so each control keeps its own scoped styles. */
export function FieldMessage({
  block,
  id,
  state,
  children,
}: {
  block: string;
  id?: string;
  state: 'error' | 'success' | 'idle';
  children: ReactNode;
}) {
  if (children == null || children === '') return null;
  const icon = state === 'error' ? <WarnIcon /> : state === 'success' ? <CheckIcon /> : <InfoIcon />;
  return (
    <p className={`${block}__helper`} id={id} aria-live="polite">
      <span className={`${block}__helper-icon`} aria-hidden="true">
        {icon}
      </span>
      {/* Keying on the copy re-mounts the span so it fades when the text changes. */}
      <span className={`${block}__helper-text`} key={typeof children === 'string' ? children : 'msg'}>
        {children}
      </span>
    </p>
  );
}
