'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_BELL_SOUND } from './sound';
import './NotificationBell.css';

export interface NotificationBellProps {
  /** Unread count — drives the badge, the hover number, and the ring. */
  count?: number;
  /** Cap for the badge: counts above it render as `${max}+` (e.g. 9 → "9+"). */
  max?: number;
  /** Text shown in the expanded hover pill + the accessible name. */
  label?: string;
  /** Periodically shake the bell while there are unread notifications. */
  ring?: boolean;
  /** Milliseconds between periodic shakes. */
  ringInterval?: number;
  /** Play a sound on each ring. Off by default (browser autoplay rules + manners). */
  sound?: boolean;
  /** Override the bundled default chime with your own audio URL. */
  soundSrc?: string;
  /** Playback volume, 0–1. */
  volume?: number;
  /** Modal header title. */
  title?: ReactNode;
  /** Modal body — you render whatever you like here (rows, badges, empty state). */
  children?: ReactNode;
  /** Optional modal footer slot (e.g. a "View all" link). */
  footer?: ReactNode;
  /** Controlled modal open state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Fires whenever the modal opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Clicking the backdrop closes the modal. */
  closeOnBackdrop?: boolean;
  /** Force a colour scheme, or follow the system with 'auto'. */
  theme?: 'light' | 'dark' | 'auto';
  /** Extra class on the root wrapper. */
  className?: string;
}

/** Modern, geometric bell — rounded dome + flared rim + clapper. Stroke-based
 *  so it inherits `currentColor` (muted at rest, white inside the dark pill). */
const BellIcon = () => (
  <svg
    className="royui-bell__icon"
    viewBox="0 0 24 24"
    width="21"
    height="21"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 8.4A6 6 0 1 0 6 8.4c0 4.4-1.1 6.4-2 7.4a1 1 0 0 0 .74 1.68h14.52A1 1 0 0 0 20 15.8c-.9-1-2-3-2-7.4Z" />
    <path d="M10 20.5a2.3 2.3 0 0 0 4 0" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export function NotificationBell({
  count = 0,
  max = 9,
  label = 'Notifications',
  ring = true,
  ringInterval = 1700,
  sound = false,
  soundSrc,
  volume = 0.5,
  title = 'Notifications',
  children,
  footer,
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnBackdrop = true,
  theme = 'auto',
  className = '',
}: NotificationBellProps) {
  const reactId = useId();
  const titleId = `royui-bell-${reactId}-title`;

  // Controlled / uncontrolled open state — mirrors the Dropdown pattern.
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const [isRinging, setIsRinging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevCount = useRef(count);

  const hasUnread = count > 0;
  const badgeText = count > max ? `${max}+` : String(count);

  // Portal target only exists on the client; gate it behind a mount flag so SSR
  // renders nothing and hydration stays clean.
  useEffect(() => setMounted(true), []);

  // Respect the OS "reduce motion" setting for the shake (sound is unaffected).
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Rebuild the audio element if the source changes.
  useEffect(() => {
    audioRef.current = null;
  }, [soundSrc]);

  const playSound = useCallback(() => {
    if (!sound || typeof Audio === 'undefined') return;
    if (!audioRef.current) {
      audioRef.current = new Audio(soundSrc ?? DEFAULT_BELL_SOUND);
    }
    const audio = audioRef.current;
    audio.volume = clamp01(volume);
    audio.currentTime = 0;
    // Autoplay can reject until the user has interacted with the page — swallow it.
    void audio.play().catch(() => {});
  }, [sound, soundSrc, volume]);

  const triggerRing = useCallback(() => {
    if (!reducedMotion) setIsRinging(true);
    playSound();
  }, [reducedMotion, playSound]);

  // Periodic ring while unread — paused when the modal is open or ringing is off.
  useEffect(() => {
    if (!ring || !hasUnread || isOpen) return;
    const id = setInterval(triggerRing, Math.max(300, ringInterval));
    return () => clearInterval(id);
  }, [ring, hasUnread, isOpen, ringInterval, triggerRing]);

  // One immediate ring whenever a new notification arrives (count goes up).
  useEffect(() => {
    if (count > prevCount.current) triggerRing();
    prevCount.current = count;
  }, [count, triggerRing]);

  // Body scroll-lock, Escape-to-close, initial focus, and focus-trap while open.
  useEffect(() => {
    if (!isOpen) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    closeRef.current?.focus();

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = prevOverflow;
      triggerRef.current?.focus();
    };
  }, [isOpen, setOpen]);

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const themeClass =
    theme === 'dark'
      ? 'royui-bell--dark'
      : theme === 'auto'
        ? 'royui-bell--auto'
        : '';

  const rootClass = ['royui-bell', themeClass, className].filter(Boolean).join(' ');

  const ariaName = hasUnread ? `${label}, ${count} unread` : label;

  return (
    <div className={rootClass}>
      <button
        ref={triggerRef}
        type="button"
        className={`royui-bell__trigger${isOpen ? ' royui-bell__trigger--open' : ''}`}
        aria-label={ariaName}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setOpen(true)}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="royui-bell__icon-wrap">
          <span
            className={`royui-bell__icon-spin${
              isRinging ? ' royui-bell__icon-spin--ringing' : ''
            }`}
            onAnimationEnd={() => setIsRinging(false)}
          >
            <BellIcon />
          </span>
          {hasUnread && (
            <span className="royui-bell__badge" aria-hidden="true">
              {badgeText}
            </span>
          )}
        </span>

        <span className="royui-bell__reveal">
          <span className="royui-bell__reveal-inner">
            <span className="royui-bell__label">{label}</span>
            {hasUnread && (
              <span className="royui-bell__count" aria-hidden="true">
                {badgeText}
              </span>
            )}
          </span>
        </span>
      </button>

      {mounted &&
        isOpen &&
        createPortal(
          <div className={`royui-bell-modal ${themeClass}`}>
            <div
              className="royui-bell-modal__backdrop"
              onClick={closeOnBackdrop ? () => setOpen(false) : undefined}
            />
            <div
              ref={dialogRef}
              className="royui-bell-modal__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <header className="royui-bell-modal__head">
                <div className="royui-bell-modal__title-wrap">
                  <h2 id={titleId} className="royui-bell-modal__title">
                    {title}
                  </h2>
                  {hasUnread && (
                    <span className="royui-bell-modal__count">{badgeText}</span>
                  )}
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="royui-bell-modal__close"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon />
                </button>
              </header>

              <div className="royui-bell-modal__body">{children}</div>

              {footer && <footer className="royui-bell-modal__footer">{footer}</footer>}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
