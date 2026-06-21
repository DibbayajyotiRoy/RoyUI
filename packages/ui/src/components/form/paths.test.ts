import { describe, it, expect } from 'vitest';
import { getPath, setPath, deletePath } from './paths';

describe('getPath', () => {
  it('reads flat and nested values', () => {
    const obj = { email: 'a@b.com', address: { city: 'Pune' }, items: [{ price: 5 }] };
    expect(getPath(obj, 'email')).toBe('a@b.com');
    expect(getPath(obj, 'address.city')).toBe('Pune');
    expect(getPath(obj, 'items.0.price')).toBe(5);
    expect(getPath(obj, 'items[0].price')).toBe(5);
  });

  it('returns undefined for missing paths without throwing', () => {
    expect(getPath({ a: 1 }, 'b')).toBeUndefined();
    expect(getPath({ a: { b: 1 } }, 'a.c.d')).toBeUndefined();
    expect(getPath(null, 'a')).toBeUndefined();
    expect(getPath({}, '')).toEqual({});
  });
});

describe('setPath', () => {
  it('sets flat values immutably', () => {
    const obj = { a: 1, b: 2 };
    const next = setPath(obj, 'a', 9);
    expect(next).toEqual({ a: 9, b: 2 });
    expect(obj).toEqual({ a: 1, b: 2 }); // original untouched
    expect(next).not.toBe(obj);
  });

  it('preserves sibling reference identity (drives subscription bail-out)', () => {
    const sibling = { keep: true };
    const obj = { a: 1, nested: sibling };
    const next = setPath(obj, 'a', 2);
    expect(next.nested).toBe(sibling); // untouched branch keeps its ref
  });

  it('creates nested objects and arrays as needed', () => {
    expect(setPath({}, 'address.city', 'Pune')).toEqual({ address: { city: 'Pune' } });
    expect(setPath({}, 'items.0.price', 5)).toEqual({ items: [{ price: 5 }] });
  });

  it('clones only the spine, keeping untouched array items', () => {
    const item0 = { price: 1 };
    const item1 = { price: 2 };
    const obj = { items: [item0, item1] };
    const next = setPath(obj, 'items.1.price', 99);
    const items = next.items as typeof obj.items;
    expect(next.items).not.toBe(obj.items);
    expect(items[0]).toBe(item0); // untouched item kept
    expect(items[1]).not.toBe(item1);
    expect(items[1]!.price).toBe(99);
  });
});

describe('deletePath', () => {
  it('removes a flat key immutably', () => {
    const obj = { a: 1, b: 2 };
    const next = deletePath(obj, 'a');
    expect(next).toEqual({ b: 2 });
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it('removes a nested key and leaves missing paths untouched', () => {
    expect(deletePath({ a: { b: 1, c: 2 } }, 'a.b')).toEqual({ a: { c: 2 } });
    const obj = { a: 1 };
    expect(deletePath(obj, 'x.y')).toBe(obj); // no-op returns same ref
  });
});
