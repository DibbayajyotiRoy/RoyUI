'use client';

const rows = [
  { id: 'INV-4201', name: 'Aarav Okafor',  status: 'paid',      total: '$148.32' },
  { id: 'INV-4202', name: 'Mira Lindqvist', status: 'pending',  total: '$92.05'  },
  { id: 'INV-4203', name: 'Theo Reyes',     status: 'paid',     total: '$310.40' },
  { id: 'INV-4204', name: 'Yuna Tanaka',    status: 'refunded', total: '$58.00'  },
  { id: 'INV-4205', name: 'Kofi Mendez',    status: 'paid',     total: '$214.92' },
];

const statusColor: Record<string, string> = {
  paid: 'rgba(110, 220, 150, 0.95)',
  pending: 'rgba(240, 196, 88, 0.95)',
  refunded: 'rgba(200, 200, 210, 0.7)',
};

export function FeaturedDataTable() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 420,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: 12,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.5fr 0.9fr 0.9fr',
          padding: '7px 12px',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span>Order</span>
        <span>Customer</span>
        <span>Status</span>
        <span style={{ textAlign: 'right' }}>Total</span>
      </div>
      {rows.map((r) => (
        <div
          key={r.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1.5fr 0.9fr 0.9fr',
            padding: '9px 12px',
            color: 'rgba(255,255,255,0.92)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'ui-monospace, Menlo, monospace',
              color: 'rgba(255,255,255,0.65)',
              fontSize: 11.5,
            }}
          >
            {r.id}
          </span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {r.name}
          </span>
          <span style={{ color: statusColor[r.status] }}>{r.status}</span>
          <span
            style={{
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
              color: 'rgba(255,255,255,0.94)',
            }}
          >
            {r.total}
          </span>
        </div>
      ))}
    </div>
  );
}
