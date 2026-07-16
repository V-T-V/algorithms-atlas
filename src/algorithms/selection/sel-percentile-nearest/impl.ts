// 就近百分位 · 实现
export interface PnHooks {
  onSort?: (sorted: number[]) => void;
  onResult?: (v: number) => void;
}
export function percentileNearest(arr: number[], p: number, hooks: PnHooks = {}): number {
  if (arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  hooks.onSort?.(sorted);
  const rank = Math.max(1, Math.ceil((p / 100) * sorted.length));
  const v = sorted[rank - 1]!;
  hooks.onResult?.(v);
  return v;
}
