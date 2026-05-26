import type { Column, FilterState, SortDir } from './types';
import { isBetween, startOfDay } from '../date-range-picker';

export function defaultSearchPredicate<T>(
  row: T,
  query: string,
  columns: Column<T>[],
): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return columns.some((c) => {
    const v = c.accessor(row);
    if (v == null) return false;
    const s = v instanceof Date ? v.toLocaleString() : String(v);
    return s.toLowerCase().includes(q);
  });
}

export function applyFilters<T>(
  rows: T[],
  columns: Column<T>[],
  filters: FilterState,
  cfg: {
    dateColumn?: string;
    timeColumn?: string;
    timeTolerance?: number;
    searchPredicate?: (row: T, q: string, cols: Column<T>[]) => boolean;
  },
): T[] {
  const searchFn = cfg.searchPredicate ?? defaultSearchPredicate;

  return rows.filter((row) => {
    if (filters.search && !searchFn(row, filters.search, columns)) return false;

    if (cfg.dateColumn && (filters.dateRange.from || filters.dateRange.to)) {
      const col = columns.find((c) => c.key === cfg.dateColumn);
      if (col) {
        const raw = col.accessor(row);
        const d = raw instanceof Date ? raw : raw ? new Date(raw as string | number) : null;
        if (!d || isNaN(d.getTime())) return false;
        const day = startOfDay(d);
        const from = filters.dateRange.from ?? day;
        const to = filters.dateRange.to ?? filters.dateRange.from ?? day;
        if (!isBetween(day, startOfDay(from), startOfDay(to))) return false;
      }
    }

    if (cfg.timeColumn && filters.time) {
      const col = columns.find((c) => c.key === cfg.timeColumn);
      if (col) {
        const raw = col.accessor(row);
        const d = raw instanceof Date ? raw : raw ? new Date(raw as string | number) : null;
        if (!d || isNaN(d.getTime())) return false;
        const rowMin = d.getHours() * 60 + d.getMinutes();
        const filterMin = filters.time.hours * 60 + filters.time.minutes;
        const tol = cfg.timeTolerance ?? 0;
        if (Math.abs(rowMin - filterMin) > tol) return false;
      }
    }

    return true;
  });
}

export function applySort<T>(
  rows: T[],
  columns: Column<T>[],
  sort: { key: string; dir: SortDir } | null,
): T[] {
  if (!sort || !sort.dir) return rows;
  const col = columns.find((c) => c.key === sort.key);
  if (!col) return rows;
  const dirMul = sort.dir === 'asc' ? 1 : -1;
  const getter = col.sortBy ?? col.accessor;
  return [...rows].sort((a, b) => {
    const av = getter(a) as string | number | Date;
    const bv = getter(b) as string | number | Date;
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (av instanceof Date && bv instanceof Date) {
      return (av.getTime() - bv.getTime()) * dirMul;
    }
    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * dirMul;
    }
    return String(av).localeCompare(String(bv)) * dirMul;
  });
}

export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}
