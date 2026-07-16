// FNV-1 32-bit · 实现
export interface FnvHooks {
  onByte?: (i: number, byte: number, h: number) => void;
  onConclude?: (hash: number) => void;
}
const OFFSET = 0x811c9dc5,
  PRIME = 0x01000193;
export function fnv1_32(data: string | readonly number[], hooks: FnvHooks = {}): number {
  const bytes = typeof data === 'string' ? [...data].map((c) => c.charCodeAt(0)) : [...data];
  let h = OFFSET;
  for (let i = 0; i < bytes.length; i++) {
    h = Math.imul(h, PRIME);
    hooks.onByte?.(i, bytes[i]!, h >>> 0);
  }
  hooks.onConclude?.(h >>> 0);
  return h >>> 0;
}
