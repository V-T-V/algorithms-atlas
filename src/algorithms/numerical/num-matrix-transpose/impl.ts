// 矩阵转置 · 实现
export function transpose(A: number[][]): number[][] {
  const m = A.length,
    n = A[0]!.length;
  const T = Array.from({ length: n }, () => new Array<number>(m).fill(0));
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) T[j]![i]! = A[i]![j]!;
  return T;
}
