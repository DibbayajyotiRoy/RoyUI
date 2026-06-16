'use client';

import { StatCard } from '@roy-ui/ui';
import { PulseIcon } from './stat-card-sample';

/* The clickable card passes an onClick, which makes it a real <button>. That
   handler has to be created on the client, so this preview is its own 'use
   client' island — a Server Component can't hand a function to StatCard. */
export function StatCardClickableDemo() {
  return (
    <div style={{ width: 240 }}>
      <StatCard
        theme="dark"
        label="Active users"
        value="12,840"
        sub="+1,930 this week"
        delta={6.8}
        data={[10180, 10520, 17640, 13080, 12200, 12460, 12840]}
        icon={<PulseIcon />}
        onClick={() => {}}
      />
    </div>
  );
}
