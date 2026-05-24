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
    <TextMorph
      value={FRAMEWORKS[idx]!}
      typeDelay={[70, 120]}
      backspaceDelay={[45, 75]}
      pauseMs={160}
    />
  );
}
