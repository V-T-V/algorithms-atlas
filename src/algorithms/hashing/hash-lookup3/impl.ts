// Jenkins lookup3 32-bit · 实现
const MASK32 = 0xffffffff;
function rot(x: number, k: number): number {
  return ((x << k) | (x >>> (32 - k))) & MASK32;
}
function mix(a: number, b: number, c: number): [number, number, number] {
  a = (a - b - c) & MASK32;
  a ^= rot(c, 4);
  c = (c + a) & MASK32;
  b = (b - c - a) & MASK32;
  b ^= rot(a, 6);
  a = (a + b) & MASK32;
  c = (c - a - b) & MASK32;
  c ^= rot(b, 8);
  b = (b + c) & MASK32;
  a = (a - b - c) & MASK32;
  a ^= rot(c, 16);
  c = (c + a) & MASK32;
  b = (b - c - a) & MASK32;
  b ^= rot(a, 19);
  a = (a + b) & MASK32;
  c = (c - a - b) & MASK32;
  c ^= rot(b, 4);
  b = (b + c) & MASK32;
  return [a, b, c];
}
function final(a: number, b: number, c: number): number {
  c ^= b;
  c = (c - rot(b, 14)) & MASK32;
  a ^= c;
  a = (a - rot(c, 11)) & MASK32;
  b ^= a;
  b = (b - rot(a, 25)) & MASK32;
  c ^= b;
  c = (c - rot(b, 16)) & MASK32;
  a ^= c;
  a = (a - rot(c, 4)) & MASK32;
  b ^= a;
  b = (b - rot(a, 14)) & MASK32;
  c ^= b;
  c = (c - rot(b, 24)) & MASK32;
  return c >>> 0;
}
export interface Lookup3Hooks {
  onChunk?: (offset: number, c: number) => void;
  onResult?: (hash: number) => void;
}
export function hashLookup3(
  data: string | readonly number[],
  initval = 0,
  hooks: Lookup3Hooks = {},
): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const len = bytes.length;
  let a = (0xdeadbeef + len + initval) & MASK32;
  let b = a;
  let c = a;
  let i = 0;
  while (i + 12 <= len) {
    a =
      (a + (bytes[i]! | (bytes[i + 1]! << 8) | (bytes[i + 2]! << 16) | (bytes[i + 3]! << 24))) &
      MASK32;
    b =
      (b + (bytes[i + 4]! | (bytes[i + 5]! << 8) | (bytes[i + 6]! << 16) | (bytes[i + 7]! << 24))) &
      MASK32;
    c =
      (c +
        (bytes[i + 8]! | (bytes[i + 9]! << 8) | (bytes[i + 10]! << 16) | (bytes[i + 11]! << 24))) &
      MASK32;
    [a, b, c] = mix(a, b, c);
    hooks.onChunk?.(i, c);
    i += 12;
  }
  c = (c + len) & MASK32;
  const rem = len - i;
  if (rem >= 11) c = (c + (bytes[i + 10]! << 24)) & MASK32;
  if (rem >= 10) c = (c + (bytes[i + 9]! << 16)) & MASK32;
  if (rem >= 9) c = (c + (bytes[i + 8]! << 8)) & MASK32;
  if (rem >= 8) b = (b + (bytes[i + 7]! << 24)) & MASK32;
  if (rem >= 7) b = (b + (bytes[i + 6]! << 16)) & MASK32;
  if (rem >= 6) b = (b + (bytes[i + 5]! << 8)) & MASK32;
  if (rem >= 5) b = (b + bytes[i + 4]!) & MASK32;
  if (rem >= 4) a = (a + (bytes[i + 3]! << 24)) & MASK32;
  if (rem >= 3) a = (a + (bytes[i + 2]! << 16)) & MASK32;
  if (rem >= 2) a = (a + (bytes[i + 1]! << 8)) & MASK32;
  if (rem >= 1) a = (a + bytes[i]!) & MASK32;
  const result = final(a, b, c);
  hooks.onResult?.(result);
  return result;
}
