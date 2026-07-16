// Z-Score 离群点检测 · 实现
export function zScoreOutliers(values: number[], threshold = 3): boolean[] {
  const n = values.length;
  if (n === 0) return [];
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const sd = Math.sqrt(variance) || 1;
  return values.map((v) => Math.abs((v - mean) / sd) > threshold);
}
