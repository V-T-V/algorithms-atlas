// 协方差矩阵 · 实现
export function covarianceMatrix(X: number[][]): number[][] {
  const n = X.length;
  if (n < 2) throw new RangeError('需至少 2 个样本');
  const d = X[0]!.length;
  const mean = new Array<number>(d).fill(0);
  for (let i = 0; i < n; i++) for (let j = 0; j < d; j++) mean[j]! += X[i]![j]!;
  for (let j = 0; j < d; j++) mean[j]! /= n;
  const cov = Array.from({ length: d }, () => new Array<number>(d).fill(0));
  for (let i = 0; i < n; i++)
    for (let a = 0; a < d; a++)
      for (let b = 0; b < d; b++) cov[a]![b]! += (X[i]![a]! - mean[a]!) * (X[i]![b]! - mean[b]!);
  for (let a = 0; a < d; a++) for (let b = 0; b < d; b++) cov[a]![b]! /= n - 1;
  return cov;
}
