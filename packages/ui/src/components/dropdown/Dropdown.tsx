'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import './Dropdown.css';

export interface DropdownOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  /** Controlled selected value. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /**
   * Fixed trigger text — when set, the trigger always shows this (menu mode,
   * e.g. "Export as"). Omit it for select mode, where the trigger shows the
   * selected option's label (or the placeholder).
   */
  label?: ReactNode;
  /** Shown in the trigger in select mode when nothing is selected. */
  placeholder?: ReactNode;
  /** Leading glyph in the trigger (e.g. the dark download circle). */
  icon?: ReactNode;
  /** Which edge the panel aligns to. Default 'left'. */
  align?: 'left' | 'right';
  /** Stretch the trigger to fill its container (forms). Default false. */
  fullWidth?: boolean;
  disabled?: boolean;
  /** Recolours the trigger border for an invalid form field. */
  invalid?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  /** Accessible name for the trigger when there's no visible text label. */
  'aria-label'?: string;
  /** Ties the trigger to an external <label> / error message. */
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  id?: string;
}

const Chevron = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckMark = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      label,
      placeholder,
      icon,
      align = 'left',
      fullWidth = false,
      disabled = false,
      invalid = false,
      theme = 'auto',
      className = '',
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
    },
    ref,
  ) => {
    const reactId = useId();
    const baseId = id ?? `royui-dropdown-${reactId}`;
    const listId = `${baseId}-list`;
    const optionId = (i: number) => `${baseId}-opt-${i}`;

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? value : internalValue;
    const selectedIndex = options.findIndex((o) => o.value === currentValue);
    const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
    const typeahead = useRef<{ buffer: string; timer: ReturnType<typeof setTimeout> | null }>({
      buffer: '',
      timer: null,
    });

    const setButtonRef = useCallback(
      (node: HTMLButtonElement | null) => {
        buttonRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as { current: HTMLButtonElement | null }).current = node;
      },
      [ref],
    );

    const firstEnabled = useCallback(
      (from: number, dir: 1 | -1): number => {
        const n = options.length;
        for (let step = 0; step < n; step++) {
          const i = (from + dir * step + n * (step + 1)) % n;
          if (!options[i]?.disabled) return i;
        }
        return -1;
      },
      [options],
    );

    const openMenu = useCallback(() => {
      if (disabled) return;
      setOpen(true);
      setActiveIndex(selectedIndex >= 0 && !options[selectedIndex]?.disabled
        ? selectedIndex
        : firstEnabled(0, 1));
    }, [disabled, selectedIndex, options, firstEnabled]);

    const closeMenu = useCallback((focusButton = true) => {
      setOpen(false);
      setActiveIndex(-1);
      if (focusButton) buttonRef.current?.focus();
    }, []);

    const commit = useCallback(
      (index: number) => {
        const opt = options[index];
        if (!opt || opt.disabled) return;
        if (!isControlled) setInternalValue(opt.value);
        onChange?.(opt.value);
        closeMenu();
      },
      [options, isControlled, onChange, closeMenu],
    );

    // Outside-click + scroll-away dismissal while open.
    useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: MouseEvent) => {
        if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener('mousedown', onPointerDown);
      return () => document.removeEventListener('mousedown', onPointerDown);
    }, [open]);

    // Keep the active option scrolled into view.
    useEffect(() => {
      if (open && activeIndex >= 0) {
        optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
      }
    }, [open, activeIndex]);

    const runTypeahead = useCallback(
      (char: string) => {
        const t = typeahead.current;
        if (t.timer) clearTimeout(t.timer);
        t.buffer += char.toLowerCase();
        t.timer = setTimeout(() => {
          t.buffer = '';
        }, 500);
        const match = options.findIndex(
          (o) =>
            !o.disabled &&
            typeof o.label === 'string' &&
            o.label.toLowerCase().startsWith(t.buffer),
        );
        if (match >= 0) {
          if (open) setActiveIndex(match);
          else commit(match);
        }
      },
      [options, open, commit],
    );

    const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!open) openMenu();
          else setActiveIndex((i) => firstEnabled(i < 0 ? 0 : i, 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!open) openMenu();
          else setActiveIndex((i) => firstEnabled(i < 0 ? 0 : i, -1));
          break;
        case 'Home':
          if (open) {
            e.preventDefault();
            setActiveIndex(firstEnabled(0, 1));
          }
          break;
        case 'End':
          if (open) {
            e.preventDefault();
            setActiveIndex(firstEnabled(options.length - 1, -1));
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!open) openMenu();
          else if (activeIndex >= 0) commit(activeIndex);
          break;
        case 'Escape':
          if (open) {
            e.preventDefault();
            closeMenu();
          }
          break;
        case 'Tab':
          if (open) setOpen(false);
          break;
        default:
          if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            runTypeahead(e.key);
          }
      }
    };

    const triggerContent =
      label != null ? label : selectedOption ? selectedOption.label : placeholder;

    const classes = [
      'royui-dropdown',
      open ? 'royui-dropdown--open' : '',
      fullWidth ? 'royui-dropdown--full' : '',
      invalid ? 'royui-dropdown--invalid' : '',
      disabled ? 'royui-dropdown--disabled' : '',
      align === 'right' ? 'royui-dropdown--align-right' : '',
      theme === 'dark' ? 'royui-dropdown--dark' : '',
      theme === 'auto' ? 'royui-dropdown--auto' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={classes} ref={rootRef}>
        <button
          ref={setButtonRef}
          id={baseId}
          type="button"
          className="royui-dropdown__trigger"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-invalid={invalid || undefined}
          onClick={() => (open ? closeMenu() : openMenu())}
          onKeyDown={onKeyDown}
        >
          {icon != null && (
            <span className="royui-dropdown__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <span
            className={`royui-dropdown__value${
              triggerContent === placeholder && !selectedOption && label == null
                ? ' royui-dropdown__value--placeholder'
                : ''
            }`}
          >
            {triggerContent}
          </span>
          <span className="royui-dropdown__chevron" aria-hidden="true">
            <Chevron />
          </span>
        </button>

        {open && (
          <ul
            id={listId}
            className="royui-dropdown__panel"
            role="listbox"
            aria-labelledby={ariaLabelledby ?? baseId}
            tabIndex={-1}
          >
            {options.map((opt, i) => {
              // In menu mode (a fixed `label`), selecting fires an action rather
              // than holding a value, so options aren't marked selected.
              const isSelected = label == null && opt.value === currentValue;
              const isActive = i === activeIndex;
              return (
                <li
                  key={opt.value}
                  ref={(node) => {
                    optionRefs.current[i] = node;
                  }}
                  id={optionId(i)}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled || undefined}
                  className={[
                    'royui-dropdown__option',
                    isActive ? 'royui-dropdown__option--active' : '',
                    isSelected ? 'royui-dropdown__option--selected' : '',
                    opt.disabled ? 'royui-dropdown__option--disabled' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
                  onMouseDown={(e) => e.preventDefault()} // keep focus on the trigger
                  onClick={() => commit(i)}
                >
                  <span className="royui-dropdown__option-label">{opt.label}</span>
                  {isSelected && (
                    <span className="royui-dropdown__option-check" aria-hidden="true">
                      <CheckMark />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);

Dropdown.displayName = 'Dropdown';
