'use client';

import { useState } from 'react';
import { Button } from '@roy-ui/ui';

export function ButtonLoadingDemo() {
  const [loading, setLoading] = useState(false);
  const simulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2200);
  };
  return (
    <Button type="submit" loading={loading} onClick={simulate}>
      Post
    </Button>
  );
}
