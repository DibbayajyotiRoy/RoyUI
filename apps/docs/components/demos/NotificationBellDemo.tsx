'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { NotificationBell } from '@roy-ui/ui';

type Theme = 'light' | 'dark' | 'auto';
type NotifType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

/** Per-type accent: [tile background tint, glyph colour]. */
const TYPE_COLOR: Record<NotifType, { tint: string; fg: string }> = {
  info: { tint: 'rgba(59, 130, 246, 0.14)', fg: '#3b82f6' },
  success: { tint: 'rgba(34, 197, 94, 0.14)', fg: '#22c55e' },
  warning: { tint: 'rgba(245, 158, 11, 0.16)', fg: '#f59e0b' },
  error: { tint: 'rgba(244, 63, 94, 0.14)', fg: '#f43f5e' },
};

/* ── Tiny inline-SVG glyphs, one per type (currentColor-driven) ── */
const InfoIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 7.2v3.4M8 5.1v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const SuccessIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.4 8.2l1.8 1.8 3.4-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M8 2.4l5.6 9.7H2.4L8 2.4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 6.6v2.4M8 10.8v.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const TYPE_ICON: Record<NotifType, () => ReactNode> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

/** Single notification row — shared by every demo on this page. Reads from the
 *  modal's own colour tokens so it harmonises with light/dark automatically. */
function NotificationRow({ item, onRead }: { item: Notification; onRead: (id: string) => void }) {
  const color = TYPE_COLOR[item.type];
  const Glyph = TYPE_ICON[item.type];

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 12,
    cursor: 'pointer',
    // Unread rows carry a faint accent wash; read rows sit flat.
    background: item.read ? 'transparent' : 'color-mix(in srgb, var(--royui-modal-accent) 7%, transparent)',
    transition: 'background 0.16s ease',
  };

  return (
    <button
      type="button"
      onClick={() => onRead(item.id)}
      style={{ ...rowStyle, width: '100%', border: 0, font: 'inherit', textAlign: 'left' }}
    >
      <span
        aria-hidden="true"
        style={{
          flex: 'none',
          display: 'grid',
          placeItems: 'center',
          width: 34,
          height: 34,
          borderRadius: 10,
          background: color.tint,
          color: color.fg,
        }}
      >
        <Glyph />
      </span>

      <span style={{ flex: '1 1 auto', minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            style={{
              flex: '1 1 auto',
              minWidth: 0,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: 'var(--royui-modal-fg)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.title}
          </span>
          <span style={{ flex: 'none', fontSize: 11, color: 'var(--royui-modal-faint)' }}>
            {item.time}
          </span>
        </span>
        <span
          style={{
            display: 'block',
            marginTop: 2,
            fontSize: 12.5,
            lineHeight: 1.4,
            color: 'var(--royui-modal-faint)',
          }}
        >
          {item.message}
        </span>
      </span>

      {!item.read && (
        <span
          aria-hidden="true"
          style={{
            flex: 'none',
            marginTop: 13,
            width: 8,
            height: 8,
            borderRadius: 999,
            background: 'var(--royui-modal-accent)',
          }}
        />
      )}
    </button>
  );
}

/** The scrollable list (or a tasteful empty state when there's nothing left). */
function NotificationList({
  items,
  onRead,
}: {
  items: Notification[];
  onRead: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          gap: 6,
          padding: '40px 16px',
          textAlign: 'center',
          color: 'var(--royui-modal-faint)',
        }}
      >
        <span style={{ fontSize: 26 }} aria-hidden="true">
          🎉
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--royui-modal-fg)' }}>
          You&apos;re all caught up
        </span>
        <span style={{ fontSize: 12.5 }}>No new notifications right now.</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item) => (
        <NotificationRow key={item.id} item={item} onRead={onRead} />
      ))}
    </div>
  );
}

/** A simple pill button, inline-styled to match the demos' lightweight look. */
function pillButtonStyle(): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    height: 38,
    padding: '0 16px',
    border: 0,
    borderRadius: 999,
    background: '#16181d',
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    cursor: 'pointer',
    boxShadow: '0 8px 22px -12px rgba(20, 23, 40, 0.5)',
  };
}

/** A borderless text button for modal footer actions ("Mark all read").
 *  Kept deliberately muted so the actual notification rows stay the focus. */
function textButtonStyle(): CSSProperties {
  return {
    border: 0,
    background: 'transparent',
    padding: 0,
    color: 'var(--royui-modal-faint)',
    font: 'inherit',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  };
}

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const SEED: Notification[] = [
  {
    id: 'n1',
    type: 'info',
    title: 'New comment on your PR',
    message: 'Priya left a review on “Add notification bell”.',
    time: '2m ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'success',
    title: 'Deployment succeeded',
    message: 'docs-site shipped to production in 48s.',
    time: '18m ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'warning',
    title: 'Storage almost full',
    message: 'You’ve used 92% of your project storage.',
    time: '1h ago',
    read: true,
  },
  {
    id: 'n4',
    type: 'error',
    title: 'Payment failed',
    message: 'Your card ending 4242 was declined.',
    time: '3h ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'info',
    title: 'Sarah followed you',
    message: 'Sarah Chen started following your activity.',
    time: 'Yesterday',
    read: true,
  },
];

/** Canned arrivals cycled through by the "Send notification" button. */
const INCOMING: Array<Pick<Notification, 'type' | 'title' | 'message'>> = [
  { type: 'success', title: 'Build passed', message: 'All 214 tests green on main.' },
  { type: 'info', title: 'New mention', message: 'Alex mentioned you in #design.' },
  { type: 'warning', title: 'Rate limit near', message: 'API usage at 88% of your plan.' },
  { type: 'error', title: 'Webhook failed', message: 'Delivery to stripe.com returned 500.' },
];

export function NotificationBellDemo({
  theme = 'auto',
  sound = false,
}: {
  theme?: Theme;
  /** Opt in to the chime. Off by default — the bell still rings (shakes) silently. */
  sound?: boolean;
}) {
  const [items, setItems] = useState<Notification[]>(SEED);
  const [sendCount, setSendCount] = useState(0);

  const unread = items.reduce((n, item) => (item.read ? n : n + 1), 0);

  const markRead = (id: string) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));

  const markAllRead = () => setItems((prev) => prev.map((item) => ({ ...item, read: true })));

  const send = () => {
    const next = INCOMING[sendCount % INCOMING.length];
    if (!next) return; // guards noUncheckedIndexedAccess
    setSendCount((c) => c + 1);
    setItems((prev) => [
      { id: `s${sendCount}-${Date.now()}`, ...next, time: 'just now', read: false },
      ...prev,
    ]);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <NotificationBell
        count={unread}
        theme={theme}
        sound={sound}
        title="Notifications"
        footer={
          <button type="button" style={textButtonStyle()} onClick={markAllRead}>
            Mark all read
          </button>
        }
      >
        <NotificationList items={items} onRead={markRead} />
      </NotificationBell>

      <button type="button" style={pillButtonStyle()} onClick={send}>
        <PlusIcon />
        Send notification
      </button>
    </div>
  );
}

/** Compact, self-contained list state for the side-by-side theme demo. */
function ThemedBell({
  theme,
  count,
  seed,
}: {
  theme: Exclude<Theme, 'auto'>;
  count: number;
  seed: Notification[];
}) {
  const [items, setItems] = useState<Notification[]>(seed);
  const markRead = (id: string) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));

  // ring={false}: this is a calm colour comparison, not a ring showcase — two
  // bells shaking out of sync reads as noise.
  return (
    <NotificationBell count={count} theme={theme} ring={false} title="Notifications">
      <NotificationList items={items} onRead={markRead} />
    </NotificationBell>
  );
}

export function NotificationBellThemesDemo() {
  const sample: Notification[] = [
    { id: 't1', type: 'success', title: 'Invite accepted', message: 'Mara joined your workspace.', time: '5m ago', read: false },
    { id: 't2', type: 'info', title: 'Weekly digest', message: '12 updates across your projects.', time: '2h ago', read: false },
    { id: 't3', type: 'warning', title: 'Seat limit reached', message: 'Upgrade to add more members.', time: '1d ago', read: true },
  ];

  // Equal columns that fill the width and stack on narrow screens; fixed height
  // and centered content keep the two cards visually balanced.
  const card: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    minHeight: 156,
    padding: 24,
    borderRadius: 18,
    boxSizing: 'border-box',
  };

  const caption: CSSProperties = {
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 14,
      }}
    >
      <div
        style={{
          ...card,
          background: '#f6f7f9',
          boxShadow: 'inset 0 0 0 1px rgba(20, 23, 40, 0.06)',
        }}
      >
        <ThemedBell theme="light" count={3} seed={sample} />
        <span style={{ ...caption, color: '#8a909c' }}>Light</span>
      </div>

      <div
        style={{
          ...card,
          background: '#16181d',
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
        }}
      >
        <ThemedBell theme="dark" count={12} seed={sample} />
        <span style={{ ...caption, color: '#7c828e' }}>Dark</span>
      </div>
    </div>
  );
}
