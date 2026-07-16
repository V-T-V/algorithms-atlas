// =============================================================================
// 连分数渐近分数（Continued Fraction Convergents）· 纯算法实现
// 给定简单连分数 [a0; a1, a2, …, an]，逐项计算其「渐近分数」h_k/k_k：
//   h_{-1}=1, h_0=a0；k_{-1}=0, k_0=1；
//   h_k = a_k·h_{k-1} + h_{k2}；k_k = a_k·k_{k-1} + k_{k-2}。
// 渐近分数是实数的最佳有理逼近。与 continued-fraction（求展开）区分，这里求收敛子。
// =============================================================================

export interface ConvergentHooks {
  onConvergent?: (k: number, h: number, kk: number) => void;
  onResult?: (convergents: Array<{ h: number; k: number }>) => void;
}

export interface Convergent {
  h: number; // 分子
  k: number; // 分母
}

/** 给定连分数系数 a[0..n]，返回所有渐近分数。用 BigInt 防溢出。 */
export function continuedFractionConvergents(
  a: readonly number[],
  hooks: ConvergentHooks = {},
): Convergent[] {
  if (a.length === 0) {
    hooks.onResult?.([]);
    return [];
  }
  const convs: Convergent[] = [];
  let hPrev2 = 1n;
  let hPrev1 = 0n;
  let kPrev2 = 0n;
  let kPrev1 = 1n;
  for (let i = 0; i < a.length; i++) {
    const ai = BigInt(a[i]!);
    const h = ai * hPrev1 + hPrev2;
    const k = ai * kPrev1 + kPrev2;
    convs.push({ h: Number(h), k: Number(k) });
    hooks.onConvergent?.(i, Number(h), Number(k));
    hPrev2 = hPrev1;
    hPrev1 = h;
    kPrev2 = kPrev1;
    kPrev1 = k;
  }
  hooks.onResult?.(convs);
  return convs;
}

/** 返回渐近分数的小数值（h/k）。 */
export function convergentValue(c: Convergent): number {
  return c.k === 0 ? Infinity : c.h / c.k;
}
