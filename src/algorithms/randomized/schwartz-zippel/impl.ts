// =============================================================================
// Schwartz-Zippel 多项式恒等测试 · 纯算法实现
// 在有限取值集合 S（这里用 [0, p) 的大整数）上随机取点检验 P ≡ 0。
// 支持一元系数表表示，以及多元乘积式 P = Π(x_i - a_i) 的快速求值。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每次试验，供录制器使用。
// =============================================================================

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** 事件钩子。 */
export interface SchwartzZippelHooks {
  /** 第 trial 次试验：随机取的点向量 r。 */
  onRandomPoint?: (trial: number, r: number[]) => void;
  /** 第 trial 次试验：P 在 r 处的取值。 */
  onEvaluate?: (trial: number, value: number, passed: boolean) => void;
  /** 每次试验结果（true=取非零，即确证 P≠0；false=取 0，仍可能恒等）。 */
  onTrial?: (trial: number, nonzero: boolean) => void;
  /** 最终结论（true=确证 P≠0；false=极可能 P≡0）。 */
  onResult?: (distinct: boolean, trialsRun: number) => void;
}

/** 确定性 RNG（Mulberry32）。 */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 一元多项式求值（Horner 法）。
 * @param coeffs 从高次到低次的系数，例如 [1,0,-1] 表示 x²-1
 * @param x 求值点
 */
export function evalPoly(coeffs: readonly number[], x: number): number {
  let acc = 0;
  for (const c of coeffs) acc = acc * x + c;
  return acc;
}

/**
 * 多元乘积式 P(r) = Π_i (r_i − a_i) 在点 r 处的取值。
 * 这是 Schwartz-Zippel 经典示例：若所有 a_i 都不等于 r_i 则 P≠0。
 */
export function evalProductPoly(anchors: readonly number[], r: readonly number[]): number {
  let prod = 1;
  for (let i = 0; i < anchors.length; i++) prod *= r[i]! - anchors[i]!;
  return prod;
}

/**
 * Schwartz-Zippel 恒等测试（多元乘积式情形）。
 *
 * 检验 P = Π_i (x_i − a_i) 是否为零多项式：随机取每个变量 ∈ [0, p)，
 * 若 P(r) ≠ 0 则 P 一定非零（恒等不成立）；若 k 次都为 0，则错误概率 ≤ (d/p)^k，
 * 其中 d = 变量个数 = 多项式总次数。
 *
 * @param anchors 乘积式中的锚点 a_i
 * @param p 取值集合大小（取值范围为 [0, p) 的整数）
 * @param k 试验次数
 * @param rng [0,1) 随机源
 * @param hooks 可选钩子
 * @returns true=确证 P≠0；false=极可能 P≡0（即所有锚点在 [0,p) 上恰好都命中）
 */
export function schwartzZippelProduct(
  anchors: readonly number[],
  p: number,
  k: number,
  rng: Rng = Math.random,
  hooks: SchwartzZippelHooks = {},
): boolean {
  const n = anchors.length;
  for (let t = 0; t < k; t++) {
    const r = new Array<number>(n);
    for (let i = 0; i < n; i++) r[i] = Math.floor(rng() * p);
    hooks.onRandomPoint?.(t, r);
    const value = evalProductPoly(anchors, r);
    const nonzero = value !== 0;
    hooks.onEvaluate?.(t, value, nonzero);
    hooks.onTrial?.(t, nonzero);
    if (nonzero) {
      hooks.onResult?.(true, t + 1);
      return true; // P 一定非零
    }
  }
  hooks.onResult?.(false, k);
  return false; // 极可能 P≡0
}

/**
 * Schwartz-Zippel 恒等测试（一元多项式情形）。
 *
 * 检验 coeffs 表示的一元多项式是否为零多项式：随机取 x ∈ [0, p)，
 * 若 P(x) ≠ 0 则 P 一定非零；错误概率 ≤ d/p（d=次数）。
 *
 * @param coeffs 从高次到低次的系数
 * @param p 取值集合大小
 * @param k 试验次数
 * @param rng [0,1) 随机源
 * @param hooks 可选钩子
 */
export function schwartzZippelUnivariate(
  coeffs: readonly number[],
  p: number,
  k: number,
  rng: Rng = Math.random,
  hooks: SchwartzZippelHooks = {},
): boolean {
  for (let t = 0; t < k; t++) {
    const x = Math.floor(rng() * p);
    hooks.onRandomPoint?.(t, [x]);
    const value = evalPoly(coeffs, x);
    const nonzero = value !== 0;
    hooks.onEvaluate?.(t, value, nonzero);
    hooks.onTrial?.(t, nonzero);
    if (nonzero) {
      hooks.onResult?.(true, t + 1);
      return true;
    }
  }
  hooks.onResult?.(false, k);
  return false;
}
