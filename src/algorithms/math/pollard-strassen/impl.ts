// =============================================================================
// Pollard-Strassen 因数分解 · 纯算法实现
// 求合数 n 的一个非平凡因子（>1 且 <n）。
// =============================================================================

/** 事件钩子。 */
export interface PollardStrassenHooks {
  /** 处理一个块 [lo, hi]，prod 为块乘积 mod n，g 为 gcd(n, prod)。 */
  onBlock?: (lo: bigint, hi: bigint, prod: bigint, g: bigint) => void;
  /** 在块内定位到因子 f。 */
  onFactor?: (f: bigint) => void;
  /** 完成（找到因子或确认为素数）。 */
  onResult?: (factor: bigint | null) => void;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    [x, y] = [y, x % y];
  }
  return x;
}

/** 求一个非平凡因子。返回 null 表示 n 是素数。 */
export function pollardStrassen(
  n: number | bigint,
  hooks: PollardStrassenHooks = {},
): bigint | null {
  const nn = typeof n === 'number' ? BigInt(n) : n;
  if (nn < 2n) return null;
  if (nn % 2n === 0n) {
    hooks.onFactor?.(2n);
    hooks.onResult?.(2n);
    return 2n;
  }
  // 上界 ⌈√n⌉
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
  const limit = isqrt(nn) + 1n;
  const blockSize = isqrt(limit) + 1n; // ≈ n^1/4

  for (let lo = 2n; lo <= limit; lo += blockSize) {
    const hi = lo + blockSize - 1n > limit ? limit : lo + blockSize - 1n;
    // 计算 ∏_{i=lo}^{hi} i mod n
    let prod = 1n;
    for (let i = lo; i <= hi; i++) prod = (prod * i) % nn;
    const g = gcd(nn, prod);
    hooks.onBlock?.(lo, hi, prod, g);
    if (g > 1n && g < nn) {
      // 在 [lo, hi] 内二分定位
      let lolo = lo;
      let hihi = hi;
      while (lolo < hihi) {
        const mid = (lolo + hihi) / 2n;
        let p2 = 1n;
        for (let i = lolo; i <= mid; i++) p2 = (p2 * i) % nn;
        if (gcd(nn, p2) > 1n) hihi = mid;
        else lolo = mid + 1n;
      }
      // lolo 是最小因子候选；但 n 可能整除 lolo 自身
      if (nn % lolo === 0n && lolo < nn) {
        hooks.onFactor?.(lolo);
        hooks.onResult?.(lolo);
        return lolo;
      }
      // 否则 g 来自多个因子之积，直接返回 g
      hooks.onFactor?.(g);
      hooks.onResult?.(g);
      return g;
    }
  }
  hooks.onResult?.(null);
  return null;
}
