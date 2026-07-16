// IQR 离群点检测 · 实现
function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos),
    rest = pos - base;
  return sorted[base + 1] !== undefined
    ? sorted[base]! + rest * (sorted[base + 1]! - sorted[base]!)
    : sorted[base]!;
}
export function iqrOutliers(values: number[]): boolean[] {
  if (values.length === 0) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25),
    q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const lo = q1 - 1.5 * iqr,
    hi = q3 + 1.5 * iqr;
  return values.map((v) => v < lo || v > hi);
}
