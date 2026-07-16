// =============================================================================
// 斐波那契矩阵快速幂 Fibonacci (Matrix Exponentiation) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 2x2 矩阵（用四元组 [a,b,c,d] 表示）。 */
export type M2 = readonly [bigint, bigint, bigint, bigint];

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FibonacciMatrixHooks {
  /** 观察指数的某一位（0/1）。 */
  onBit?: (bit: 0 | 1, exp: number) => void;
  /** base 矩阵自乘（平方）一次。 */
  onSquare?: (base: M2) => void;
  /** 当前位为 1，把 base 乘入 result。 */
  onMultiply?: (result: M2, base: M2) => void;
  /** 最终结果 F_n。 */
  onResult?: (n: number, fn: bigint) => void;
}

const BASE: M2 = [1n, 1n, 1n, 0n]; // [[1,1],[1,0]]

/** 2x2 矩阵乘法。 */
function mul(a: M2, b: M2): M2 {
  return [
    a[0]! * b[0]! + a[1]! * b[2]!,
    a[0]! * b[1]! + a[1]! * b[3]!,
    a[2]! * b[0]! + a[3]! * b[2]!,
    a[2]! * b[1]! + a[3]! * b[3]!,
  ];
}

/**
 * 斐波那契数（矩阵快速幂）：返回 `F_n`（BigInt 精确）。
 *
 * 原理：斐波那契递推 `[F_{n+1}, F_n]ᵀ = [[1,1],[1,0]] · [F_n, F_{n-1}]ᵀ`，
 * 故 `[F_{n+1}, F_n]ᵀ = Mⁿ · [1, 0]ᵀ`，其中 `M = [[1,1],[1,0]]`。
 * 用**矩阵快速幂**（二进制拆指数）在 `O(log n)` 次矩阵乘法内算出 `Mⁿ`。
 *
 * - 时间 `O(log n)`（每次矩阵乘法是常数次大整数运算）
 * - 空间 `O(1)`
 *
 * @param n 非负整数下标
 * @param hooks 可选的事件钩子
 * @returns F_n（BigInt）
 */
export function fibonacciMatrix(n: number, hooks: FibonacciMatrixHooks = {}): bigint {
  if (n < 0) throw new RangeError('fibonacciMatrix: n must be non-negative');
  if (n === 0) {
    hooks.onResult?.(0, 0n);
    return 0n;
  }

  let result: M2 = [1n, 0n, 0n, 1n]; // 单位矩阵
  let base: M2 = BASE;
  let e = n;

  while (e > 0) {
    const bit = (e & 1) as 0 | 1;
    hooks.onBit?.(bit, e);
    if (bit === 1) {
      result = mul(result, base);
      hooks.onMultiply?.(result, base);
    }
    e = Math.floor(e / 2);
    if (e > 0) {
      base = mul(base, base);
      hooks.onSquare?.(base);
    }
  }
  // result = Mⁿ；F_n = result[1]（即 Mⁿ 的右上 / 左下角）
  const fn = result[1]!;
  hooks.onResult?.(n, fn);
  return fn;
}
