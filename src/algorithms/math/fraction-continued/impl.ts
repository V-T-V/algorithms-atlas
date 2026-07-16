// =============================================================================
// 连分数化简（小数→连分数）· 纯算法实现
// 两条路径：小数提取 / 二次根式周期连分数。
// =============================================================================

/** 事件钩子。 */
export interface FractionContinuedHooks {
  /** 提取一项 a_k。 */
  onCoefficient?: (k: number, a: number | bigint) => void;
  /** 完成。 */
  onResult?: (coeffs: (number | bigint)[]) => void;
}

/**
 * 小数 x 的连分数系数提取（精度受限）。
 * @param x 待展开的正实数
 * @param maxTerms 最大项数
 */
export function decimalToCf(
  x: number,
  maxTerms = 30,
  hooks: FractionContinuedHooks = {},
): number[] {
  if (!Number.isFinite(x)) throw new RangeError('decimalToCf: x must be finite');
  const coeffs: number[] = [];
  let cur = x;
  for (let k = 0; k < maxTerms; k++) {
    const a = Math.floor(cur);
    coeffs.push(a);
    hooks.onCoefficient?.(k, a);
    const frac = cur - a;
    if (frac < 1e-12) break;
    cur = 1 / frac;
  }
  hooks.onResult?.(coeffs);
  return coeffs;
}

/**
 * 二次根式 √D 的周期连分数展开。
 * 返回 { prefix: [a0], period: [a1,...,aL] }。
 */
export function sqrtPeriodicCf(
  D: number | bigint,
  hooks: FractionContinuedHooks = {},
): { prefix: bigint[]; period: bigint[] } {
  const DD = typeof D === 'number' ? BigInt(D) : D;
  if (DD <= 0n) throw new RangeError('sqrtPeriodicCf: D must be positive');
  const isqrt = (x: bigint): bigint => {
    if (x < 2n) return x;
    let s = x;
    let t = (s + 1n) / 2n;
    while (t < s) {
      s = t;
      t = (s + x / s) / 2n;
    }
    return s;
  };
  const a0 = isqrt(DD);
  if (a0 * a0 === DD) {
    hooks.onCoefficient?.(0, a0);
    hooks.onResult?.([a0]);
    return { prefix: [a0], period: [] };
  }
  let m = 0n;
  let d = 1n;
  let a = a0;
  hooks.onCoefficient?.(0, a);
  // 用 (m,d) 状态作为周期检测键
  const seen = new Map<string, number>();
  const period: bigint[] = [];
  let k = 1;
  while (true) {
    m = d * a - m;
    d = (DD - m * m) / d;
    a = (a0 + m) / d;
    const key = `${m},${d}`;
    if (seen.has(key)) break;
    seen.set(key, k);
    period.push(a);
    hooks.onCoefficient?.(k, a);
    k++;
  }
  hooks.onResult?.([a0, ...period]);
  return { prefix: [a0], period };
}
