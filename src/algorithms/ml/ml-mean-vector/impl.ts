// 均值向量 · 实现
export function meanVector(X: number[][]): number[] {
  const n = X.length;
  if (n === 0) return [];
  const d = X[0]!.length;
  const m = new Array<number>(d).fill(0);
  for (let i = 0; i < n; i++) for (let j = 0; j < d; j++) m[j]! += X[i]![j]!;
  for (let j = 0; j < d; j++) m[j]! /= n;
  return m;
}
