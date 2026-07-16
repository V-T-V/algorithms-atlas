// 2×2 行列式 · 实现
export function det2x2(A: number[][]): number {
  if (A.length !== 2 || A[0]!.length !== 2) throw new RangeError('必须 2×2');
  return A[0]![0]! * A[1]![1]! - A[0]![1]! * A[1]![0]!;
}
