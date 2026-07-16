// 基尼系数 · 实现
export interface GiniHooks {
  onSorted?: (sorted: number[]) => void;
  onResult?: (g: number) => void;
}
export function gini(arr: number[], hooks: GiniHooks = {}): number {
  if (arr.length === 0) return NaN;
  const s = [...arr].sort((a, b) => a - b);
  hooks.onSorted?.(s);
  const n = s.length;
  const sum = s.reduce((a, b) => a + b, 0);
  if (sum === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  // G = (2 Σᵢ i·xᵢ) / (n Σxᵢ) − (n+1)/n
  let cumWeighted = 0;
  for (let i = 0; i < n; i++) cumWeighted += (i + 1) * s[i]!;
  const g = (2 * cumWeighted) / (n * sum) - (n + 1) / n;
  hooks.onResult?.(g);
  return g;
}
