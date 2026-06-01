'use client';

import { useMemo, useState } from 'react';
import { DataTable, type Column } from '@roy-ui/ui';
import { makeOrders, type Order } from './DataTableSyntheticData';

function statusPill(status: Order['status']) {
  const colors: Record<Order['status'], string> = {
    paid: 'rgba(34, 139, 84, 1)',
    refunded: 'rgba(100, 100, 110, 1)',
    pending: 'rgba(196, 142, 18, 1)',
    failed: 'rgba(196, 50, 50, 1)',
  };
  const bg: Record<Order['status'], string> = {
    paid: 'rgba(34, 139, 84, 0.10)',
    refunded: 'rgba(100, 100, 110, 0.10)',
    pending: 'rgba(196, 142, 18, 0.12)',
    failed: 'rgba(196, 50, 50, 0.12)',
  };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 500,
        background: bg[status],
        color: colors[status],
      }}
    >
      {status}
    </span>
  );
}

const fmtUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function DataTableFullDemo() {
  const [data, setData] = useState<Order[]>(() => makeOrders(60));

  const columns = useMemo<Column<Order>[]>(
    () => [
      {
        key: 'id',
        header: 'Order',
        accessor: (r) => r.id,
        isRowHeader: true,
        defaultWidth: 110,
        font: { family: 'ui-monospace, Menlo, Consolas, monospace', size: 12.5 },
      },
      {
        key: 'customer',
        header: 'Customer',
        accessor: (r) => r.customer,
        cell: (_v, r) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 500 }}>{r.customer}</span>
            <span style={{ fontSize: 11.5, color: 'rgba(127,127,127,1)' }}>{r.email}</span>
          </div>
        ),
        defaultWidth: 220,
      },
      {
        key: 'status',
        header: 'Status',
        accessor: (r) => r.status,
        cell: (v) => statusPill(v as Order['status']),
        defaultWidth: 110,
      },
      {
        key: 'channel',
        header: 'Channel',
        accessor: (r) => r.channel,
        defaultWidth: 110,
      },
      {
        key: 'placedAt',
        header: 'Placed',
        accessor: (r) => r.placedAt,
        type: 'date',
        cell: (v) => (v as Date).toLocaleDateString(),
        defaultWidth: 130,
      },
      {
        key: 'time',
        header: 'Time',
        accessor: (r) => r.placedAt,
        type: 'time',
        cell: (v) =>
          (v as Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        defaultWidth: 100,
      },
      {
        key: 'total',
        header: 'Total',
        accessor: (r) => r.total,
        type: 'number',
        cell: (v) => fmtUsd.format(v as number),
        defaultWidth: 110,
        font: { featureSettings: '"tnum"' },
      },
    ],
    [],
  );

  return (
    <DataTable<Order>
      data={data}
      columns={columns}
      visibleRows={8}
      search={{ enabled: true, placeholder: 'Search orders, customers, status' }}
      dateFilter={{ column: 'placedAt', monthsVisible: 2 }}
      timeFilter={{ column: 'time', variant: 'analog' }}
      pagination={{ pageSize: 12 }}
      dataIO={{
        export: { enabled: true, filename: 'orders' },
        import: {
          enabled: true,
          onImport: (rows) => setData(rows as Order[]),
        },
      }}
      headerFont={{ size: 11, weight: 600, letterSpacing: '0.08em' }}
    />
  );
}
