// 基尼指数 · 实现
export function giniIndex(counts: number[]): number {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let s = 0;
  for (const c of counts) {
    const p = c / total;
    s += p * p;
  }
  return 1 - s;
}
