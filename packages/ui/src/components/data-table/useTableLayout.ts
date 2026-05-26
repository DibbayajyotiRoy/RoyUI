'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Column, TableLayout } from './types';

function defaultLayout<T>(columns: Column<T>[]): TableLayout {
  return {
    order: columns.map((c) => c.key),
    sizes: columns.reduce<Record<string, number>>((acc, c) => {
      if (c.defaultWidth != null) acc[c.key] = c.defaultWidth;
      return acc;
    }, {}),
    hidden: columns.filter((c) => c.defaultHidden).map((c) => c.key),
  };
}

function loadLayout(key: string | undefined): TableLayout | null {
  if (!key || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as TableLayout;
  } catch {
    return null;
  }
}

function saveLayout(key: string | undefined, layout: TableLayout): void {
  if (!key || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(layout));
  } catch {
    // ignore
  }
}

export function useTableLayout<T>(columns: Column<T>[], storageKey?: string) {
  const initial = useMemo<TableLayout>(() => {
    return loadLayout(storageKey) ?? defaultLayout(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [layout, setLayout] = useState<TableLayout>(initial);

  useEffect(() => {
    // reconcile if columns change: drop unknown keys, append new ones at the end
    setLayout((prev) => {
      const known = new Set(columns.map((c) => c.key));
      const order = prev.order.filter((k) => known.has(k));
      columns.forEach((c) => {
        if (!order.includes(c.key)) order.push(c.key);
      });
      const sizes: Record<string, number> = {};
      Object.entries(prev.sizes).forEach(([k, v]) => {
        if (known.has(k)) sizes[k] = v;
      });
      const hidden = prev.hidden.filter((k) => known.has(k));
      return { order, sizes, hidden };
    });
  }, [columns]);

  useEffect(() => {
    saveLayout(storageKey, layout);
  }, [layout, storageKey]);

  const orderedColumns = useMemo(() => {
    const pinnedLeft = columns.filter((c) => c.pinned === 'left');
    const pinnedRight = columns.filter((c) => c.pinned === 'right');
    const pinnedKeys = new Set(
      [...pinnedLeft, ...pinnedRight].map((c) => c.key),
    );
    const rest = layout.order
      .filter((k) => !pinnedKeys.has(k))
      .map((k) => columns.find((c) => c.key === k))
      .filter(Boolean) as Column<T>[];
    return [...pinnedLeft, ...rest, ...pinnedRight];
  }, [columns, layout.order]);

  const visibleColumns = useMemo(
    () => orderedColumns.filter((c) => !layout.hidden.includes(c.key)),
    [orderedColumns, layout.hidden],
  );

  const reorder = useCallback((key: string, toIndex: number) => {
    setLayout((prev) => {
      const order = [...prev.order];
      const from = order.indexOf(key);
      if (from === -1 || from === toIndex) return prev;
      const [item] = order.splice(from, 1);
      const insertAt = toIndex > from ? toIndex - 1 : toIndex;
      order.splice(Math.max(0, Math.min(insertAt, order.length)), 0, item);
      return { ...prev, order };
    });
  }, []);

  const resize = useCallback((key: string, px: number | null) => {
    setLayout((prev) => {
      const sizes = { ...prev.sizes };
      if (px == null) delete sizes[key];
      else sizes[key] = Math.max(40, Math.round(px));
      return { ...prev, sizes };
    });
  }, []);

  const toggleHidden = useCallback((key: string) => {
    setLayout((prev) => {
      const hidden = prev.hidden.includes(key)
        ? prev.hidden.filter((k) => k !== key)
        : [...prev.hidden, key];
      return { ...prev, hidden };
    });
  }, []);

  const reset = useCallback(() => {
    setLayout(defaultLayout(columns));
  }, [columns]);

  return {
    layout,
    orderedColumns,
    visibleColumns,
    reorder,
    resize,
    toggleHidden,
    reset,
  };
}
