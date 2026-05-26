'use client';

import { useEffect, useRef, useState } from 'react';
import type { Column, TableLayout } from './types';

export interface ColumnMenuProps<T> {
  columns: Column<T>[];
  layout: TableLayout;
  onToggle: (key: string) => void;
  onReset: () => void;
}

export function ColumnMenu<T>({
  columns,
  layout,
  onToggle,
  onReset,
}: ColumnMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

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

  const hiddenCount = layout.hidden.length;

  return (
    <div className="royui-dt-colmenu" ref={wrap}>
      <button
        type="button"
        className="royui-dt-colmenu__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Columns
      </button>
      {hiddenCount > 0 && (
        <button
          type="button"
          className="royui-dt-colmenu__chip"
          onClick={() => setOpen(true)}
        >
          {hiddenCount} hidden
        </button>
      )}

      {open && (
        <div className="royui-dt-colmenu__panel" role="menu">
          <div className="royui-dt-colmenu__head">
            <span className="royui-dt-colmenu__title">Columns</span>
            <button
              type="button"
              className="royui-dt-colmenu__reset"
              onClick={() => {
                onReset();
              }}
            >
              Reset
            </button>
          </div>
          <ul className="royui-dt-colmenu__list">
            {columns.map((c) => {
              const isHidden = layout.hidden.includes(c.key);
              const disabled = c.hideable === false;
              return (
                <li key={c.key}>
                  <button
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={!isHidden}
                    className={[
                      'royui-dt-colmenu__row',
                      isHidden && 'royui-dt-colmenu__row--off',
                      disabled && 'royui-dt-colmenu__row--locked',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => !disabled && onToggle(c.key)}
                    disabled={disabled}
                  >
                    <span
                      className={[
                        'royui-dt-colmenu__dot',
                        !isHidden && 'royui-dt-colmenu__dot--on',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-hidden
                    />
                    <span className="royui-dt-colmenu__label">{c.header}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
