import type { Column } from './types';

/* ────────────────────────────────────────────────────────────
   CSV  (RFC 4180)
   ──────────────────────────────────────────────────────────── */

function csvEscape(v: unknown): string {
  if (v == null) return '';
  const s = typeof v === 'string' ? v : v instanceof Date ? v.toISOString() : String(v);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsv<T>(rows: T[], cols: Column<T>[]): string {
  const visible = cols.filter((c) => !c.defaultHidden);
  const header = visible.map((c) => csvEscape(c.header)).join(',');
  const body = rows
    .map((row) =>
      visible.map((c) => csvEscape(c.accessor(row))).join(','),
    )
    .join('\n');
  return body ? `${header}\n${body}` : header;
}

export function fromCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let i = 0;
  let inQuotes = false;
  const len = text.length;

  while (i < len) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ',') {
      cur.push(field);
      field = '';
      i++;
      continue;
    }
    if (ch === '\r') {
      i++;
      continue;
    }
    if (ch === '\n') {
      cur.push(field);
      rows.push(cur);
      cur = [];
      field = '';
      i++;
      continue;
    }
    field += ch;
    i++;
  }
  if (field.length > 0 || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }

  if (rows.length === 0) return [];
  const head = rows[0] ?? [];
  const body = rows.slice(1);
  return body.map((r) => {
    const obj: Record<string, string> = {};
    head.forEach((h, idx) => {
      obj[h] = r[idx] ?? '';
    });
    return obj;
  });
}

/* ────────────────────────────────────────────────────────────
   JSON
   ──────────────────────────────────────────────────────────── */

export function toJson<T>(rows: T[], cols: Column<T>[]): string {
  const visible = cols.filter((c) => !c.defaultHidden);
  const out = rows.map((row) => {
    const obj: Record<string, unknown> = {};
    visible.forEach((c) => {
      obj[c.key] = c.accessor(row);
    });
    return obj;
  });
  return JSON.stringify(out, null, 2);
}

export function fromJson<T>(text: string): T[] {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) {
    throw new Error('Expected a JSON array of rows');
  }
  return parsed as T[];
}

/* ────────────────────────────────────────────────────────────
   Download trigger
   ──────────────────────────────────────────────────────────── */

export function downloadString(text: string, filename: string, mime: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
