// 矩阵乘法 · 实现
export function matMul(A: number[][], B: number[][]): number[][] {
  const m = A.length,
    n = B[0]!.length,
    p = B.length;
  if (A[0]!.length !== p) throw new RangeError('维度不匹配');
  const C = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++)
    for (let k = 0; k < p; k++) for (let j = 0; j < n; j++) C[i]![j]! += A[i]![k]! * B[k]![j]!;
  return C;
}
