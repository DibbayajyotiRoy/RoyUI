import type { ReactNode } from 'react';
import type { FontSpec, TableDensity } from '../table';
import type { DateRange } from '../date-range-picker';
import type { TimeValue, TimePickerVariant } from '../time-picker';

export type ColumnType = 'text' | 'number' | 'date' | 'time';

export type Column<T> = {
  key: string;
  header: string;
  accessor: (row: T) => unknown;
  type?: ColumnType;
  align?: 'left' | 'right' | 'center';

  /** Marks this column as the row-header cell (<th scope="row">). At most one per table. */
  isRowHeader?: boolean;

  /** Custom per-cell renderer. Falls back to the accessor's stringified value. */
  cell?: (value: unknown, row: T) => ReactNode;

  /** Initial pixel width. Resizable still by default. */
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  reorderable?: boolean;
  hideable?: boolean;
  defaultHidden?: boolean;
  pinned?: 'left' | 'right';

  /** Override the per-cell font for this column only (data cells; header stays unified). */
  font?: FontSpec;

  /** Override the comparator used when sorting this column. */
  sortBy?: (row: T) => string | number | Date;
};

export interface DataIO<T> {
  export?: {
    enabled: boolean;
    formats?: ('csv' | 'json')[];
    filename?: string | (() => string);
    scope?: 'all' | 'filtered' | 'page';
    serialize?: (rows: T[], cols: Column<T>[], format: 'csv' | 'json') => string;
  };
  import?: {
    enabled: boolean;
    accept?: string;
    parse?: (text: string, file: File) => T[] | Promise<T[]>;
    onImport: (rows: T[], info: { mode: 'replace' | 'append'; file: File }) => void;
    mode?: 'replace' | 'append';
    onError?: (err: unknown, file: File) => void;
  };
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  /** Stable row key. Defaults to the index. */
  getRowId?: (row: T, index: number) => string | number;

  visibleRows?: number;
  rowHeight?: number;
  stickyHeader?: boolean;
  density?: TableDensity;
  loading?: boolean;
  empty?: ReactNode;
  /**
   * Force every column to fit in the container — disables horizontal scroll
   * and ignores `defaultWidth` / resized widths so columns share the width
   * equally. Cell content wraps. Resize handles still draw, but their effect
   * is clamped by the container.
   */
  fitColumns?: boolean;

  /** Toolbar — search. */
  search?: {
    enabled: boolean;
    placeholder?: string;
    debounceMs?: number;
    /** Override the default per-column substring match. */
    predicate?: (row: T, query: string, columns: Column<T>[]) => boolean;
  };

  /** Toolbar — date range filter against one column. */
  dateFilter?: {
    column: string;
    monthsVisible?: number;
    placeholder?: string;
  };

  /** Toolbar — time filter against one column. */
  timeFilter?: {
    column: string;
    variant?: TimePickerVariant;
    hourCycle?: 12 | 24;
    placeholder?: string;
    /** Tolerance in minutes around the chosen time. Default 0 (exact). */
    toleranceMinutes?: number;
  };

  /** Pagination. Pass `false` to disable. */
  pagination?: {
    pageSize?: number;
    siblingCount?: number;
    showSummary?: boolean;
  } | false;

  /** Column reorder. Default true. */
  reorderable?: boolean;
  /** Column resize. Default true. */
  resizable?: boolean;

  /** Show the "Columns" menu in the toolbar. Default true. */
  columnMenu?: boolean;

  /** Data export / import wiring. */
  dataIO?: DataIO<T>;

  /** Per-zone typography. */
  headerFont?: FontSpec;
  rowHeaderFont?: FontSpec;
  cellFont?: FontSpec;

  /** Persist layout state (order, sizes, hidden) under this key in localStorage. */
  storageKey?: string;

  className?: string;
  /** Slot rendered between the toolbar and the table. */
  toolbarExtras?: ReactNode;
}

export type SortDir = 'asc' | 'desc' | null;

export type TableLayout = {
  order: string[];
  sizes: Record<string, number>;
  hidden: string[];
};

export interface FilterState {
  search: string;
  dateRange: DateRange;
  time: TimeValue | null;
}
