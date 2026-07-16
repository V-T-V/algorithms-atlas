// =============================================================================
// 斐波那契（Binet 公式 + 矩阵快速幂）· 纯算法实现
// Binet O(1) 近似 + 矩阵快速幂 O(log n) 精确。零 DOM 依赖，可独立单测。
// =============================================================================

const SQRT5 = Math.sqrt(5);
const PHI = (1 + SQRT5) / 2; // 黄金比 φ
const PSI = (1 - SQRT5) / 2; // ψ

/** 2×2 矩阵。 */
type M2 = [[number, number], [number, number]];

function matMul(a: M2, b: M2): M2 {
  return [
    [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
    [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
  ];
}

/** 事件钩子。 */
export interface FibonacciHooks {
  /** Binet 公式计算后（浮点近似值）。 */
  onBinet?: (n: number, approx: number) => void;
  /** 矩阵快速幂每次平方/乘后当前幂次与基矩阵。 */
  onMatrixStep?: (exp: number, base: M2, result: M2) => void;
  /** 最终精确值。 */
  onResult?: (n: number, exact: number) => void;
}

/**
 * Binet 闭式公式（浮点近似）。
 * F(n) = round((φ^n − ψ^n) / √5)，对小 n 精确，大 n 有浮点误差。
 */
export function fibBinet(n: number, hooks: FibonacciHooks = {}): number {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('n must be a non-negative integer');
  const approx = (Math.pow(PHI, n) - Math.pow(PSI, n)) / SQRT5;
  hooks.onBinet?.(n, approx);
  return Math.round(approx);
}

/**
 * 矩阵快速幂求精确 F(n)。O(log n)。
 * [[1,1],[1,0]]^n 的右上角即 F(n)。
 */
export function fibMatrix(n: number, hooks: FibonacciHooks = {}): number {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('n must be a non-negative integer');
  if (n === 0) {
    hooks.onResult?.(0, 0);
    return 0;
  }
  // result 单位阵，base = [[1,1],[1,0]]
  let result: M2 = [
    [1, 0],
    [0, 1],
  ];
  let base: M2 = [
    [1, 1],
    [1, 0],
  ];
  let exp = n;
  while (exp > 0) {
    if (exp & 1) {
      result = matMul(result, base);
    }
    base = matMul(base, base);
    hooks.onMatrixStep?.(exp, base, result);
    exp = Math.floor(exp / 2);
  }
  // result = [[1,1],[1,0]]^n = [[F(n+1),F(n)],[F(n),F(n-1)]]
  const fn = result[0][1];
  hooks.onResult?.(n, fn);
  return fn;
}

/**
 * 同时返回 Binet 近似与矩阵精确值，便于对比。
 */
export function fibCompare(
  n: number,
  hooks: FibonacciHooks = {},
): { binet: number; matrix: number } {
  const binet = fibBinet(n, hooks);
  const matrix = fibMatrix(n, hooks);
  return { binet, matrix };
}
