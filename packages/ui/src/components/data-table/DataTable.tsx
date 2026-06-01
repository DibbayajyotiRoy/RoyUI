'use client';

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type FontSpec,
} from '../table';
import { TableSearch } from '../table-search';
import { Pagination } from '../pagination';
import { DateRangePicker } from '../date-range-picker';
import type { DateRange } from '../date-range-picker';
import { TimeRangePicker, type TimeRangeValue } from '../time-picker';
import { ColumnMenu } from './ColumnMenu';
import { useTableLayout } from './useTableLayout';
import { applyFilters, applySort, paginate } from './filters';
import { downloadString, toCsv, toJson, fromCsv, fromJson } from './io';
import type {
  Column,
  DataTableProps,
  FilterState,
  SortDir,
} from './types';
import './DataTable.css';

function fontStyleFor(spec: FontSpec | undefined): CSSProperties | undefined {
  if (!spec) return undefined;
  if (typeof spec === 'string') return { fontFamily: spec };
  const s: CSSProperties = {};
  if (spec.family) s.fontFamily = spec.family;
  if (spec.size != null)
    s.fontSize = typeof spec.size === 'number' ? `${spec.size}px` : spec.size;
  if (spec.weight != null) s.fontWeight = spec.weight as number;
  if (spec.letterSpacing) s.letterSpacing = spec.letterSpacing;
  if (spec.featureSettings) s.fontFeatureSettings = spec.featureSettings;
  return s;
}

function renderCellValue(value: unknown, type?: Column<unknown>['type']): string {
  if (value == null) return '';
  if (value instanceof Date) {
    if (type === 'time') {
      return value.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (type === 'date') {
      return value.toLocaleDateString();
    }
    return value.toLocaleString();
  }
  return String(value);
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  visibleRows = 7,
  rowHeight = 44,
  stickyHeader = true,
  density = 'cozy',
  loading,
  empty,
  fitColumns = false,
  search,
  dateFilter,
  timeFilter,
  pagination,
  reorderable = true,
  resizable = true,
  columnMenu = true,
  dataIO,
  headerFont,
  rowHeaderFont,
  cellFont,
  storageKey,
  className = '',
  toolbarExtras,
}: DataTableProps<T>) {
  const {
    layout,
    orderedColumns,
    visibleColumns,
    reorder,
    resize,
    toggleHidden,
    reset,
  } = useTableLayout(columns, storageKey);

  /* ── filter state ─────────────────────────────────────── */
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateRange: { from: null, to: null },
    timeRange: { from: null, to: null },
  });
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(null);
  const pageSize = pagination === false ? Infinity : pagination?.pageSize ?? 25;
  const [page, setPage] = useState(1);

  /* ── pipeline ─────────────────────────────────────────── */
  const filtered = useMemo(
    () =>
      applyFilters(data, columns, filters, {
        dateColumn: dateFilter?.column,
        timeColumn: timeFilter?.column,
        searchPredicate: search?.predicate,
      }),
    [data, columns, filters, dateFilter?.column, timeFilter?.column, search?.predicate],
  );

  const sorted = useMemo(() => applySort(filtered, columns, sort), [filtered, columns, sort]);

  const pageCount = pagination === false ? 1 : Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  const pageRows = useMemo(
    () => (pagination === false ? sorted : paginate(sorted, currentPage, pageSize)),
    [pagination, sorted, currentPage, pageSize],
  );

  /* ── column drag reorder ──────────────────────────────── */
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const onDragStart = (e: DragEvent<HTMLTableCellElement>, key: string) => {
    if (!reorderable) return;
    setDragKey(key);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', key);
    } catch {
      /* IE/Safari quirks */
    }
  };

  const onDragOver = (e: DragEvent<HTMLTableCellElement>, idx: number) => {
    if (!reorderable || !dragKey) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const isRight = e.clientX - rect.left > rect.width / 2;
    setDropIndex(idx + (isRight ? 1 : 0));
  };

  const onDrop = (e: DragEvent<HTMLTableCellElement>) => {
    if (!reorderable || !dragKey || dropIndex == null) return;
    e.preventDefault();
    reorder(dragKey, dropIndex);
    setDragKey(null);
    setDropIndex(null);
  };

  const onDragEnd = () => {
    setDragKey(null);
    setDropIndex(null);
  };

  /* ── column resize ────────────────────────────────────── */
  const resizingKey = useRef<string | null>(null);
  const resizeStartX = useRef(0);
  const resizeStartW = useRef(0);

  const beginResize = (
    e: ReactPointerEvent<HTMLSpanElement>,
    key: string,
  ) => {
    if (!resizable) return;
    e.stopPropagation();
    e.preventDefault();
    const th = (e.currentTarget.parentElement as HTMLElement) ?? null;
    const startW = th ? th.getBoundingClientRect().width : 120;
    resizingKey.current = key;
    resizeStartX.current = e.clientX;
    resizeStartW.current = startW;
    window.addEventListener('pointermove', onResizeMove);
    window.addEventListener('pointerup', endResize);
  };

  const onResizeMove = (e: PointerEvent) => {
    if (!resizingKey.current) return;
    const dx = e.clientX - resizeStartX.current;
    const col = columns.find((c) => c.key === resizingKey.current);
    const min = col?.minWidth ?? 80;
    const max = col?.maxWidth ?? 2000;
    const next = Math.max(min, Math.min(max, resizeStartW.current + dx));
    resize(resizingKey.current, next);
  };

  const endResize = () => {
    resizingKey.current = null;
    window.removeEventListener('pointermove', onResizeMove);
    window.removeEventListener('pointerup', endResize);
  };

  const doubleClickReset = (key: string) => resize(key, null);

  /* ── sort handler ─────────────────────────────────────── */
  const cycleSort = useCallback((key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  }, []);

  /* ── data IO ──────────────────────────────────────────── */
  const fileInput = useRef<HTMLInputElement>(null);
  const [ioFlash, setIoFlash] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flash = (text: string, ms = 1400) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setIoFlash(text);
    flashTimer.current = setTimeout(() => setIoFlash(null), ms);
  };

  const exportRows = (format: 'csv' | 'json') => {
    if (!dataIO?.export) return;
    const scope = dataIO.export.scope ?? 'filtered';
    let rows: T[];
    if (scope === 'all') rows = data;
    else if (scope === 'page') rows = pageRows;
    else rows = sorted;

    const cols = visibleColumns;
    const text = dataIO.export.serialize
      ? dataIO.export.serialize(rows, cols, format)
      : format === 'csv'
        ? toCsv(rows, cols)
        : toJson(rows, cols);

    const baseName =
      typeof dataIO.export.filename === 'function'
        ? dataIO.export.filename()
        : dataIO.export.filename ?? 'table-export';
    const filename = `${baseName}.${format}`;
    const mime = format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json';
    downloadString(text, filename, mime);
    flash('Exported');
  };

  const onPickFile = async (file: File) => {
    if (!dataIO?.import) return;
    const text = await file.text();
    try {
      const parsed = dataIO.import.parse
        ? await dataIO.import.parse(text, file)
        : file.name.endsWith('.json')
          ? (fromJson(text) as T[])
          : (fromCsv(text) as unknown as T[]);
      dataIO.import.onImport(parsed as T[], {
        mode: dataIO.import.mode ?? 'replace',
        file,
      });
      flash(`Imported ${parsed.length} ${parsed.length === 1 ? 'row' : 'rows'}`);
    } catch (err) {
      dataIO.import.onError?.(err, file);
      flash("Couldn't read file", 2000);
    }
  };

  /* ── render ───────────────────────────────────────────── */

  const showToolbar =
    search?.enabled ||
    !!dateFilter ||
    !!timeFilter ||
    columnMenu ||
    !!dataIO?.export?.enabled ||
    !!dataIO?.import?.enabled ||
    !!toolbarExtras;

  const exportFormats = dataIO?.export?.formats ?? ['csv', 'json'];
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  return (
    <div className={['royui-dt', className].filter(Boolean).join(' ')}>
      {showToolbar && (
        <div className="royui-dt__toolbar">
          <div className="royui-dt__toolbar-left">
            {search?.enabled && (
              <TableSearch
                value={filters.search}
                onChange={(v) => {
                  setFilters((f) => ({ ...f, search: v }));
                  setPage(1);
                }}
                placeholder={search.placeholder}
                debounceMs={search.debounceMs}
              />
            )}
            {dateFilter && (
              <DateRangePicker
                value={filters.dateRange}
                onChange={(r) => {
                  setFilters((f) => ({ ...f, dateRange: r }));
                  setPage(1);
                }}
                monthsVisible={dateFilter.monthsVisible ?? 2}
                placeholder={dateFilter.placeholder ?? 'Date range'}
              />
            )}
            {timeFilter && (
              <TimeRangePicker
                value={filters.timeRange}
                onChange={(r: TimeRangeValue) => {
                  setFilters((f) => ({ ...f, timeRange: r }));
                  setPage(1);
                }}
                variant={timeFilter.variant ?? 'analog'}
                hourCycle={timeFilter.hourCycle ?? 24}
                minuteStep={timeFilter.minuteStep ?? 1}
                placeholder={timeFilter.placeholder ?? 'Time range'}
              />
            )}
          </div>

          <div className="royui-dt__toolbar-right">
            {toolbarExtras}
            {columnMenu && (
              <ColumnMenu
                columns={orderedColumns}
                layout={layout}
                onToggle={toggleHidden}
                onReset={reset}
              />
            )}
            {(dataIO?.export?.enabled || dataIO?.import?.enabled) && (
              <span className="royui-dt__sep" aria-hidden>·</span>
            )}
            {dataIO?.export?.enabled && (
              <div className="royui-dt-io">
                <button
                  type="button"
                  className="royui-dt-io__btn"
                  onClick={() => {
                    const only = exportFormats[0];
                    if (exportFormats.length === 1 && only) {
                      exportRows(only);
                    } else {
                      setExportMenuOpen((o) => !o);
                    }
                  }}
                >
                  {ioFlash && ioFlash.startsWith('Export') ? ioFlash : 'Export'}
                </button>
                {exportMenuOpen && exportFormats.length > 1 && (
                  <div
                    className="royui-dt-io__menu"
                    onMouseLeave={() => setExportMenuOpen(false)}
                  >
                    {exportFormats.map((f) => (
                      <button
                        key={f}
                        type="button"
                        className="royui-dt-io__menu-item"
                        onClick={() => {
                          exportRows(f);
                          setExportMenuOpen(false);
                        }}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {dataIO?.import?.enabled && (
              <>
                <button
                  type="button"
                  className="royui-dt-io__btn"
                  onClick={() => fileInput.current?.click()}
                >
                  {ioFlash && (ioFlash.startsWith('Import') || ioFlash.startsWith("Couldn't"))
                    ? ioFlash
                    : 'Import'}
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept={dataIO.import.accept ?? '.csv,.json'}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onPickFile(f);
                    e.target.value = '';
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}

      <Table
        visibleRows={visibleRows}
        rowHeight={rowHeight}
        stickyHeader={stickyHeader}
        density={density}
        loading={loading}
        empty={empty}
        isEmpty={pageRows.length === 0}
        fitColumns={fitColumns}
        headerFont={headerFont}
        rowHeaderFont={rowHeaderFont}
        cellFont={cellFont}
      >
        <colgroup>
          {visibleColumns.map((c) => {
            const w = fitColumns ? undefined : layout.sizes[c.key];
            return (
              <col
                key={c.key}
                style={w ? { width: w } : undefined}
                className={dragKey === c.key ? 'royui-dt__col--dragging' : undefined}
              />
            );
          })}
        </colgroup>

        <TableHeader>
          <TableRow>
            {visibleColumns.map((c, idx) => {
              const isDragging = dragKey === c.key;
              const showDropBefore = dropIndex === idx;
              const sortDir =
                sort && sort.key === c.key && sort.dir ? sort.dir : null;
              const canReorder = reorderable && c.reorderable !== false && !c.pinned;
              const canResize = resizable && c.resizable !== false;

              return (
                <TableHead
                  key={c.key}
                  align={c.align ?? (c.type === 'number' ? 'right' : 'left')}
                  className={[
                    'royui-dt__th',
                    canReorder && 'royui-dt__th--reorderable',
                    canResize && 'royui-dt__th--resizable',
                    isDragging && 'royui-dt__th--dragging',
                    showDropBefore && 'royui-dt__th--drop-before',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  draggable={canReorder}
                  onDragStart={(e) => onDragStart(e, c.key)}
                  onDragOver={(e) => onDragOver(e, idx)}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                  title={
                    canReorder && canResize
                      ? 'Drag to reorder · drag the right edge to resize'
                      : canReorder
                        ? 'Drag to reorder'
                        : canResize
                          ? 'Drag the right edge to resize'
                          : undefined
                  }
                >
                  <span
                    className="royui-dt__th-inner"
                    onClick={() => cycleSort(c.key)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        cycleSort(c.key);
                      }
                    }}
                  >
                    <span className="royui-dt__th-label">{c.header}</span>
                    {sortDir && (
                      <span
                        className={`royui-dt__sort-indicator royui-dt__sort-indicator--${sortDir}`}
                        aria-hidden
                      />
                    )}
                  </span>
                  {canResize && (
                    <span
                      className="royui-dt__resize"
                      onPointerDown={(e) => beginResize(e, c.key)}
                      onDoubleClick={() => doubleClickReset(c.key)}
                      aria-hidden
                    >
                      <span className="royui-dt__resize-bar" aria-hidden />
                    </span>
                  )}
                </TableHead>
              );
            })}
            {dropIndex === visibleColumns.length && (
              <TableHead className="royui-dt__th--drop-end" aria-hidden />
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageRows.map((row, i) => {
            const id = getRowId
              ? getRowId(row, i)
              : (row as Record<string, unknown>)?.['id'] != null
                ? String((row as Record<string, unknown>)['id'])
                : i;
            return (
              <TableRow key={id as string | number}>
                {visibleColumns.map((c) => {
                  const value = c.accessor(row);
                  const display = c.cell ? c.cell(value, row) : renderCellValue(value, c.type);
                  const cellStyle = fontStyleFor(c.font);
                  const isNum = c.type === 'number';
                  return (
                    <TableCell
                      key={c.key}
                      isRowHeader={c.isRowHeader}
                      align={c.align ?? (isNum ? 'right' : 'left')}
                      className={isNum ? 'royui-table__td--num' : undefined}
                      style={cellStyle}
                    >
                      {display}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {pagination !== false && pageCount > 1 && (
        <div className="royui-dt__pagination">
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
            siblingCount={pagination?.siblingCount ?? 1}
            showSummary={pagination?.showSummary ?? true}
            summaryRender={(p, pc) =>
              `${(p - 1) * pageSize + 1}–${Math.min(p * pageSize, sorted.length)} of ${sorted.length}`
            }
          />
        </div>
      )}
    </div>
  );
}
