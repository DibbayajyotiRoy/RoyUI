// Read / write a nested value object by a dot/bracket path string such as
// "email", "address.city", or "phones.0.number". Flat for Phase 1 fields,
// array-ready for later phases. All writes are immutable — they clone only the
// spine along the path, so sibling values keep their reference identity (which
// is what lets per-field store subscriptions skip re-rendering untouched
// fields). Written to be safe under `noUncheckedIndexedAccess`.

/** Split a path into segments, normalising bracket access to dot segments. */
function segments(path: string): string[] {
  return path
    .replace(/\[(\w+)\]/g, '.$1')
    .split('.')
    .filter((s) => s.length > 0);
}

export function getPath(obj: unknown, path: string): unknown {
  if (!path) return obj;
  let cur: unknown = obj;
  for (const seg of segments(path)) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[seg];
  }
  return cur;
}

export function setPath<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown,
): T {
  const segs = segments(path);
  if (segs.length === 0) return obj;

  const root: Record<string, unknown> = { ...obj };
  let cur = root;
  for (let i = 0; i < segs.length - 1; i++) {
    const seg = segs[i]!;
    const next = cur[seg];
    const childIsIndex = /^\d+$/.test(segs[i + 1]!);
    if (Array.isArray(next)) {
      cur[seg] = [...next];
    } else if (next != null && typeof next === 'object') {
      cur[seg] = { ...(next as Record<string, unknown>) };
    } else {
      cur[seg] = childIsIndex ? [] : {};
    }
    cur = cur[seg] as Record<string, unknown>;
  }
  cur[segs[segs.length - 1]!] = value;
  return root as T;
}

export function deletePath<T extends Record<string, unknown>>(obj: T, path: string): T {
  const segs = segments(path);
  if (segs.length === 0) return obj;

  const root: Record<string, unknown> = { ...obj };
  let cur = root;
  for (let i = 0; i < segs.length - 1; i++) {
    const seg = segs[i]!;
    const next = cur[seg];
    if (next == null || typeof next !== 'object') return obj; // nothing to delete
    cur[seg] = Array.isArray(next) ? [...next] : { ...(next as Record<string, unknown>) };
    cur = cur[seg] as Record<string, unknown>;
  }
  delete cur[segs[segs.length - 1]!];
  return root as T;
}
