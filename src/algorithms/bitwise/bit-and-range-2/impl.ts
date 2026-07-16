export interface AndRangeHooks {
  onShift?: (shift: number, m: number, n: number) => void;
}
export function rangeAnd(m: number, n: number, hooks: AndRangeHooks = {}): number {
  let shift = 0;
  let a = m | 0,
    b = n | 0;
  while (a !== b) {
    a >>>= 1;
    b >>>= 1;
    shift++;
    hooks.onShift?.(shift, a, b);
  }
  return (a << shift) | 0;
}
