'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import './Checkbox.css';
import { CheckIcon, FieldMessage, resolveMessage, useShake } from '../_internal/field-shared';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label beside the box. */
  label?: ReactNode;
  /** Visual tri-state; also sets el.indeterminate on the native input. */
  indeterminate?: boolean;
  helperText?: ReactNode;
  /** Error state. A string becomes the helper line; the control shakes once. */
  error?: boolean | string;
  /** Box edge length. Default 'md'. */
  size?: 'sm' | 'md';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      indeterminate = false,
      helperText,
      error = false,
      size = 'md',
      theme = 'auto',
      className = '',
      id,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const reactId = useId();
    const fieldId = id ?? `royui-checkbox-${reactId}`;
    const messageId = `${fieldId}-message`;

    const isError = Boolean(error);
    const message = resolveMessage(error, false, helperText);
    const shake = useShake(isError);

    const innerRef = useRef<HTMLInputElement | null>(null);
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
      },
      [ref],
    );
    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const classes = [
      'royui-checkbox',
      `royui-checkbox--${size}`,
      indeterminate ? 'royui-checkbox--indeterminate' : '',
      isError ? 'royui-checkbox--error' : '',
      disabled ? 'royui-checkbox--disabled' : '',
      shake ? 'royui-checkbox--shake' : '',
      theme === 'dark' ? 'royui-checkbox--dark' : '',
      theme === 'auto' ? 'royui-checkbox--auto' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={classes}>
        {/* Input is a leading sibling of the visual box so :checked / :focus-visible
            drive the box via the `~` combinator (no :has needed). */}
        <label className="royui-checkbox__row">
          <input
            {...rest}
            ref={setRefs}
            id={fieldId}
            type="checkbox"
            disabled={disabled}
            className="royui-checkbox__input"
            aria-invalid={isError || undefined}
            aria-describedby={message ? messageId : undefined}
          />
          <span className="royui-checkbox__box" aria-hidden="true">
            <span className="royui-checkbox__mark">
              <CheckIcon />
            </span>
            <span className="royui-checkbox__bar" />
          </span>
          {label != null && <span className="royui-checkbox__label">{label}</span>}
        </label>

        {message && (
          <FieldMessage block="royui-checkbox" id={messageId} state={isError ? 'error' : 'idle'}>
            {message}
          </FieldMessage>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
