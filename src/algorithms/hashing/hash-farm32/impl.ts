// FarmHash32 简化 · 实现
const MASK32 = 0xffffffff;
const C1 = 0xcc9e2d51;
const C2 = 0x1b873593;
function rotl(x: number, r: number): number {
  return ((x << r) | (x >>> (32 - r))) & MASK32;
}
function fmix(h: number): number {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) & MASK32;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) & MASK32;
  h ^= h >>> 16;
  return h >>> 0;
}
export interface Farm32Hooks {
  onOctet?: (i: number, byte: number, hash: number) => void;
  onResult?: (hash: number) => void;
}
export function hashFarm32(data: string | readonly number[], hooks: Farm32Hooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const seed = 0;
  let h = seed ^ bytes.length;
  for (let i = 0; i < bytes.length; i++) {
    let k = bytes[i]!;
    k = Math.imul(k, C1) & MASK32;
    k = rotl(k, 15);
    k = Math.imul(k, C2) & MASK32;
    h ^= k;
    h = rotl(h, 13);
    h = (Math.imul(h, 5) + 0xe6546b64) & MASK32;
    hooks.onOctet?.(i, bytes[i]!, h);
  }
  h = fmix(h);
  hooks.onResult?.(h >>> 0);
  return h >>> 0;
}
