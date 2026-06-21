'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import './Textarea.css';
import { FieldMessage, resolveMessage, useShake } from '../_internal/field-shared';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder'> {
  /** Label that rests over the field and lifts on focus / when filled. (required) */
  label: string;
  /** Quiet line beneath the field. An error / success string replaces it. */
  helperText?: ReactNode;
  /** Faint hint revealed once the label has floated up. */
  placeholder?: string;
  /** Error state. A string also becomes the helper line; the field shakes once. */
  error?: boolean | string;
  /** Success state (outranked by error). A string becomes the helper line. */
  success?: boolean | string;
  /** Grow with content (up to maxRows) instead of scrolling. */
  autoGrow?: boolean;
  /** Initial / minimum visible rows. Default 3. */
  minRows?: number;
  /** Cap for autoGrow before it scrolls. Default 8. */
  maxRows?: number;
  /** Show a "n" or "n / maxLength" counter bottom-right. */
  showCount?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      placeholder,
      error = false,
      success = false,
      autoGrow = false,
      minRows = 3,
      maxRows = 8,
      showCount = false,
      theme = 'auto',
      className = '',
      id,
      disabled,
      value,
      defaultValue,
      maxLength,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const reactId = useId();
    const fieldId = id ?? `royui-textarea-${reactId}`;
    const messageId = `${fieldId}-message`;

    const isError = Boolean(error);
    const isSuccess = Boolean(success) && !isError;
    const message = resolveMessage(error, success, helperText);
    const shake = useShake(isError);

    // Track length in state so the counter stays live when uncontrolled; a
    // controlled `value` always takes precedence.
    const [count, setCount] = useState(() =>
      typeof value === 'string'
        ? value.length
        : typeof defaultValue === 'string'
          ? defaultValue.length
          : 0,
    );
    const length = typeof value === 'string' ? value.length : count;
    const overLimit = maxLength != null && length > maxLength;

    // Merge the forwarded ref with an internal one so autoGrow can size it.
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as { current: HTMLTextAreaElement | null }).current = node;
      },
      [ref],
    );

    const grow = useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoGrow) return;
      el.style.height = 'auto';
      const cs = getComputedStyle(el);
      const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4 || 22;
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) || 0;
      const max = maxRows * lineHeight + pad;
      el.style.height = `${Math.min(el.scrollHeight, max)}px`;
      el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
    }, [autoGrow, maxRows]);

    useEffect(() => {
      grow();
    }, [grow, value]);

    const classes = [
      'royui-textarea',
      isError ? 'royui-textarea--error' : '',
      isSuccess ? 'royui-textarea--success' : '',
      overLimit ? 'royui-textarea--over' : '',
      disabled ? 'royui-textarea--disabled' : '',
      shake ? 'royui-textarea--shake' : '',
      theme === 'dark' ? 'royui-textarea--dark' : '',
      theme === 'auto' ? 'royui-textarea--auto' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={classes}>
        <div className="royui-textarea__field">
          <textarea
            {...rest}
            ref={setRefs}
            id={fieldId}
            rows={minRows}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            placeholder={placeholder ?? ' '}
            className="royui-textarea__input"
            aria-invalid={isError || undefined}
            aria-describedby={message ? messageId : undefined}
            onChange={(e) => {
              setCount(e.target.value.length);
              onChange?.(e);
              grow();
            }}
          />
          <label className="royui-textarea__label" htmlFor={fieldId}>
            {label}
          </label>
          {showCount && (
            <span className="royui-textarea__count" aria-hidden="true">
              {maxLength != null ? `${length} / ${maxLength}` : length}
            </span>
          )}
        </div>

        {message && (
          <FieldMessage
            block="royui-textarea"
            id={messageId}
            state={isError ? 'error' : isSuccess ? 'success' : 'idle'}
          >
            {message}
          </FieldMessage>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
