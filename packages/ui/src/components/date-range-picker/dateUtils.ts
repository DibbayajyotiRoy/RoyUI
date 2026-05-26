export type DateRange = { from: Date | null; to: Date | null };

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function startOfDay(d: Date): Date {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addMonths(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(1);
  x.setMonth(x.getMonth() + n);
  return x;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function isBefore(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}

export function isAfter(a: Date, b: Date): boolean {
  return a.getTime() > b.getTime();
}

export function isBetween(d: Date, from: Date, to: Date): boolean {
  const t = d.getTime();
  const a = Math.min(from.getTime(), to.getTime());
  const b = Math.max(from.getTime(), to.getTime());
  return t >= a && t <= b;
}

export function clampToBounds(d: Date, min?: Date | null, max?: Date | null): Date {
  let r = d;
  if (min && isBefore(r, min)) r = min;
  if (max && isAfter(r, max)) r = max;
  return r;
}

export type DayCell = {
  date: Date;
  inMonth: boolean;
  iso: string;
};

/** Returns 6 rows × 7 days = 42 cells covering the month, padded with neighbors. */
export function getMonthGrid(year: number, month: number, weekStartsOn = 0): DayCell[] {
  const first = new Date(year, month, 1);
  const firstDow = first.getDay();
  const offset = (firstDow - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -offset);
  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = addDays(gridStart, i);
    cells.push({
      date,
      inMonth: date.getMonth() === month,
      iso: date.toISOString().slice(0, 10),
    });
  }
  return cells;
}

export function getWeekdayLabels(weekStartsOn = 0): string[] {
  return Array.from({ length: 7 }, (_, i) => WEEKDAYS[(weekStartsOn + i) % 7] ?? '');
}

export function formatMonthYear(d: Date): string {
  return `${MONTHS[d.getMonth()] ?? ''} ${d.getFullYear()}`;
}

export function formatShort(d: Date | null): string {
  if (!d) return '';
  const m = SHORT_MONTHS[d.getMonth()] ?? '';
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return sameYear
    ? `${m} ${d.getDate()}`
    : `${m} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatRange(range: DateRange): string {
  if (!range.from && !range.to) return '';
  if (range.from && !range.to) return formatShort(range.from);
  if (!range.from && range.to) return formatShort(range.to);
  if (isSameDay(range.from, range.to)) return formatShort(range.from);
  return `${formatShort(range.from)} – ${formatShort(range.to)}`;
}
