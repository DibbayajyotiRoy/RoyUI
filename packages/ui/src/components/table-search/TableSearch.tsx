'use client';

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
} from 'react';
import './TableSearch.css';

export interface TableSearchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Debounce in ms before onChange fires. Default 0 (synchronous). */
  debounceMs?: number;
  placeholder?: string;
  /** Width in px. Default 260. */
  width?: number | string;
  /** Hide the magnifier dot. */
  hideIndicator?: boolean;
  style?: CSSProperties;
}

export const TableSearch = forwardRef<HTMLInputElement, TableSearchProps>(
  function TableSearch(
    {
      value,
      defaultValue,
      onChange,
      debounceMs = 0,
      placeholder = 'Search',
      width = 260,
      hideIndicator,
      className = '',
      style,
      ...rest
    },
    ref,
  ) {
    const controlled = value !== undefined;
    const [internal, setInternal] = useState(defaultValue ?? '');
    const current = controlled ? value! : internal;
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
      if (timer.current) clearTimeout(timer.current);
    }, []);

    const emit = (next: string) => {
      if (!onChange) return;
      if (debounceMs <= 0) {
        onChange(next);
        return;
      }
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => onChange(next), debounceMs);
    };

    const handle = (e: ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      if (!controlled) setInternal(next);
      emit(next);
    };

    const clear = () => {
      if (!controlled) setInternal('');
      if (onChange) onChange('');
    };

    return (
      <div
        className={['royui-tablesearch', className].filter(Boolean).join(' ')}
        style={{ width, ...style }}
      >
        {!hideIndicator && <span className="royui-tablesearch__dot" aria-hidden />}
        <input
          ref={ref}
          type="text"
          className="royui-tablesearch__input"
          placeholder={placeholder}
          value={current}
          onChange={handle}
          {...rest}
        />
        {current.length > 0 && (
          <button
            type="button"
            className="royui-tablesearch__clear"
            onClick={clear}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
    );
  },
);
