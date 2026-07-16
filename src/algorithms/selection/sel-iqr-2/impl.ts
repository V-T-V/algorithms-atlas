// 四分位距 v2 · 实现
export interface IqrHooks {
  onQuartiles?: (q1: number, q3: number) => void;
  onResult?: (iqr: number) => void;
}
function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return NaN;
  const rank = q * (sorted.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (rank - lo);
}
export function iqr(arr: number[], hooks: IqrHooks = {}): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  hooks.onQuartiles?.(q1, q3);
  const v = q3 - q1;
  hooks.onResult?.(v);
  return v;
}
