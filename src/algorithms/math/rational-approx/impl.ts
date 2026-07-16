// =============================================================================
// 有理逼近 Rational Approximation · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 一个有理逼近结果 p/q。 */
export interface Rational {
  num: bigint;
  den: bigint;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RationalApproxHooks {
  /** 每产生一个收敛数 h_k/k_k。 */
  onConvergent?: (k: number, c: Rational, error: number) => void;
  /** 最终结果。 */
  onResult?: (best: Rational, error: number) => void;
}

/**
 * 有理逼近：用**连分数收敛数**寻找实数 `x` 的最佳有理近似 `p/q`（`q ≤ maxDen`）。
 *
 * 原理：对 `x` 反复取 `a_k = ⌊x⌋`、`x ← 1/(x − a_k)`，得到连分数系数 `[a_0, a_1, …]`；
 * 其**收敛数** `h_k/k_k` 满足「在所有分母 ≤ k_k 的分数中，它最接近 x」。
 * 当某个收敛数的分母超过 `maxDen` 时停止，取最后有效的收敛数（必要时再线性插值
 * 取一个介于前后两个收敛数之间、分母恰 ≤ maxDen 的更优解，即半收敛数）。
 *
 * 对无理数（如 √2、π）展开不终止；用浮点近似，迭代到 `maxIter` 次或 `maxDen` 超限。
 *
 * - 时间 `O(log maxDen)`，空间 `O(log maxDen)`
 *
 * @param x 待逼近的实数
 * @param maxDen 分母上限（正整数）
 * @param hooks 可选的事件钩子
 * @returns 最佳有理逼近 `{ num, den }`
 */
export function rationalApprox(
  x: number,
  maxDen: number,
  hooks: RationalApproxHooks = {},
): Rational {
  if (maxDen <= 0) throw new RangeError('rationalApprox: maxDen must be positive');
  const maxIter = 64;

  // 连分数展开（基于浮点）
  const coeffs: number[] = [];
  let frac = x;
  for (let i = 0; i < maxIter; i++) {
    const a = Math.floor(frac);
    coeffs.push(a);
    const r = frac - a;
    if (r < 1e-12) break;
    frac = 1 / r;
  }

  // 由收敛数递推 h/k
  let hPrev2 = 0n;
  let hPrev1 = 1n;
  let kPrev2 = 1n;
  let kPrev1 = 0n;
  let best: Rational = { num: 0n, den: 1n };
  let bestErr = Math.abs(x);

  for (let i = 0; i < coeffs.length; i++) {
    const a = BigInt(coeffs[i]!);
    const h = a * hPrev1 + hPrev2;
    const k = a * kPrev1 + kPrev2;
    if (k > BigInt(maxDen)) {
      // 半收敛：在 [hPrev1/kPrev1, h/k] 之间取最大 a' 使分母 ≤ maxDen
      // 解 (hPrev2 + a'·hPrev1) / (kPrev2 + a'·kPrev1) ≤ maxDen 的最大 a'
      if (kPrev1 > 0n) {
        const maxA = (BigInt(maxDen) - kPrev2) / kPrev1;
        if (maxA >= 1n) {
          const hh = maxA * hPrev1 + hPrev2;
          const kk = maxA * kPrev1 + kPrev2;
          const err = Math.abs(Number(hh) / Number(kk) - x);
          hooks.onConvergent?.(i, { num: hh, den: kk }, err);
          if (err < bestErr) {
            best = { num: hh, den: kk };
            bestErr = err;
          }
        }
      }
      break;
    }
    const err = Math.abs(Number(h) / Number(k) - x);
    hooks.onConvergent?.(i, { num: h, den: k }, err);
    if (err < bestErr) {
      best = { num: h, den: k };
      bestErr = err;
    }
    hPrev2 = hPrev1;
    hPrev1 = h;
    kPrev2 = kPrev1;
    kPrev1 = k;
  }

  hooks.onResult?.(best, bestErr);
  return best;
}
