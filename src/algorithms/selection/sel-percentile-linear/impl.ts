// 线性插值百分位 · 实现
export interface PlHooks {
  onSort?: (sorted: number[]) => void;
  onResult?: (v: number) => void;
}
export function percentileLinear(arr: number[], p: number, hooks: PlHooks = {}): number {
  if (arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  hooks.onSort?.(sorted);
  const rank = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  let v: number;
  if (lo === hi) v = sorted[lo]!;
  else {
    const frac = rank - lo;
    v = sorted[lo]! + (sorted[hi]! - sorted[lo]!) * frac;
  }
  hooks.onResult?.(v);
  return v;
}
