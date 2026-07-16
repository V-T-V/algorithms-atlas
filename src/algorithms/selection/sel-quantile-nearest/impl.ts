// 就近分位数 · 实现
export interface QnHooks {
  onResult?: (v: number) => void;
}
export function quantileNearest(arr: number[], q: number, hooks: QnHooks = {}): number {
  if (arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  const rank = Math.max(1, Math.ceil(q * sorted.length));
  const v = sorted[rank - 1]!;
  hooks.onResult?.(v);
  return v;
}
