'use client';

import { useState } from 'react';
import { GradientButton } from '@roy-ui/ui';

export function LoadingDemo() {
  const [loading, setLoading] = useState(false);
  const simulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2200);
  };
  return (
    <GradientButton type="submit" loading={loading} onClick={simulate}>
      Join the Waitlist
    </GradientButton>
  );
}
