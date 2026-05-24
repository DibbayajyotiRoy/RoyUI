'use client';

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import './Popover.css';

export interface PopoverProps {
  children: ReactNode;
  title?: string;
  align?: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg' | number;
  label?: string;
  defaultOpen?: boolean;
  renderTrigger?: (api: { isOpen: boolean; toggle: () => void }) => ReactNode;
}

const InfoIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-5M12 8h.01" />
  </svg>
);

export function Popover({
  children,
  title,
  align = 'right',
  width = 'md',
  label = 'Open menu',
  defaultOpen = false,
  renderTrigger,
}: PopoverProps) {
  const [open, setOpen] = useState(defaultOpen);
  const wrap = useRef<HTMLDivElement>(null);
  const toggle = () => setOpen((o) => !o);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const trigger = renderTrigger ? (
    renderTrigger({ isOpen: open, toggle })
  ) : (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-expanded={open}
      className={`royui-popover__trigger ${open ? 'royui-popover__trigger--on' : ''}`}
    >
      <InfoIcon />
    </button>
  );

  const widthClass =
    typeof width === 'string' ? `royui-popover__panel--${width}` : '';
  const customWidth =
    typeof width === 'number' ? { width: `${width}px` } : undefined;
  const alignClass = `royui-popover__panel--${align}`;

  return (
    <div ref={wrap} className="royui-popover">
      {trigger}
      {open && (
        <div
          className={`royui-popover__panel ${widthClass} ${alignClass}`}
          style={customWidth}
          role="dialog"
        >
          {title && <div className="royui-popover__title">{title}</div>}
          <div className="royui-popover__body">{children}</div>
        </div>
      )}
    </div>
  );
}
