// 绝对中位差 · 实现
export interface MadHooks {
  onMedian?: (m: number) => void;
  onResult?: (mad: number) => void;
}
function median(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  return n % 2 === 0 ? (sorted[n / 2 - 1]! + sorted[n / 2]!) / 2 : sorted[Math.floor(n / 2)]!;
}
export function mad(arr: number[], hooks: MadHooks = {}): number {
  const s = [...arr].sort((a, b) => a - b);
  const med = median(s);
  hooks.onMedian?.(med);
  const devs = arr.map((x) => Math.abs(x - med)).sort((a, b) => a - b);
  const m = median(devs);
  hooks.onResult?.(m);
  return m;
}
