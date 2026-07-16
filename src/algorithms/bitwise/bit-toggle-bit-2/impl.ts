export interface ToggleHooks {
  onMask?: (m: number) => void;
  onResult?: (v: number) => void;
}
export function toggleBit(x: number, i: number, hooks: ToggleHooks = {}): number {
  const mask = (1 << i) >>> 0;
  hooks.onMask?.(mask);
  const r = ((x | 0) ^ mask) | 0;
  hooks.onResult?.(r);
  return r;
}
