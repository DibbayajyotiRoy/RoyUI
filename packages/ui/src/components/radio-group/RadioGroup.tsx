'use client';

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import './RadioGroup.css';
import { FieldMessage, resolveMessage, useShake } from '../_internal/field-shared';

export interface RadioOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Group legend. */
  label?: string;
  /** Native group name (exclusivity). Defaults to a generated id. */
  name?: string;
  options: RadioOption[];
  /** Controlled selected value. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  helperText?: ReactNode;
  /** Error state. A string becomes the helper line; the group shakes once. */
  error?: boolean | string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  id?: string;
}

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      label,
      name,
      options,
      value,
      defaultValue,
      onChange,
      orientation = 'vertical',
      helperText,
      error = false,
      disabled = false,
      size = 'md',
      theme = 'auto',
      className = '',
      id,
    },
    ref,
  ) => {
    const reactId = useId();
    const groupId = id ?? `royui-radio-${reactId}`;
    const messageId = `${groupId}-message`;
    const groupName = name ?? groupId;

    const isError = Boolean(error);
    const message = resolveMessage(error, false, helperText);
    const shake = useShake(isError);

    // Controlled when `value` is provided; otherwise track internally.
    const [internal, setInternal] = useState(defaultValue);
    const current = value !== undefined ? value : internal;
    const select = (next: string) => {
      if (value === undefined) setInternal(next);
      onChange?.(next);
    };

    const classes = [
      'royui-radio-group',
      `royui-radio-group--${orientation}`,
      `royui-radio-group--${size}`,
      isError ? 'royui-radio-group--error' : '',
      disabled ? 'royui-radio-group--disabled' : '',
      shake ? 'royui-radio-group--shake' : '',
      theme === 'dark' ? 'royui-radio-group--dark' : '',
      theme === 'auto' ? 'royui-radio-group--auto' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <fieldset
        ref={ref}
        className={classes}
        disabled={disabled}
        aria-invalid={isError || undefined}
        aria-describedby={message ? messageId : undefined}
      >
        {label != null && <legend className="royui-radio-group__legend">{label}</legend>}
        <div className="royui-radio-group__items">
          {options.map((opt) => (
            <label key={opt.value} className="royui-radio__row">
              {/* Native radios provide roving tabindex + arrow-key selection. */}
              <input
                type="radio"
                className="royui-radio__input"
                name={groupName}
                value={opt.value}
                checked={current === opt.value}
                disabled={disabled || opt.disabled}
                onChange={() => select(opt.value)}
              />
              <span className="royui-radio__dot" aria-hidden="true" />
              <span className="royui-radio__label">{opt.label}</span>
            </label>
          ))}
        </div>

        {message && (
          <FieldMessage
            block="royui-radio-group"
            id={messageId}
            state={isError ? 'error' : 'idle'}
          >
            {message}
          </FieldMessage>
        )}
      </fieldset>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  size?: 'sm' | 'md';
}

/** A standalone styled radio for hand-composed groups. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, size = 'md', className = '', ...rest }, ref) => {
    const classes = ['royui-radio', `royui-radio--${size}`, className].filter(Boolean).join(' ');
    return (
      <label className={`${classes} royui-radio__row`}>
        <input {...rest} ref={ref} type="radio" className="royui-radio__input" />
        <span className="royui-radio__dot" aria-hidden="true" />
        {label != null && <span className="royui-radio__label">{label}</span>}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
