export interface HighSetHooks {
  onFill?: (filled: number) => void;
  onResult?: (r: number) => void;
}
export function highestSetBit(x: number, hooks: HighSetHooks = {}): number {
  let v = x | 0;
  if (v <= 0) {
    hooks.onResult?.(0);
    return 0;
  }
  v = v >>> 0;
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  hooks.onFill?.(v >>> 0);
  const r = ((v >>> 1) + 1) >>> 0;
  hooks.onResult?.(r);
  return r;
}
