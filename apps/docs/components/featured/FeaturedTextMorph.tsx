'use client';

import { useEffect, useState } from 'react';
import { TextMorph } from '@roy-ui/ui';

const PHRASES = [
  'Crafted with care.',
  'Built with focus.',
  'Shipped with joy.',
];

export function FeaturedTextMorph() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % PHRASES.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      style={{
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: '-0.018em',
        color: 'rgba(255,255,255,0.96)',
      }}
    >
      <TextMorph value={PHRASES[i] ?? PHRASES[0]!} />
    </span>
  );
}
