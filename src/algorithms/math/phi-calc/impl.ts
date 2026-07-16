// =============================================================================
// 单值欧拉函数 φ(n) · 纯算法实现
// 试除分解，O(√n)。BigInt 实现。
// =============================================================================

/** 事件钩子。 */
export interface PhiCalcHooks {
  /** 发现素因子 p（及其在 n 中的幂次 e）。 */
  onFactor?: (p: bigint, e: number) => void;
  /** 累乘后中间结果（已乘入 (p-1)·p^{e-1}）。 */
  onAccumulate?: (p: bigint, e: number, partial: bigint) => void;
  /** 完成。 */
  onResult?: (phi: bigint) => void;
}

/**
 * 计算 φ(n)。n >= 1。
 */
export function phi(n: number | bigint, hooks: PhiCalcHooks = {}): bigint {
  const nn = typeof n === 'number' ? BigInt(n) : n;
  if (nn < 1n) throw new RangeError('phi: n must be >= 1');
  let result = nn;
  let x = nn;
  for (let p = 2n; p * p <= x; p++) {
    if (x % p === 0n) {
      let e = 0;
      while (x % p === 0n) {
        x /= p;
        e++;
      }
      hooks.onFactor?.(p, e);
      result = (result / p) * (p - 1n);
      hooks.onAccumulate?.(p, e, result);
    }
  }
  if (x > 1n) {
    hooks.onFactor?.(x, 1);
    result = (result / x) * (x - 1n);
    hooks.onAccumulate?.(x, 1, result);
  }
  hooks.onResult?.(result);
  return result;
}
