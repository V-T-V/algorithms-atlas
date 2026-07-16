// =============================================================================
// 有理逼近（Stern-Brocot 二分）· 纯算法实现
// =============================================================================

export interface Rational {
  num: bigint;
  den: bigint;
}

/** 事件钩子。 */
export interface RationalApproximationHooks {
  /** 一次中位比较：mediant 分数 m，方向（left/right/stop）。 */
  onMediant?: (m: Rational, dir: 'left' | 'right' | 'stop') => void;
  /** 完成。 */
  onResult?: (best: Rational) => void;
}

/**
 * Stern-Brocot 二分：求 x 的最佳有理逼近，分母 ≤ maxDen。
 * @param x 待逼近的正实数
 * @param maxDen 分母上界
 * @returns 最佳 { num, den }
 */
export function rationalApprox(
  x: number,
  maxDen: number,
  hooks: RationalApproximationHooks = {},
): Rational {
  if (maxDen < 1) throw new RangeError('rationalApprox: maxDen must be >= 1');
  if (!Number.isFinite(x)) throw new RangeError('rationalApprox: x must be finite');
  let lo: Rational = { num: 0n, den: 1n };
  let hi: Rational = { num: 1n, den: 0n };
  if (x < 0) {
    // 处理负数：分解整数部分
    const intPart = BigInt(Math.floor(x));
    const sub = rationalApprox(x - Number(intPart), maxDen, hooks);
    return { num: intPart * sub.den + sub.num, den: sub.den };
  }
  let best: Rational = { num: 0n, den: 1n };
  let bestErr = Math.abs(x);

  for (;;) {
    const medNum = lo.num + hi.num;
    const medDen = lo.den + hi.den;
    if (medDen > BigInt(maxDen)) {
      hooks.onMediant?.({ num: medNum, den: medDen }, 'stop');
      break;
    }
    const medVal = Number(medNum) / Number(medDen);
    const err = Math.abs(medVal - x);
    if (err < bestErr) {
      bestErr = err;
      best = { num: medNum, den: medDen };
    }
    if (medVal < x) {
      lo = { num: medNum, den: medDen };
      hooks.onMediant?.({ num: medNum, den: medDen }, 'right');
    } else if (medVal > x) {
      hi = { num: medNum, den: medDen };
      hooks.onMediant?.({ num: medNum, den: medDen }, 'left');
    } else {
      best = { num: medNum, den: medDen };
      break;
    }
  }
  // 比较 lo/hi 与 best
  const loErr = Math.abs(Number(lo.num) / Number(lo.den) - x);
  const hiErr = hi.den === 0n ? Infinity : Math.abs(Number(hi.num) / Number(hi.den) - x);
  if (loErr < bestErr && lo.den <= BigInt(maxDen)) {
    best = lo;
    bestErr = loErr;
  }
  if (hiErr < bestErr && hi.den <= BigInt(maxDen) && hi.den > 0n) {
    best = hi;
  }
  hooks.onResult?.(best);
  return best;
}
