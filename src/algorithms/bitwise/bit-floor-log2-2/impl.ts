export interface FloorLog2Hooks {
  onFill?: (v: number) => void;
  onResult?: (r: number) => void;
}
export function floorLog2Fill(x: number, hooks: FloorLog2Hooks = {}): number {
  let v = x | 0;
  if (v <= 0) {
    hooks.onResult?.(-1);
    return -1;
  }
  v = v >>> 0;
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  hooks.onFill?.(v >>> 0);
  // popcount(v)
  let c = 0,
    t = v >>> 0;
  while (t) {
    t &= t - 1;
    c++;
  }
  const r = c - 1;
  hooks.onResult?.(r);
  return r;
}
