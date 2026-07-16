// =============================================================================
// 连分数 Continued Fraction · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ContinuedFractionHooks {
  /** 提取一个部分商 a_k（当前剩余 num/den）。 */
  onCoefficient?: (k: number, a: bigint, num: bigint, den: bigint) => void;
  /** 展开 / 收敛完成。 */
  onResult?: (coeffs: bigint[]) => void;
}

/**
 * 连分数展开：把有理数 `p/q` 展开为**简单连分数** `[a_0; a_1, a_2, …]`。
 *
 * 原理：与欧几里得算法同构——\n- `a_k = ⌊p/q⌋`，余 `r = p mod q`\n- 下一轮 `p, q ← q, r`，直到 `r = 0`\n\n对有理数，展开必有限终止。
 *
 * 同时提供 `fromCoeffs` 把连分数系数还原为分数 `[num, den]`（用于验证）。
 *
 * - 时间 `O(log max(p,q))`（与欧几里得同阶）
 * - 空间 `O(log max)`（系数个数）
 *
 * @param p 分子（整数）
 * @param q 分母（非零整数）
 * @param hooks 可选的事件钩子
 * @returns 连分数系数 `[a_0, a_1, …, a_n]`（BigInt）
 */
export function continuedFraction(
  p: number,
  q: number,
  hooks: ContinuedFractionHooks = {},
): bigint[] {
  if (q === 0) throw new RangeError('continuedFraction: denominator must be non-zero');
  let num = BigInt(p);
  let den = BigInt(q);
  // 保证 den > 0
  if (den < 0n) {
    num = -num;
    den = -den;
  }
  const coeffs: bigint[] = [];
  let k = 0;
  while (den !== 0n) {
    const a = num / den; // 向下取整（den > 0）
    coeffs.push(a);
    hooks.onCoefficient?.(k, a, num, den);
    const r = num - a * den;
    num = den;
    den = r;
    k++;
  }
  // 规范化：末项若为 1（且长度 > 1），合并到前一项 [..., x, 1] == [..., x+1]
  if (coeffs.length > 1 && coeffs[coeffs.length - 1] === 1n) {
    coeffs[coeffs.length - 2]! += 1n;
    coeffs.pop();
  }
  hooks.onResult?.(coeffs);
  return coeffs;
}

/**
 * 由连分数系数还原为分数 `[num, den]`（既约）。
 * 用「收敛数」递推：`h_{-1}=1, h_0=a_0;  k_{-1}=0, k_0=1;
 *   h_i = a_i·h_{i-1} + h_{i-2},  k_i = a_i·k_{i-1} + k_{i-2}`。
 */
export function fromContinuedFraction(coeffs: ReadonlyArray<number | bigint>): [bigint, bigint] {
  if (coeffs.length === 0) return [0n, 1n];
  let hPrev2 = 0n; // h_{-2}
  let hPrev1 = 1n; // h_{-1}
  let kPrev2 = 1n; // k_{-2}
  let kPrev1 = 0n; // k_{-1}
  for (let i = 0; i < coeffs.length; i++) {
    const a = BigInt(coeffs[i]!);
    const h = a * hPrev1 + hPrev2;
    const k = a * kPrev1 + kPrev2;
    hPrev2 = hPrev1;
    hPrev1 = h;
    kPrev2 = kPrev1;
    kPrev1 = k;
  }
  return [hPrev1, kPrev1];
}
