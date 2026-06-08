'use client';

import { useEffect, useState } from 'react';
import { TextMorph } from '@roy-ui/ui';

const FRAMEWORKS = ['React', 'Next.js', 'Vue', 'Angular', 'Vite'];
const CYCLE_MS = 2400;

export function HeroTitleMorph() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % FRAMEWORKS.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    // Reserve a fixed slot sized to the widest framework name so the
    // morphing word never reflows the heading (which jumps the page on
    // narrow viewports as the wrap point shifts). The ghost stack sizes
    // the slot from real font metrics rather than guessed character counts.
    <span className="hero-morph">
      {FRAMEWORKS.map((f) => (
        <span className="hero-morph__ghost" aria-hidden="true" key={f}>
          {f}
        </span>
      ))}
      <span className="hero-morph__live">
        <TextMorph
          value={FRAMEWORKS[idx]!}
          typeDelay={[70, 120]}
          backspaceDelay={[45, 75]}
          pauseMs={160}
        />
      </span>
    </span>
  );
}
