// MurmurHash2A 32-bit · 实现
const MASK32 = 0xffffffff;
const M = 0x5bd1e995;
const R = 24;
export interface Murmur2aHooks {
  onChunk?: (i: number, k: number, hash: number) => void;
  onResult?: (hash: number) => void;
}
export function hashMurmur2a(
  data: string | readonly number[],
  seed = 0,
  hooks: Murmur2aHooks = {},
): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const len = bytes.length;
  let h = (seed ^ len) & MASK32;
  let i = 0;
  while (i + 4 <= len) {
    let k =
      (bytes[i]! | (bytes[i + 1]! << 8) | (bytes[i + 2]! << 16) | (bytes[i + 3]! << 24)) >>> 0;
    k = Math.imul(k, M) & MASK32;
    k = (k ^ (k >>> R)) & MASK32;
    k = Math.imul(k, M) & MASK32;
    h = (Math.imul(h, M) ^ k) & MASK32;
    hooks.onChunk?.(i, k, h);
    i += 4;
  }
  const rem = len - i;
  if (rem >= 3) h = (h ^ (bytes[i + 2]! << 16)) & MASK32;
  if (rem >= 2) h = (h ^ (bytes[i + 1]! << 8)) & MASK32;
  if (rem >= 1) {
    h = (h ^ bytes[i]!) & MASK32;
    h = Math.imul(h, M) & MASK32;
  }
  h ^= h >>> 13;
  h = Math.imul(h, M) & MASK32;
  h ^= h >>> 15;
  hooks.onResult?.(h >>> 0);
  return h >>> 0;
}
