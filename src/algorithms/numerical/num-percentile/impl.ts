// 百分位数 · 实现
export function percentile(values: number[], p: number): number {
  if (values.length === 0) throw new RangeError('空数组');
  if (p < 0 || p > 100) throw new RangeError('p 必须在 [0,100]');
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx),
    hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (idx - lo) * (sorted[hi]! - sorted[lo]!);
}
