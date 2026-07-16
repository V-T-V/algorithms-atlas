// =============================================================================
// Lucas 序列 · 纯算法实现
// U_n, V_n via 2×2 矩阵快速幂。BigInt。
// =============================================================================

export interface LucasSeqResult {
  U: bigint;
  V: bigint;
}

/** 事件钩子。 */
export interface LucasSequenceHooks {
  /** 每轮指数右移，bit 为当前位。 */
  onStep?: (bit: 0 | 1, a: bigint, b: bigint, c: bigint, d: bigint) => void;
  /** 完成。 */
  onResult?: (n: number, U: bigint, V: bigint) => void;
}

type Mat2 = [bigint, bigint, bigint, bigint]; // [a,b,c,d]

function matMul(x: Mat2, y: Mat2): Mat2 {
  return [
    x[0] * y[0] + x[1] * y[2],
    x[0] * y[1] + x[1] * y[3],
    x[2] * y[0] + x[3] * y[2],
    x[2] * y[1] + x[3] * y[3],
  ];
}

/**
 * 计算 Lucas 序列 U_n(P,Q) 与 V_n(P,Q)。
 * @param P 参数
 * @param Q 参数
 * @param n 下标（非负）
 */
export function lucasSequence(
  P: number | bigint,
  Q: number | bigint,
  n: number,
  hooks: LucasSequenceHooks = {},
): LucasSeqResult {
  if (n < 0) throw new RangeError('lucasSequence: n must be non-negative');
  const p = typeof P === 'number' ? BigInt(P) : P;
  const q = typeof Q === 'number' ? BigInt(Q) : Q;
  if (n === 0) return { U: 0n, V: 2n };
  if (n === 1) return { U: 1n, V: p };

  // 转移矩阵 A = [[P, -Q],[1, 0]]，A^n 的 a,b 给出 U_{n+1}, U_n 关系
  // 标准：A^n = [[U_{n+1}, -Q·U_n],[U_n, -Q·U_{n-1}]]
  let result: Mat2 = [1n, 0n, 0n, 1n]; // 单位
  let base: Mat2 = [p, -q, 1n, 0n];
  let e = n;
  while (e > 0) {
    const bit = (e & 1) as 0 | 1;
    hooks.onStep?.(bit, base[0], base[1], base[2], base[3]);
    if (bit === 1) result = matMul(result, base);
    e = Math.floor(e / 2);
    if (e > 0) base = matMul(base, base);
  }
  // result = A^n = [[U_{n+1}, -Q·U_n],[U_n, -Q·U_{n-1}]]
  // U_n = result[2]
  const U = result[2];
  // V_n = U_{n+1} - Q·U_{n-1}；但用 result[0] + result[3] 的迹更稳：
  // 迹(A^n) = U_{n+1} - Q·U_{n-1} = V_n
  const V = result[0] + result[3];
  hooks.onResult?.(n, U, V);
  return { U, V };
}
