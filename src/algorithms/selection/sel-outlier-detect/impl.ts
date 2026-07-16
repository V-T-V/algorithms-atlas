// 离群点检测 · 实现
export interface OdHooks {
  onFences?: (lo: number, hi: number) => void;
  onResult?: (outliers: number[]) => void;
}
function quantile(sorted: number[], q: number): number {
  const rank = q * (sorted.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (rank - lo);
}
export function detectOutliers(arr: number[], k = 1.5, hooks: OdHooks = {}): number[] {
  const sorted = [...arr].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const lo = q1 - k * iqr;
  const hi = q3 + k * iqr;
  hooks.onFences?.(lo, hi);
  const out = arr.filter((x) => x < lo || x > hi);
  hooks.onResult?.(out);
  return out;
}
