export interface SetBitHooks {
  onMask?: (mask: number) => void;
  onResult?: (v: number) => void;
}
export function setBit(x: number, i: number, hooks: SetBitHooks = {}): number {
  const mask = (1 << i) >>> 0;
  hooks.onMask?.(mask);
  const r = x | 0 | mask | 0;
  hooks.onResult?.(r);
  return r;
}
