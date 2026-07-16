// 快速斐波那契（矩阵快速幂）· 实现
export function fibFast(n: number): number {
  if (n < 0) throw new RangeError('n 不能为负');
  const mul = (A: number[][], B: number[][]): number[][] => [
    [A[0]![0]! * B[0]![0]! + A[0]![1]! * B[1]![0]!, A[0]![0]! * B[0]![1]! + A[0]![1]! * B[1]![1]!],
    [A[1]![0]! * B[0]![0]! + A[1]![1]! * B[1]![0]!, A[1]![0]! * B[0]![1]! + A[1]![1]! * B[1]![1]!],
  ];
  let result = [
    [1, 0],
    [0, 1],
  ];
  let base = [
    [1, 1],
    [1, 0],
  ];
  let e = n;
  while (e > 0) {
    if (e & 1) result = mul(result, base);
    base = mul(base, base);
    e >>= 1;
  }
  return result[0]![1]!;
}
