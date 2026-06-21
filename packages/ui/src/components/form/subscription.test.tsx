// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Form } from './Form';
import type { FormField } from './types';

afterEach(cleanup);

describe('store subscription scoping', () => {
  it('typing in one field does not re-render sibling fields', () => {
    let rendersA = 0;
    let rendersB = 0;

    const fields: FormField[] = [
      {
        name: 'a',
        type: 'custom',
        render: (c) => {
          rendersA++;
          return (
            <input
              data-testid="a"
              value={String(c.value ?? '')}
              onChange={(e) => c.onChange(e.target.value)}
            />
          );
        },
      },
      {
        name: 'b',
        type: 'custom',
        render: (c) => {
          rendersB++;
          return (
            <input
              data-testid="b"
              value={String(c.value ?? '')}
              onChange={(e) => c.onChange(e.target.value)}
            />
          );
        },
      },
    ];

    render(<Form fields={fields} onSubmit={() => {}} />);

    const beforeA = rendersA;
    const beforeB = rendersB;

    fireEvent.change(screen.getByTestId('a'), { target: { value: 'hello' } });

    // The edited field re-renders; its sibling does not — the payoff of the
    // external-store + per-field subscription model.
    expect(rendersA).toBeGreaterThan(beforeA);
    expect(rendersB).toBe(beforeB);
    expect((screen.getByTestId('a') as HTMLInputElement).value).toBe('hello');
  });
});
