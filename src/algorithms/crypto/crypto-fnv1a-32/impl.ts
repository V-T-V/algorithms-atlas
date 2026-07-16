export interface FnvHooks {
  onByte?: (i: number, h: number) => void;
}
const PRIME = 0x01000193;
export function fnv1a32(data: number[], hooks: FnvHooks = {}): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    h ^= data[i]!;
    h = Math.imul(h, PRIME) >>> 0;
    hooks.onByte?.(i, h);
  }
  return h >>> 0;
}
