// 线性分位数 · 实现
export interface QlHooks {
  onResult?: (v: number) => void;
}
export function quantileLinear(arr: number[], q: number, hooks: QlHooks = {}): number {
  if (arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  const rank = q * (sorted.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  let v: number;
  if (lo === hi) v = sorted[lo]!;
  else v = sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (rank - lo);
  hooks.onResult?.(v);
  return v;
}
