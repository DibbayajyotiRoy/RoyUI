'use client';

import { memo, useId } from 'react';
import { Input } from '../input';
import { Textarea } from '../textarea';
import { Checkbox } from '../checkbox';
import { Switch } from '../switch';
import { RadioGroup } from '../radio-group';
import { NumberInput } from '../number-input';
import { Dropdown } from '../dropdown';
import { FieldMessage } from '../_internal/field-shared';
import { useFormField } from './useFormField';
import type { FieldControl, FieldWidth, FormField } from './types';

type Theme = 'light' | 'dark' | 'auto';

interface FieldRendererProps {
  field: FormField;
  width: FieldWidth;
  theme: Theme;
}

/** Renders one schema field against the controlled-field contract. Memoised so a
 *  parent re-render skips fields whose config didn't change; the field's own
 *  store subscription (useFormField) drives value/error updates. */
function FieldRendererInner({ field, width, theme }: FieldRendererProps) {
  const reactId = useId();
  const controlId = `${reactId}-${field.name}`;
  const control = useFormField(field.name, controlId, field.disabled);

  // Hidden fields carry a value but take no layout space.
  if (field.type === 'hidden') {
    return (
      <input type="hidden" name={field.name} value={String(control.value ?? '')} readOnly />
    );
  }

  return (
    <div
      className={`royui-form__field royui-form__field--${width}`}
      data-royui-field={field.name}
    >
      <FieldControlView field={field} control={control} theme={theme} />
    </div>
  );
}

function FieldControlView({
  field,
  control,
  theme,
}: {
  field: FormField;
  control: FieldControl;
  theme: Theme;
}) {
  const showError = control.touched && control.error ? control.error : undefined;
  const common = {
    disabled: control.disabled,
    theme,
    error: showError,
    helperText: field.helperText,
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'tel':
    case 'url':
    case 'search':
      return (
        <Input
          {...common}
          id={control.id}
          type={field.type}
          label={field.label ?? field.name}
          placeholder={field.placeholder}
          icon={field.icon}
          value={String(control.value ?? '')}
          onChange={(e) => control.onChange(e.target.value)}
          onBlur={control.onBlur}
        />
      );

    case 'textarea':
      return (
        <Textarea
          {...common}
          id={control.id}
          label={field.label ?? field.name}
          placeholder={field.placeholder}
          rows={field.rows}
          autoGrow={field.autoGrow}
          maxLength={field.maxLength}
          showCount={field.showCount}
          value={String(control.value ?? '')}
          onChange={(e) => control.onChange(e.target.value)}
          onBlur={control.onBlur}
        />
      );

    case 'number':
      return (
        <NumberInput
          {...common}
          id={control.id}
          label={field.label ?? field.name}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step}
          precision={field.precision}
          value={typeof control.value === 'number' ? control.value : null}
          onChange={(n) => control.onChange(n)}
          onBlur={control.onBlur}
        />
      );

    case 'checkbox':
      return (
        <Checkbox
          disabled={control.disabled}
          theme={theme}
          error={showError}
          helperText={field.helperText}
          id={control.id}
          label={field.label ?? field.name}
          checked={Boolean(control.value)}
          onChange={(e) => control.onChange(e.target.checked)}
          onBlur={control.onBlur}
        />
      );

    case 'switch':
      return (
        <Switch
          disabled={control.disabled}
          theme={theme}
          error={showError}
          helperText={field.helperText}
          id={control.id}
          label={field.label ?? field.name}
          checked={Boolean(control.value)}
          onChange={(e) => control.onChange(e.target.checked)}
          onBlur={control.onBlur}
        />
      );

    case 'radio':
      return (
        <RadioGroup
          disabled={control.disabled}
          theme={theme}
          error={showError}
          helperText={field.helperText}
          id={control.id}
          name={field.name}
          label={field.label}
          options={field.options}
          orientation={field.orientation}
          value={control.value == null ? undefined : String(control.value)}
          onChange={(v) => control.onChange(v)}
        />
      );

    case 'select':
      return <NativeSelect field={field} control={control} theme={theme} error={showError} />;

    case 'custom':
      return <>{field.render(control)}</>;

    default:
      return null;
  }
}

/** Select field. Single-select renders the custom Dropdown (the accessible
 *  combobox matching the design); multi-select keeps a native <select>, which is
 *  the right control for picking several values and stays SSR-safe. */
function NativeSelect({
  field,
  control,
  theme,
  error,
}: {
  field: Extract<FormField, { type: 'select' }>;
  control: FieldControl;
  theme: Theme;
  error?: string;
}) {
  const messageId = `${control.id}-message`;
  const labelId = `${control.id}-label`;
  const message = error ?? field.helperText;
  const multiple = Boolean(field.multiple);

  const classes = ['royui-form__native', error ? 'royui-form__native--error' : '']
    .filter(Boolean)
    .join(' ');

  const labelEl = field.label != null && (
    <label id={labelId} className="royui-form__native-label" htmlFor={control.id}>
      {field.label}
    </label>
  );
  const messageEl = message && (
    <FieldMessage block="royui-form" id={messageId} state={error ? 'error' : 'idle'}>
      {message}
    </FieldMessage>
  );

  if (!multiple) {
    return (
      <div className={classes}>
        {labelEl}
        <Dropdown
          id={control.id}
          theme={theme}
          fullWidth
          invalid={Boolean(error)}
          disabled={control.disabled}
          placeholder={field.placeholder ?? 'Select…'}
          options={field.options}
          value={control.value == null ? '' : String(control.value)}
          onChange={(v) => control.onChange(v)}
          aria-labelledby={field.label != null ? labelId : undefined}
          aria-describedby={message ? messageId : undefined}
        />
        {messageEl}
      </div>
    );
  }

  const value = Array.isArray(control.value) ? (control.value as string[]) : [];
  return (
    <div className={classes}>
      {labelEl}
      <div className="royui-form__select-wrap">
        <select
          id={control.id}
          className="royui-form__select"
          multiple
          disabled={control.disabled}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          onChange={(e) =>
            control.onChange(Array.from(e.target.selectedOptions).map((o) => o.value))
          }
          onBlur={control.onBlur}
        >
          {field.options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {messageEl}
    </div>
  );
}

export const FieldRenderer = memo(FieldRendererInner);
