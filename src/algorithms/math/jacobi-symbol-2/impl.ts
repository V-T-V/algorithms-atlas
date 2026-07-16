// =============================================================================
// 雅可比符号（递归互反律版）· 纯算法实现
// J(a, n)，n 为奇正整数。递归二次互反律。BigInt 实现。
// =============================================================================

/** 事件钩子。 */
export interface Jacobi2Hooks {
  /** 每轮递归调用，记录当前 (a, n) 与累积符号 sign。 */
  onStep?: (a: bigint, n: bigint, sign: number) => void;
  /** 最终结果。 */
  onResult?: (value: number) => void;
}

const sign2 = (n: bigint): number => {
  // J(2, n) = (-1)^((n²-1)/8)
  const mod8 = ((n % 8n) + 8n) % 8n;
  return mod8 === 1n || mod8 === 7n ? 1 : -1;
};

/** 递归求 J(a, n)，sign 为外层累积符号。 */
function rec(a: bigint, n: bigint, sign: number, hooks: Jacobi2Hooks): number {
  a = ((a % n) + n) % n;
  hooks.onStep?.(a, n, sign);
  if (a === 0n) return 0;
  if (a === 1n) return sign;

  // 提出 2 的因子
  let aa = a;
  let s = sign;
  while ((aa & 1n) === 0n) {
    aa >>= 1n;
    s *= sign2(n);
  }
  if (aa === 1n) return s;

  // 二次互反律：J(aa, n) = (-1)^((aa-1)(n-1)/4) · J(n mod aa, aa)
  if ((((aa - 1n) / 2n) * ((n - 1n) / 2n)) % 2n === 1n) s = -s;
  return rec(n % aa, aa, s, hooks);
}

/**
 * 雅可比符号 J(a, n)（n 为奇正整数）。返回 {-1, 0, 1}。
 */
export function jacobi(a: number | bigint, n: number | bigint, hooks: Jacobi2Hooks = {}): number {
  const aa = typeof a === 'number' ? BigInt(a) : a;
  const nn = typeof n === 'number' ? BigInt(n) : n;
  if (nn <= 0n || (nn & 1n) === 0n) {
    throw new RangeError('jacobi: n must be a positive odd integer');
  }
  const v = rec(aa, nn, 1, hooks);
  hooks.onResult?.(v);
  return v;
}
