// CityHash32 简化 · 实现
const MASK32 = 0xffffffff;
function fmix(h: number): number {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) & MASK32;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) & MASK32;
  h ^= h >>> 16;
  return h >>> 0;
}
export interface City32Hooks {
  onOctet?: (i: number, byte: number, hash: number) => void;
  onResult?: (hash: number) => void;
}
export function hashCity32(data: string | readonly number[], hooks: City32Hooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const seed = 0;
  let h = (seed ^ bytes.length) & MASK32;
  for (let i = 0; i < bytes.length; i++) {
    h = (Math.imul(h, 0x9e3779b1) + bytes[i]!) & MASK32;
    h = (h ^ (h >>> 17)) & MASK32;
    hooks.onOctet?.(i, bytes[i]!, h);
  }
  h = fmix(h);
  hooks.onResult?.(h >>> 0);
  return h >>> 0;
}
