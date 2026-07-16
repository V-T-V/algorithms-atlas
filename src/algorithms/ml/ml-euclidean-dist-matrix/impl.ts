// 欧氏距离矩阵 · 实现
export function distanceMatrix(X: number[][]): number[][] {
  const n = X.length;
  const D = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      const d = Math.hypot(...X[i]!.map((v, k) => v - X[j]![k]!));
      D[i]![j]! = d;
      D[j]![i]! = d;
    }
  return D;
}
