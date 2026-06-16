/* KPI sample data for the StatCard docs. The same array drives the docs
   Examples and the home/catalog preview, so the live demos and the dashboard
   thumbnail never drift apart. The numbers are deliberately a little messy —
   real products rarely land on round figures — and they read as a SaaS
   dashboard: revenue, active users, orgs, infra health.

   Note the spread of `data`: most rows carry a real sparkline series, but
   "Active orgs" barely moves and "Avg. score" omits `data` entirely. That's
   the "never fabricate data" rule in the open — an absent series draws no
   chart rather than an invented line. */

/* Tiny inline SVGs — this library has no icon dependency, so glyphs are
   hand-rolled at ~14px, stroked with currentColor so `color` can tint them. */

/* Coins, for revenue. */
export const RevenueIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <ellipse cx="12" cy="6" rx="7.5" ry="3" />
    <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
    <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
  </svg>
);

/* A pair of shoulders, for people / orgs. */
export const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20c0-3.3 2.46-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 14.7c2.2.5 3.8 2.4 3.8 5.3" />
  </svg>
);

/* A heartbeat trace, for activity / interviews run. */
export const PulseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2.5 12h4l2.5-6 4 13 2.5-7H21" />
  </svg>
);

/* Stacked drives, for infra / latency. */
export const ServerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3.5" y="4" width="17" height="6.5" rx="1.6" />
    <rect x="3.5" y="13.5" width="17" height="6.5" rx="1.6" />
    <path d="M7 7.2h.01M7 16.7h.01" />
  </svg>
);

/* A five-point star, for ratings / scores. */
export const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 17.77l-5.2 2.75.99-5.8L3.58 9.62l5.82-.85L12 3.5z" />
  </svg>
);

/* A warning triangle, for error / alert rates. */
export const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 4.5 21 19.5H3L12 4.5z" />
    <path d="M12 10v4M12 17h.01" />
  </svg>
);

type StatCardSample = {
  label: string;
  value: string;
  sub?: string;
  delta?: number;
  trend?: 'up' | 'down' | 'flat';
  goodDirection?: 'up' | 'down';
  color?: string;
  data?: number[];
  icon?: React.ReactNode;
};

/* Six KPIs for an AI interviewer dashboard. Shared between the docs Examples
   and the catalog preview so both tell the same story. */
export const statCardSamples: StatCardSample[] = [
  {
    label: 'Revenue',
    value: '$125.4K',
    sub: '+$42.1K this month',
    delta: 12.4,
    color: 'var(--royui-statcard-accent)',
    /* A dip, then a strong recovery to a new high — a curve with a real valley
       rather than a straight ramp. */
    data: [56, 47, 42, 52, 66, 83, 98],
    icon: <RevenueIcon />,
  },
  {
    label: 'Active users',
    value: '12,840',
    sub: '+1,930 this week',
    delta: 6.8,
    color: '#4f7cff',
    /* A sharp campaign spike from a flat baseline to a tall early peak, then a
       drop back down — a steep hump, so the smooth curve has to round a real
       peak rather than just trend one way. */
    data: [10180, 10520, 17640, 13080, 12200, 12460, 12840],
    icon: <PulseIcon />,
  },
  {
    label: 'Active orgs',
    value: '276',
    sub: 'Holding steady',
    trend: 'flat',
    color: '#7a6cff',
    /* Genuinely flat — a real series that barely moves. With trend "flat" and no
       delta the chip stays hidden (flat is the silent state); the sparkline still
       draws its quiet, near-level line. */
    data: [274, 278, 275, 279, 276, 278, 276],
    icon: <UsersIcon />,
  },
  {
    label: 'Error rate',
    value: '0.42%',
    sub: 'Down from 0.71%',
    delta: -12.5,
    /* A falling error rate is the good outcome, so down reads green. */
    goodDirection: 'down',
    color: '#d98324',
    data: [0.71, 0.63, 0.67, 0.56, 0.52, 0.45, 0.42],
    icon: <AlertIcon />,
  },
  {
    label: 'p95 latency',
    value: '184ms',
    sub: 'Edge, last hour',
    delta: -9.5,
    /* Lower latency is better, so a drop reads green here too. */
    goodDirection: 'down',
    color: '#2aa775',
    data: [241, 230, 234, 214, 206, 193, 184],
    icon: <ServerIcon />,
  },
  {
    label: 'Avg. score',
    value: '7.6 / 10',
    sub: 'Last 30 days',
    /* No `data` at all — there is no honest series to draw, so the card renders
       cleanly with just the value. */
    color: '#c9568f',
    icon: <StarIcon />,
  },
];
