'use client';

import { useState } from 'react';
import { Button } from '@roy-ui/ui/button';
import { CopyButton } from '../CopyButton';

const PALETTE = [
  { name: 'Ink', value: '#1d1d20' },
  { name: 'Cyan', value: '#4ec6ff' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Violet', value: '#7c5cff' },
  { name: 'Green', value: '#30a46c' },
  { name: 'Amber', value: '#f5d90a' },
  { name: 'Rose', value: '#e5484d' },
  { name: 'Snow', value: '#ffffff' },
];

export function ButtonColorPlayground() {
  const [color, setColor] = useState('#4ec6ff');
  const code = `<Button color="${color}">Post</Button>`;

  return (
    <div className="btn-play">
      <div className="btn-play__stage">
        <Button color={color} size="lg">
          Post
        </Button>
      </div>

      <div className="btn-play__swatches" role="radiogroup" aria-label="Button color">
        {PALETTE.map((c) => {
          const active = color.toLowerCase() === c.value.toLowerCase();
          return (
            <button
              key={c.value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={c.name}
              title={c.name}
              className={`btn-play__swatch ${active ? 'is-active' : ''}`}
              style={{ background: c.value }}
              onClick={() => setColor(c.value)}
            />
          );
        })}
        <label className="btn-play__custom" title="Custom color">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-label="Custom color"
          />
        </label>
      </div>

      <div className="btn-play__code">
        <code>{code}</code>
        <CopyButton text={code} label="Copy config" />
      </div>
    </div>
  );
}
