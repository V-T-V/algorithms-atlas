// =============================================================================
// Tribonacci · 纯算法实现
// 3×3 矩阵快速幂。BigInt。
// =============================================================================

/** 事件钩子。 */
export interface TribonacciHooks {
  /** 每轮指数右移，bit 为当前位，M 为当前转移矩阵的平方累积。 */
  onStep?: (bit: 0 | 1, m: bigint[][]) => void;
  /** 完成。 */
  onResult?: (n: number, value: bigint) => void;
}

type Mat = bigint[][];

function matMul(a: Mat, b: Mat): Mat {
  const r: Mat = [
    [
      a[0]![0]! * b[0]![0]! + a[0]![1]! * b[1]![0]! + a[0]![2]! * b[2]![0]!,
      a[0]![0]! * b[0]![1]! + a[0]![1]! * b[1]![1]! + a[0]![2]! * b[2]![1]!,
      a[0]![0]! * b[0]![2]! + a[0]![1]! * b[1]![2]! + a[0]![2]! * b[2]![2]!,
    ],
    [
      a[1]![0]! * b[0]![0]! + a[1]![1]! * b[1]![0]! + a[1]![2]! * b[2]![0]!,
      a[1]![0]! * b[0]![1]! + a[1]![1]! * b[1]![1]! + a[1]![2]! * b[2]![1]!,
      a[1]![0]! * b[0]![2]! + a[1]![1]! * b[1]![2]! + a[1]![2]! * b[2]![2]!,
    ],
    [
      a[2]![0]! * b[0]![0]! + a[2]![1]! * b[1]![0]! + a[2]![2]! * b[2]![0]!,
      a[2]![0]! * b[0]![1]! + a[2]![1]! * b[1]![1]! + a[2]![2]! * b[2]![1]!,
      a[2]![0]! * b[0]![2]! + a[2]![1]! * b[1]![2]! + a[2]![2]! * b[2]![2]!,
    ],
  ];
  return r;
}

function clone(a: Mat): Mat {
  return a.map((row) => [...row]);
}

/**
 * 计算 T(n)。T(0)=0, T(1)=0, T(2)=1。
 * @returns T(n)
 */
export function tribonacci(n: number, hooks: TribonacciHooks = {}): bigint {
  if (n < 0) throw new RangeError('tribonacci: n must be non-negative');
  if (n === 0) return 0n;
  if (n === 1) return 0n;
  if (n === 2) return 1n;
  // 转移矩阵 A = [[1,1,1],[1,0,0],[0,1,0]]
  const A: Mat = [
    [1n, 1n, 1n],
    [1n, 0n, 0n],
    [0n, 1n, 0n],
  ];
  let result: Mat = [
    [1n, 0n, 0n],
    [0n, 1n, 0n],
    [0n, 0n, 1n],
  ]; // 单位
  let base = clone(A);
  let e = n - 2; // A^(n-2) · [T2,T1,T0]^T 的首项即 T(n)
  while (e > 0) {
    const bit = (e & 1) as 0 | 1;
    hooks.onStep?.(bit, clone(base));
    if (bit === 1) result = matMul(result, base);
    e = Math.floor(e / 2);
    if (e > 0) base = matMul(base, base);
  }
  // result = A^(n-2)；T(n) = result[0][0]*T2 + result[0][1]*T1 + result[0][2]*T0
  //                          = result[0][0]*1 + result[0][1]*0 + result[0][2]*0
  const v = result[0]![0]!;
  hooks.onResult?.(n, v);
  return v;
}
