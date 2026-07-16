// Z-score 离群点 · 实现
export interface ZsHooks {
  onStats?: (mean: number, std: number) => void;
  onResult?: (outliers: number[]) => void;
}
export function mean(a: number[]): number {
  return a.reduce((s, x) => s + x, 0) / a.length;
}
export function std(a: number[], m?: number): number {
  const mu = m ?? mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - mu) ** 2, 0) / a.length);
}
export function zscoreOutliers(arr: number[], threshold = 2, hooks: ZsHooks = {}): number[] {
  const mu = mean(arr);
  const sigma = std(arr, mu);
  hooks.onStats?.(mu, sigma);
  if (sigma === 0) {
    hooks.onResult?.([]);
    return [];
  }
  const out = arr.filter((x) => Math.abs(x - mu) / sigma > threshold);
  hooks.onResult?.(out);
  return out;
}
