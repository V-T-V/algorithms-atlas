export interface OrRangeHooks {
  onFill?: (val: number) => void;
}
export function rangeOr(m: number, n: number, hooks: OrRangeHooks = {}): number {
  let a = m | 0,
    b = n | 0;
  while (a < b) {
    a |= a + 1;
    hooks.onFill?.(a >>> 0);
  }
  return a | 0;
}
