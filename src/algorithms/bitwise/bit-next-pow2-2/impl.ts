export interface NextPow2Hooks {
  onFill?: (filled: number) => void;
  onResult?: (r: number) => void;
}
export function nextPow2(x: number, hooks: NextPow2Hooks = {}): number {
  let v = (x - 1) | 0;
  if (v <= 0) return 1;
  v = v >>> 0;
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  hooks.onFill?.(v >>> 0);
  const r = (v + 1) >>> 0;
  hooks.onResult?.(r);
  return r;
}
