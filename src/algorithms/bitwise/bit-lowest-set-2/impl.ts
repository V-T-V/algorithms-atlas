export interface LowSetHooks {
  onResult?: (r: number) => void;
}
export function lowestSetBit(x: number, hooks: LowSetHooks = {}): number {
  const r = ((x | 0) & -(x | 0)) >>> 0;
  hooks.onResult?.(r);
  return r;
}
