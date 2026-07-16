// =============================================================================
// 蒙特卡洛积分（通用版）· 纯算法实现
// 在包围盒 [a,b]×[c,d] 内随机采样估计 ∫_a^b f(x) dx。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** 一个采样点。 */
export interface SamplePoint {
  x: number;
  y: number;
  /** 是否落在曲线下方（y ≤ f(x)）。 */
  under: boolean;
}

/** 事件钩子。 */
export interface MonteCarloIntegralHooks {
  /** 投下一个点。给出点、当前下方计数与总计数。 */
  onSample?: (p: SamplePoint, underCount: number, totalCount: number) => void;
  /** 每投 batchSize 个点后，更新一次积分估计。 */
  onBatch?: (estimate: number, totalCount: number) => void;
  /** 完成。 */
  onDone?: (estimate: number, totalCount: number, underCount: number) => void;
}

/** 确定性 RNG（Mulberry32）。 */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface MonteCarloIntegralResult {
  /** 积分估计值。 */
  estimate: number;
  /** 总采样点数。 */
  totalCount: number;
  /** 落在曲线下方的点数。 */
  underCount: number;
  /** 全部采样点（演示用）。 */
  points: SamplePoint[];
}

/**
 * 蒙特卡洛积分：估计 ∫_a^b f(x) dx。
 *
 * 在包围盒 [a,b]×[c,d] 内均匀投点；积分估计为：
 *   integral ≈ c·(b−a) + (under/total) · (b−a)(d−c)
 * （当 c ≤ 0 ≤ d 时需注意：本实现要求包围盒已合理给出）
 *
 * @param f 被积函数
 * @param a 区间左端
 * @param b 区间右端
 * @param c 函数值下界（包围盒下边）
 * @param d 函数值上界（包围盒上边）
 * @param n 采样点数
 * @param rng [0,1) 随机源
 * @param batchSize 每多少点更新一次估计
 * @param hooks 可选事件钩子
 */
export function monteCarloIntegrate(
  f: (x: number) => number,
  a: number,
  b: number,
  c: number,
  d: number,
  n: number,
  rng: Rng = Math.random,
  batchSize: number = Math.max(1, Math.floor(n / 10)),
  hooks: MonteCarloIntegralHooks = {},
): MonteCarloIntegralResult {
  const boxArea = (b - a) * (d - c);
  const baseline = c * (b - a); // c·(b−a)
  let underCount = 0;
  const points: SamplePoint[] = [];

  for (let i = 0; i < n; i++) {
    const x = a + (b - a) * rng();
    const y = c + (d - c) * rng();
    const under = y <= f(x);
    if (under) underCount++;
    const p: SamplePoint = { x, y, under };
    points.push(p);
    hooks.onSample?.(p, underCount, i + 1);
    if ((i + 1) % batchSize === 0) {
      const estimate = baseline + (underCount / (i + 1)) * boxArea;
      hooks.onBatch?.(estimate, i + 1);
    }
  }

  const estimate = n > 0 ? baseline + (underCount / n) * boxArea : 0;
  hooks.onDone?.(estimate, n, underCount);
  return { estimate, totalCount: n, underCount, points };
}
