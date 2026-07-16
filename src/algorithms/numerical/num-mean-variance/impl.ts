// 均值与方差 · 实现
export interface Stats {
  mean: number;
  variance: number;
  std: number;
}
export function meanVariance(x: number[]): Stats {
  const n = x.length;
  if (n < 2) throw new RangeError('需至少 2 个样本');
  const mean = x.reduce((a, b) => a + b, 0) / n;
  const variance = x.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1);
  return { mean, variance, std: Math.sqrt(variance) };
}
