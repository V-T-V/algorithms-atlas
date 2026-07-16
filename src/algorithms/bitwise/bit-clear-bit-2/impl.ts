export interface ClearBitHooks {
  onMask?: (mask: number) => void;
  onResult?: (v: number) => void;
}
export function clearBit(x: number, i: number, hooks: ClearBitHooks = {}): number {
  const mask = ~(1 << i);
  hooks.onMask?.(mask >>> 0);
  const r = ((x | 0) & mask) | 0;
  hooks.onResult?.(r);
  return r;
}
