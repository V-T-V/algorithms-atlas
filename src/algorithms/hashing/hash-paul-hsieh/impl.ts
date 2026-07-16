// Paul Hsieh SuperFast · 实现
const MASK32 = 0xffffffff;
function rot(v: number, k: number): number {
  return ((v << k) | (v >>> (32 - k))) & MASK32;
}
export interface PaulHsiehHooks {
  onOctet?: (i: number, byte: number, hash: number) => void;
  onResult?: (hash: number) => void;
}
export function hashPaulHsieh(
  data: string | readonly number[],
  hooks: PaulHsiehHooks = {},
): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const len = bytes.length;
  let hash = len;
  let tmp = 0;
  const rem = len & 3;
  let i = 0;
  for (; i + 4 <= len; i += 4) {
    hash = (hash + (bytes[i]! | (bytes[i + 1]! << 8))) & MASK32;
    tmp = ((bytes[i + 2]! | (bytes[i + 3]! << 8)) << 11) ^ hash;
    hash = (rot(hash, 7) ^ tmp) & MASK32;
    hooks.onOctet?.(i, bytes[i]!, hash);
  }
  switch (rem) {
    case 3:
      hash = (hash + (bytes[i + 2]! << 16)) & MASK32; // fall through
    case 2:
      hash = (hash + (bytes[i + 1]! << 8)) & MASK32; // fall through
    case 1: {
      hash ^= hash >>> 16;
      hash = (5381 * hash) & MASK32;
    }
  }
  hash ^= hash >>> 10;
  hash = (hash + (hash << 3)) & MASK32;
  hash ^= hash >>> 19;
  hash = (hash + (hash << 16)) & MASK32;
  hooks.onResult?.(hash >>> 0);
  return hash >>> 0;
}
