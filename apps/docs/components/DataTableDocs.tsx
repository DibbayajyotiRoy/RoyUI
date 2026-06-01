'use client';

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  DataTable,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSearch,
  TimePicker,
  TimeRangePicker,
  DateRangePicker,
  type Column,
  type DateRange,
  type TimeValue,
  type TimeRangeValue,
} from '@roy-ui/ui';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { PreviewTabs } from './PreviewTabs';
import { DataTableFullDemo } from './demos/DataTableFullDemo';
import { makeOrders, type Order } from './demos/DataTableSyntheticData';

const minimalColumns: Column<Order>[] = [
  { key: 'id', header: 'Order', accessor: (r) => r.id, isRowHeader: true, defaultWidth: 110 },
  { key: 'customer', header: 'Customer', accessor: (r) => r.customer },
  { key: 'status', header: 'Status', accessor: (r) => r.status, defaultWidth: 110 },
  {
    key: 'total',
    header: 'Total',
    accessor: (r) => r.total,
    type: 'number',
    defaultWidth: 110,
    cell: (v) => `$${(v as number).toFixed(2)}`,
  },
];

const fewRows = makeOrders(10, 7);

export function DataTableDocs() {
  return (
    <>
      <FullExperienceSection />

      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="DataTable composes six primitives that all ship from one package. Import only what you need."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import {
  DataTable,
  // standalone primitives
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSearch,
  Pagination,
  DateRangePicker,
  TimePicker,
} from '@roy-ui/ui';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="minimal"
        eyebrow="02"
        title="The minimum"
        description="Bare bones — four columns, default scroll depth (7 rows), pagination off. Every feature is opt-in."
      >
        <Example
          title="Just data + columns"
          description="No toolbar, no filter, no menu. The Table still scrolls vertically once you exceed visibleRows."
          code={`<DataTable
  data={orders}
  columns={[
    { key: 'id', header: 'Order', accessor: (r) => r.id, isRowHeader: true },
    { key: 'customer', header: 'Customer', accessor: (r) => r.customer },
    { key: 'status', header: 'Status', accessor: (r) => r.status },
    { key: 'total', header: 'Total', accessor: (r) => r.total, type: 'number' },
  ]}
  pagination={false}
/>`}
        >
          <DataTable<Order>
            data={fewRows}
            columns={minimalColumns}
            pagination={false}
          />
        </Example>
      </DocSection>

      <DocSection
        id="search"
        eyebrow="03"
        title="Add search"
        description="One prop enables a debounced search input that matches across every column's stringified accessor."
      >
        <Example
          title="Search across all columns"
          description="Pass a search.predicate to take over matching — e.g. fuzzy or weighted scoring."
          code={`<DataTable
  data={orders}
  columns={columns}
  search={{ enabled: true, placeholder: 'Search orders' }}
/>`}
        >
          <DataTable<Order>
            data={fewRows}
            columns={minimalColumns}
            search={{ enabled: true, placeholder: 'Search' }}
            pagination={false}
          />
        </Example>
      </DocSection>

      <DocSection
        id="pagination"
        eyebrow="04"
        title="Pagination"
        description="Text Prev / Next + numbered pages. No arrow icons — direction is conveyed through layout and motion."
      >
        <Example
          title="Page size 5"
          description="Pass pagination={{ pageSize }} to slice rows. Summary in the corner is on by default."
          code={`<DataTable
  data={orders}
  columns={columns}
  pagination={{ pageSize: 5 }}
/>`}
        >
          <DataTable<Order>
            data={makeOrders(28, 11)}
            columns={minimalColumns}
            pagination={{ pageSize: 5 }}
          />
        </Example>
        <Example
          title="Standalone pagination"
          description="Pagination is its own primitive — wire it to any list you already have."
          code={`<Pagination page={page} pageCount={12} onPageChange={setPage} />`}
        >
          <StandalonePagination />
        </Example>
      </DocSection>

      <DocSection
        id="dates-and-times"
        eyebrow="05"
        title="Range + time filters"
        description="A 2-month modal range picker and a clock (analog wristwatch or digital segments) that both bind to a column."
      >
        <Example
          title="Both filters wired to one column"
          description="The time filter matches a range — pick a Start and End on the clock. Start later than End wraps past midnight."
          code={`<DataTable
  data={orders}
  columns={columns}
  dateFilter={{ column: 'placedAt', monthsVisible: 2 }}
  timeFilter={{ column: 'placedAt', variant: 'analog' }}
/>`}
        >
          <DataTable<Order>
            data={makeOrders(40, 5)}
            columns={[
              ...minimalColumns,
              {
                key: 'placedAt',
                header: 'Placed',
                accessor: (r) => r.placedAt,
                type: 'date',
                cell: (v) => (v as Date).toLocaleDateString(),
              },
              {
                key: 'time',
                header: 'Time',
                accessor: (r) => r.placedAt,
                type: 'time',
                cell: (v) =>
                  (v as Date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
              },
            ]}
            dateFilter={{ column: 'placedAt', monthsVisible: 2 }}
            timeFilter={{ column: 'time', variant: 'analog' }}
            pagination={{ pageSize: 8 }}
          />
        </Example>
        <Example
          title="Standalone DateRangePicker"
          description="Two-month modal with preset sidebar. Hover preview a range, click twice to commit."
          code={`<DateRangePicker monthsVisible={2} onChange={setRange} />`}
        >
          <StandaloneDateRange />
        </Example>
        <Example
          title="Standalone TimePicker — both variants"
          description="The variant prop sets the initial mode. switchable lets the user flip between analog and digital."
          code={`<TimePicker variant="analog" onChange={setTime} />
<TimePicker variant="digital" hourCycle={12} onChange={setTime} />`}
        >
          <StandaloneTime />
        </Example>
        <Example
          title="Standalone TimeRangePicker"
          description="Pick a Start and End on one clock. Switching analog ↔ digital cross-fades and morphs the panel height. A Start later than the End wraps past midnight."
          code={`<TimeRangePicker onChange={setRange} />
<TimeRangePicker hourCycle={12} variant="digital" onChange={setRange} />`}
        >
          <StandaloneTimeRange />
        </Example>
      </DocSection>

      <DocSection
        id="columns"
        eyebrow="06"
        title="Reorder, resize, hide"
        description="Headers are draggable. Right edge of each header is a resize handle (double-click resets). The Columns menu hides any column with one click — the hidden chip puts it back."
      >
        <Example
          title="Try it"
          description="Drag a header to reorder. Drag the right edge to resize. Open Columns to hide one — a chip appears showing how many are hidden."
          code={`<DataTable
  data={orders}
  columns={columns}
  // all three are on by default; turn off with:
  // reorderable={false}
  // resizable={false}
  // columnMenu={false}
/>`}
        >
          <DataTable<Order>
            data={makeOrders(14, 9)}
            columns={[
              ...minimalColumns,
              {
                key: 'channel',
                header: 'Channel',
                accessor: (r) => r.channel,
                defaultWidth: 110,
              },
              {
                key: 'email',
                header: 'Email',
                accessor: (r) => r.email,
                defaultHidden: true,
              },
            ]}
            pagination={false}
          />
        </Example>
      </DocSection>

      <DocSection
        id="fit-columns"
        eyebrow="07"
        title="Render every column without horizontal scroll"
        description="Pass fitColumns to make every column share the container width. Default widths and resized widths are ignored; cells wrap onto multiple lines instead of clipping. Drop it whenever you'd rather see all columns at once than scroll sideways."
      >
        <Example
          title="fitColumns — no X scrollbar, ever"
          description="The same seven columns the hero table uses, but constrained to the parent container with fitColumns. Try shrinking your browser window — content wraps; horizontal scroll never appears."
          code={`<DataTable
  data={orders}
  columns={columns}
  fitColumns
  pagination={{ pageSize: 6 }}
/>`}
        >
          <DataTable<Order>
            data={makeOrders(18, 17)}
            columns={[
              ...minimalColumns,
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
              },
              {
                key: 'time',
                header: 'Time',
                accessor: (r) => r.placedAt,
                type: 'time',
                cell: (v) =>
                  (v as Date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
              },
            ]}
            fitColumns
            pagination={{ pageSize: 6 }}
          />
        </Example>
        <Example
          title="Off (default) — wide widths overflow into a scrollbar"
          description="Same columns, same widths, no fitColumns. The X scrollbar appears when the sum of defaultWidth exceeds the container — useful for dense, wide datasets where users would rather scroll than read wrapped cells."
          code={`<DataTable
  data={orders}
  columns={columns}
  // no fitColumns prop — defaultWidth respected, X scroll allowed
/>`}
        >
          <DataTable<Order>
            data={makeOrders(6, 23)}
            columns={[
              ...minimalColumns,
              {
                key: 'channel',
                header: 'Channel',
                accessor: (r) => r.channel,
                defaultWidth: 140,
              },
              {
                key: 'placedAt',
                header: 'Placed',
                accessor: (r) => r.placedAt,
                type: 'date',
                cell: (v) => (v as Date).toLocaleDateString(),
                defaultWidth: 160,
              },
              {
                key: 'time',
                header: 'Time',
                accessor: (r) => r.placedAt,
                type: 'time',
                cell: (v) =>
                  (v as Date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                defaultWidth: 140,
              },
            ]}
            pagination={false}
          />
        </Example>
      </DocSection>

      <DocSection
        id="export-import"
        eyebrow="08"
        title="Export & import"
        description="One prop adds CSV + JSON export buttons. Another exposes a file picker that hands parsed rows to onImport — the parent controls data, so importing is a state update."
      >
        <Example
          title="Round trip"
          description="Export the current view, edit it, import it back. Try clicking Export → JSON, then Import the file."
          code={`<DataTable
  data={orders}
  columns={columns}
  dataIO={{
    export: { enabled: true, filename: 'orders' },
    import: {
      enabled: true,
      onImport: (rows) => setOrders(rows),
    },
  }}
/>`}
        >
          <ExportImportDemo />
        </Example>
      </DocSection>

      <DocSection
        id="typography"
        eyebrow="09"
        title="Per-zone typography"
        description="Three fonts: column headers, row headers (the row-identifier cells), and data cells. Pass a string for family, or an object for size / weight / tracking / feature settings."
      >
        <Example
          title="Mono row headers + grotesque headers"
          description="The Order column is declared with isRowHeader, so it picks up the rowHeaderFont — an Apple system mono with tabular numerals. Header zone gets a tighter editorial grotesque."
          code={`<DataTable
  headerFont={{ size: 11, weight: 600, letterSpacing: '0.08em' }}
  rowHeaderFont={{
    family: 'ui-monospace, Menlo, Consolas, monospace',
    size: 12.5,
    featureSettings: '"tnum"',
  }}
  cellFont={{ size: 13.5 }}
  ...
/>`}
        >
          <DataTable<Order>
            data={makeOrders(8, 21)}
            columns={minimalColumns}
            pagination={false}
            headerFont={{ size: 11, weight: 600, letterSpacing: '0.08em' }}
            rowHeaderFont={{
              family: 'ui-monospace, Menlo, Consolas, monospace',
              size: 12.5,
              featureSettings: '"tnum"',
            }}
            cellFont={{ size: 13.5 }}
          />
        </Example>
      </DocSection>

      <DocSection
        id="primitives"
        eyebrow="10"
        title="The primitives, alone"
        description="DataTable is a convenience. Every part stands on its own — wire them into whatever layout you have."
      >
        <Example
          title="Compose the table by hand"
          description="Table + TableHeader + TableBody + TableRow + TableHead / TableCell render the same way DataTable does, just without the toolbar."
          code={`<Table visibleRows={5}>
  <TableHeader>
    <TableRow>
      <TableHead>Order</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead align="right">Total</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map(r => (
      <TableRow key={r.id}>
        <TableCell isRowHeader>{r.id}</TableCell>
        <TableCell>{r.customer}</TableCell>
        <TableCell align="right">{r.total}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
        >
          <BareTable />
        </Example>
      </DocSection>

      <DocSection
        id="props"
        eyebrow="11"
        title="Props"
        description="DataTable, plus a quick reference for the standalone primitives."
      >
        <h3 className="example__title" style={{ marginTop: 0 }}>DataTable</h3>
        <PropsTable rows={dataTableProps} />
        <h3 className="example__title" style={{ marginTop: 24 }}>Column&lt;T&gt;</h3>
        <PropsTable rows={columnProps} />
        <h3 className="example__title" style={{ marginTop: 24 }}>Pagination</h3>
        <PropsTable rows={paginationProps} />
        <h3 className="example__title" style={{ marginTop: 24 }}>DateRangePicker</h3>
        <PropsTable rows={dateRangeProps} />
        <h3 className="example__title" style={{ marginTop: 24 }}>TimePicker</h3>
        <PropsTable rows={timePickerProps} />
      </DocSection>
    </>
  );
}

/* ── Hero — the full-feature table ──────────────────────── */

function FullExperienceSection() {
  return (
    <section className="doc-section" id="full">
      <div className="doc-section__head">
        <div className="doc-section__eyebrow">00</div>
        <h2 className="doc-section__title">Everything, on</h2>
        <p className="doc-section__desc">
          Search, a two-month range picker, an analog clock with a 60-minute tolerance,
          sort by clicking a header, drag headers to reorder, drag their right edge to
          resize, open Columns to hide one, and export the current view as CSV or JSON —
          all wired through a single component on 60 rows of synthetic order data.
        </p>
      </div>

      <div className="dt-hero-tips" role="note" aria-label="Interaction hints">
        <span className="dt-hero-tips__item">
          <span className="dt-hero-tips__grip" aria-hidden>
            <span /><span />
            <span /><span />
            <span /><span />
          </span>
          Drag any header to reorder
        </span>
        <span className="dt-hero-tips__sep" aria-hidden>·</span>
        <span className="dt-hero-tips__item">
          <span className="dt-hero-tips__edge" aria-hidden />
          Drag the right edge of a header to resize
        </span>
        <span className="dt-hero-tips__sep" aria-hidden>·</span>
        <span className="dt-hero-tips__item">
          Click a header to sort
        </span>
      </div>

      <div className="dt-hero">
        <DataTableFullDemo />
      </div>
    </section>
  );
}

/* ── Local helpers and demos ────────────────────────────── */

function StandalonePagination() {
  const [page, setPage] = useState(3);
  return <Pagination page={page} pageCount={12} onPageChange={setPage} />;
}

function StandaloneDateRange() {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  return <DateRangePicker value={range} onChange={setRange} monthsVisible={2} />;
}

function StandaloneTime() {
  const [t1, setT1] = useState<TimeValue | null>(null);
  const [t2, setT2] = useState<TimeValue | null>(null);
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <TimePicker value={t1} onChange={setT1} variant="analog" placeholder="Analog" />
      <TimePicker
        value={t2}
        onChange={setT2}
        variant="digital"
        hourCycle={12}
        placeholder="Digital"
      />
    </div>
  );
}

function StandaloneTimeRange() {
  const [r1, setR1] = useState<TimeRangeValue>({ from: null, to: null });
  const [r2, setR2] = useState<TimeRangeValue>({ from: null, to: null });
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <TimeRangePicker value={r1} onChange={setR1} variant="analog" placeholder="Analog range" />
      <TimeRangePicker
        value={r2}
        onChange={setR2}
        variant="digital"
        hourCycle={12}
        placeholder="Digital range"
      />
    </div>
  );
}

function ExportImportDemo() {
  const [data, setData] = useState<Order[]>(() => makeOrders(20, 13));
  return (
    <DataTable<Order>
      data={data}
      columns={[
        ...minimalColumns,
        {
          key: 'channel',
          header: 'Channel',
          accessor: (r) => r.channel,
          defaultWidth: 110,
        },
      ]}
      pagination={{ pageSize: 6 }}
      dataIO={{
        export: { enabled: true, filename: 'orders', formats: ['csv', 'json'] },
        import: {
          enabled: true,
          onImport: (rows) => setData(rows as Order[]),
        },
      }}
    />
  );
}

function BareTable() {
  const rows = makeOrders(5, 33);
  return (
    <Table visibleRows={5}>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead align="right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell isRowHeader>{r.id}</TableCell>
            <TableCell>{r.customer}</TableCell>
            <TableCell align="right">${r.total.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/* ── Section + Example + Props chrome (same as TreeNavDocs) ── */

function DocSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-section" id={id}>
      <div className="doc-section__head">
        <div className="doc-section__eyebrow">{eyebrow}</div>
        <h2 className="doc-section__title">{title}</h2>
        <p className="doc-section__desc">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Example({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <article className="example">
      <header className="example__head">
        <h3 className="example__title">{title}</h3>
        <p className="example__desc">{description}</p>
      </header>
      <PreviewTabs preview={children} code={<Code code={code} />} />
    </article>
  );
}

/* ── Props tables ───────────────────────────────────────── */

type PropRow = { name: string; type: string; def: string; desc: string };

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <table className="props">
      <thead>
        <tr>
          <th style={{ width: '20%' }}>Prop</th>
          <th style={{ width: '34%' }}>Type</th>
          <th style={{ width: '12%' }}>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td className="prop-name"><code>{r.name}</code></td>
            <td className="prop-type"><code>{r.type}</code></td>
            <td className="prop-default"><code>{r.def}</code></td>
            <td className="prop-desc">{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const dataTableProps: PropRow[] = [
  { name: 'data', type: 'T[]', def: '—', desc: 'The full dataset. The table is fully controlled — filtering and pagination derive from this.' },
  { name: 'columns', type: 'Column<T>[]', def: '—', desc: 'Column definitions. Order in the array is the initial display order.' },
  { name: 'getRowId', type: '(row, i) => string | number', def: 'row.id || i', desc: 'Stable React key per row.' },
  { name: 'visibleRows', type: 'number', def: '7', desc: 'How many rows fit before the body starts scrolling.' },
  { name: 'rowHeight', type: 'number', def: '44', desc: 'Approximate row height used to compute the scroll cap.' },
  { name: 'stickyHeader', type: 'boolean', def: 'true', desc: 'Pins the header during vertical scroll.' },
  { name: 'density', type: "'compact' | 'cozy' | 'comfortable'", def: "'cozy'", desc: 'Row padding scale.' },
  { name: 'loading', type: 'boolean', def: 'false', desc: 'Dims the body and overlays an inline spinner.' },
  { name: 'empty', type: 'ReactNode', def: '"No results"', desc: 'Replaces the row area when zero rows are visible.' },
  { name: 'search', type: '{ enabled, placeholder?, debounceMs?, predicate? }', def: '—', desc: 'Enables the toolbar search input. Without it the toolbar slot is hidden.' },
  { name: 'dateFilter', type: '{ column, monthsVisible?, placeholder? }', def: '—', desc: 'Bind a DateRangePicker to one column (date or time-of-day accessor).' },
  { name: 'timeFilter', type: '{ column, variant?, hourCycle?, minuteStep?, placeholder? }', def: '—', desc: 'Bind a TimeRangePicker to one column. Matches rows whose time-of-day falls in the Start–End window.' },
  { name: 'pagination', type: '{ pageSize?, siblingCount?, showSummary? } | false', def: '{ pageSize: 25 }', desc: 'Set to false to disable pagination and render every filtered row.' },
  { name: 'reorderable', type: 'boolean', def: 'true', desc: 'Drag a header to reorder columns. Pinned columns are skipped.' },
  { name: 'resizable', type: 'boolean', def: 'true', desc: 'Drag the right edge of a header to resize. Double-click resets.' },
  { name: 'columnMenu', type: 'boolean', def: 'true', desc: 'Show the Columns popover with per-column toggle + Reset + hidden-count chip.' },
  { name: 'fitColumns', type: 'boolean', def: 'false', desc: 'Force every column to share the container width. Ignores defaultWidth and resized widths, suppresses horizontal scroll, and wraps cell content onto multiple lines.' },
  { name: 'dataIO', type: '{ export?, import? }', def: '—', desc: 'Wire Export (CSV / JSON) and Import (file picker) buttons into the toolbar.' },
  { name: 'headerFont', type: 'string | FontSpec', def: 'system', desc: 'Font for the column-header zone. Pass family, or an object with size / weight / tracking / featureSettings.' },
  { name: 'rowHeaderFont', type: 'string | FontSpec', def: 'system', desc: 'Font for cells declared with isRowHeader.' },
  { name: 'cellFont', type: 'string | FontSpec', def: 'system', desc: 'Font for data cells. Per-column font overrides this.' },
  { name: 'storageKey', type: 'string', def: '—', desc: 'Persist column order, sizes, and hidden state in localStorage under this key.' },
];

const columnProps: PropRow[] = [
  { name: 'key', type: 'string', def: '—', desc: 'Stable identifier. Used in layout state and as React key.' },
  { name: 'header', type: 'string', def: '—', desc: 'Visible column-header label.' },
  { name: 'accessor', type: '(row: T) => unknown', def: '—', desc: 'Pulls the raw value used for search, filter, sort, export.' },
  { name: 'type', type: "'text' | 'number' | 'date' | 'time'", def: "'text'", desc: 'Drives default alignment, numeric formatting, and date/time filter binding.' },
  { name: 'cell', type: '(value, row) => ReactNode', def: '—', desc: 'Custom renderer. Defaults to the accessor stringified by type.' },
  { name: 'align', type: "'left' | 'right' | 'center'", def: "type==='number' ? 'right' : 'left'", desc: 'Cell + header alignment.' },
  { name: 'isRowHeader', type: 'boolean', def: 'false', desc: 'Renders cells in this column as <th scope="row"> and applies rowHeaderFont.' },
  { name: 'defaultWidth', type: 'number', def: '—', desc: 'Initial width in px. Flex when omitted.' },
  { name: 'minWidth / maxWidth', type: 'number', def: '80 / 2000', desc: 'Resize clamps.' },
  { name: 'resizable / reorderable / hideable', type: 'boolean', def: 'true', desc: 'Per-column toggles for the layout features.' },
  { name: 'defaultHidden', type: 'boolean', def: 'false', desc: 'Start hidden — appears in the Columns menu so it can be enabled.' },
  { name: 'pinned', type: "'left' | 'right'", def: '—', desc: 'Locks the column to one side and excludes it from reorder.' },
  { name: 'font', type: 'FontSpec', def: '—', desc: 'Overrides cellFont for this column only.' },
  { name: 'sortBy', type: '(row: T) => string | number | Date', def: 'accessor', desc: 'Override the value the sort comparator uses.' },
];

const paginationProps: PropRow[] = [
  { name: 'page', type: 'number', def: '—', desc: '1-indexed current page.' },
  { name: 'pageCount', type: 'number', def: '—', desc: 'Total page count.' },
  { name: 'onPageChange', type: '(page) => void', def: '—', desc: 'Page change callback.' },
  { name: 'siblingCount', type: 'number', def: '1', desc: 'How many pages to show on either side of the current.' },
  { name: 'showPrevNext', type: 'boolean', def: 'true', desc: 'Toggle the Prev / Next text buttons.' },
  { name: 'showSummary', type: 'boolean', def: 'false', desc: 'Render a "Page X of Y" summary on the left.' },
];

const dateRangeProps: PropRow[] = [
  { name: 'value / onChange', type: 'DateRange / (range) => void', def: '—', desc: 'Controlled range. defaultValue + uncontrolled also supported.' },
  { name: 'monthsVisible', type: 'number', def: '2', desc: 'Number of months rendered side by side in the popover.' },
  { name: 'weekStartsOn', type: '0..6', def: '0', desc: 'Sunday = 0.' },
  { name: 'minDate / maxDate', type: 'Date', def: '—', desc: 'Disable days outside the bounds.' },
  { name: 'presets', type: 'DatePreset[]', def: 'Today / 7d / 30d / This month / Last month', desc: 'Sidebar quick-select. Pass [] to remove the sidebar.' },
];

const timePickerProps: PropRow[] = [
  { name: 'value / onChange', type: 'TimeValue / (next) => void', def: '—', desc: 'Controlled time. TimeValue = { hours, minutes } in 24h.' },
  { name: 'variant', type: "'analog' | 'digital'", def: "'analog'", desc: 'Initial picker style.' },
  { name: 'switchable', type: 'boolean', def: 'true', desc: 'Lets the user switch between analog and digital from the panel.' },
  { name: 'hourCycle', type: '12 | 24', def: '24', desc: 'Digital picker shows an AM/PM pill when 12.' },
  { name: 'minuteStep', type: 'number', def: '1', desc: 'Minute snap.' },
];
