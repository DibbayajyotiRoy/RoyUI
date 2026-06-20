'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@roy-ui/ui';

/* Leading icons used across the Input docs. Each is drawn on a 24-box so it
   sits centered in the component's 20px icon slot. */
export function AtIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M15.4 9v4.2c0 1.4 1 2.1 2 2.1 1.6 0 2.6-1.6 2.6-3.6a8 8 0 1 0-3 6.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 19.5a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.6 15.6L20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Live email field: validates as you type, but only *commits* an error once you
   leave a non-empty field — so it never scolds you mid-keystroke. A valid
   address flips it to success (the check draws in); a bad one shakes on blur. */
export function InputEmailDemo({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const valid = EMAIL_RE.test(value);
  const showError = touched && value.length > 0 && !valid;

  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Input
        theme={theme}
        type="email"
        label="Email address"
        icon={<AtIcon />}
        placeholder="you@company.com"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        error={showError ? 'Enter a valid email address' : false}
        success={valid}
        helperText="We'll only use this to send your receipt."
      />
    </div>
  );
}

/* Names already on the system — type one of these and it comes back taken. */
const TAKEN = ['admin', 'roy', 'support', 'john', 'hello', 'team'];

/* Live availability check — the "is this taken?" use case. Debounces a fake
   lookup: under 3 chars it's idle, then a spinner turns while "checking", and
   it resolves to a green available / red taken message. Swap the setTimeout for
   a real fetch and the states stay the same. */
export function InputAvailabilityDemo({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function onChange(next: string) {
    setValue(next);
    clearTimeout(timer.current);
    const handle = next.trim().toLowerCase();
    if (handle.length < 3) {
      setStatus('idle');
      return;
    }
    setStatus('checking');
    timer.current = setTimeout(() => {
      setStatus(TAKEN.includes(handle) ? 'taken' : 'available');
    }, 750);
  }

  const idleHelper = 'Pick a handle — at least 3 characters.';
  const helperText =
    status === 'idle' ? idleHelper : status === 'checking' ? 'Checking availability…' : undefined;

  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Input
        theme={theme}
        label="Username"
        icon={<UserIcon />}
        placeholder="your_handle"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        loading={status === 'checking'}
        success={status === 'available' ? `${value} is available` : false}
        error={status === 'taken' ? `${value} is already taken` : false}
        helperText={helperText}
      />
    </div>
  );
}
