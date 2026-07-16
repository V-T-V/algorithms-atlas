export interface XorRangeHooks {
  onPrefix?: (n: number, val: number) => void;
}
function prefix(n: number): number {
  const r = ((n % 4) + 4) % 4;
  if (r === 0) return n;
  if (r === 1) return 1;
  if (r === 2) return n + 1;
  return 0;
}
export function rangeXor(m: number, n: number, hooks: XorRangeHooks = {}): number {
  const fn = prefix(n);
  const fm = prefix(m - 1);
  hooks.onPrefix?.(n, fn);
  hooks.onPrefix?.(m - 1, fm);
  return (fn ^ fm) | 0;
}
