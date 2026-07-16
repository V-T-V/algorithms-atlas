export interface PopRangeHooks {
  onValue?: (x: number, c: number) => void;
}
function pc(x: number): number {
  let v = x >>> 0,
    c = 0;
  while (v) {
    v &= v - 1;
    c++;
  }
  return c;
}
export function popcountRange(m: number, n: number, hooks: PopRangeHooks = {}): number {
  let sum = 0;
  for (let x = m; x <= n; x++) {
    const c = pc(x);
    sum += c;
    hooks.onValue?.(x, c);
  }
  return sum;
}
