'use client';

import { forwardRef, type ReactNode } from 'react';
import './Form.css';
import { Button } from '../button';
import { FormContext, useFormContext } from './FormContext';
import { useFormStore } from './useFormStore';
import { useFormSelector } from './useFormField';
import { FieldRenderer } from './FieldRenderer';
import type { FieldWidth, FormField, FormProps, FormState } from './types';

// Module-stable selectors — primitives only, so the Object.is bail-out holds.
const selectSubmitState = (s: FormState) => s.submitState;
const selectErrorSignal = (s: FormState) =>
  `${s.submitCount}|${Object.keys(s.errors).sort().join(',')}`;

function focusField(formEl: HTMLFormElement | null, name: string): void {
  if (!formEl) return;
  const wrapper = formEl.querySelector<HTMLElement>(
    `[data-royui-field="${name.replace(/(["\\])/g, '\\$1')}"]`,
  );
  const focusable = wrapper?.querySelector<HTMLElement>('input, select, textarea, button');
  (focusable ?? wrapper)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  focusable?.focus();
}

/** Submit button, isolated so submit-state changes don't re-render the fields. */
function SubmitButton({ label }: { label?: ReactNode }) {
  const submitState = useFormSelector(selectSubmitState);
  return (
    <Button type="submit" loading={submitState === 'submitting'}>
      {label ?? 'Submit'}
    </Button>
  );
}

/** Post-submit status line. */
function FormStatus({ success, error }: { success?: ReactNode; error?: ReactNode }) {
  const submitState = useFormSelector(selectSubmitState);
  if (submitState === 'success' && success) {
    return (
      <p className="royui-form__status royui-form__status--success" role="status">
        {success}
      </p>
    );
  }
  if (submitState === 'error' && error) {
    return (
      <p className="royui-form__status royui-form__status--error" role="alert">
        {error}
      </p>
    );
  }
  return null;
}

/** Error summary shown after a blocked submit; each entry focuses its field. */
function ErrorSummary({ fields }: { fields: FormField[] }) {
  const ctrl = useFormContext();
  useFormSelector(selectErrorSignal); // subscribe; re-render when errors/submitCount change
  const { errors, submitCount } = ctrl.store.getState();
  const names = Object.keys(errors);
  if (submitCount === 0 || names.length === 0) return null;
  const labelFor = (name: string) => fields.find((f) => f.name === name)?.label ?? name;
  return (
    <div className="royui-form__error-summary" role="alert">
      <p className="royui-form__error-summary-title">
        Please fix {names.length} {names.length === 1 ? 'error' : 'errors'}:
      </p>
      <ul className="royui-form__error-list">
        {names.map((name) => (
          <li key={name}>
            <button
              type="button"
              className="royui-form__error-link"
              onClick={() => focusField(ctrl.formRef.current, name)}
            >
              <span className="royui-form__error-field">{labelFor(name)}</span> {errors[name]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Form = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
  const controller = useFormStore(props);
  const {
    fields,
    sections,
    theme = 'auto',
    columns = 1,
    className = '',
    id,
    submitLabel,
    successMessage,
    errorMessage,
  } = props;

  const defaultWidth: FieldWidth =
    columns === 2 ? 'half' : columns === 3 ? 'third' : 'full';

  const visible = fields.filter((f) => f.type !== 'hidden');
  const hidden = fields.filter((f) => f.type === 'hidden');
  const ungrouped = visible.filter((f) => !f.section);

  const renderField = (f: FormField) => (
    <FieldRenderer key={f.name} field={f} width={f.width ?? defaultWidth} theme={theme} />
  );

  const setFormRef = (node: HTMLFormElement | null) => {
    controller.formRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as { current: HTMLFormElement | null }).current = node;
  };

  const rootClasses = [
    'royui-form',
    theme === 'dark' ? 'royui-form--dark' : '',
    theme === 'auto' ? 'royui-form--auto' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasSections = Boolean(sections && sections.length > 0);

  return (
    <FormContext.Provider value={controller}>
      <form
        ref={setFormRef}
        id={id}
        className={rootClasses}
        noValidate
        onSubmit={controller.handleSubmit}
      >
        <ErrorSummary fields={fields} />

        {hasSections ? (
          <>
            {ungrouped.length > 0 && (
              <div className="royui-form__grid">{ungrouped.map(renderField)}</div>
            )}
            {sections!.map((sec) => {
              const secFields = visible.filter((f) => f.section === sec.id);
              if (secFields.length === 0) return null;
              return (
                <section key={sec.id} className="royui-form__section">
                  {sec.title != null && (
                    <h3 className="royui-form__section-title">{sec.title}</h3>
                  )}
                  {sec.description != null && (
                    <p className="royui-form__section-desc">{sec.description}</p>
                  )}
                  <div className="royui-form__grid">{secFields.map(renderField)}</div>
                </section>
              );
            })}
          </>
        ) : (
          <div className="royui-form__grid">{visible.map(renderField)}</div>
        )}

        {hidden.map(renderField)}

        <div className="royui-form__actions">
          <SubmitButton label={submitLabel} />
          <FormStatus success={successMessage} error={errorMessage} />
        </div>
      </form>
    </FormContext.Provider>
  );
});

Form.displayName = 'Form';
