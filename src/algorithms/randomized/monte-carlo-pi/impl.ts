// =============================================================================
// 蒙特卡洛求 π（Monte Carlo Pi）· 纯算法实现
// 在单位正方形 [0,1]×[0,1] 内随机撒点；落在 1/4 圆（x²+y² ≤ 1）内的比例约等于 π/4。
// 固定种子 rng 保证可复现。零 DOM 依赖，可独立单测。
// =============================================================================

/** 产生 [0,1) 区间浮点数的确定性伪随机源类型。 */
export type Rng = () => number;

/**
 * Mulberry32：轻量快速的 32 位 PRNG，可复现。
 * 同一种子产生同一序列，便于 buildTrace 与单测断言。
 */
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

/** 一个采样点。 */
export interface Point {
  x: number;
  y: number;
  /** 是否落在 1/4 圆内（x²+y² ≤ 1）。 */
  inside: boolean;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MonteCarloHooks {
  /** 投下一个点。给出点坐标、是否在圆内、当前内计数与总计数。 */
  onSample?: (p: Point, insideCount: number, totalCount: number) => void;
  /** 每投 batchSize 个点后，更新一次 π 估计。给出当前估计与总点数。 */
  onBatch?: (piEstimate: number, totalCount: number) => void;
}

export interface MonteCarloResult {
  /** π 的估计值 = 4 × inside / total。 */
  pi: number;
  /** 落在 1/4 圆内的点数。 */
  insideCount: number;
  /** 总采样点数。 */
  totalCount: number;
  /** 全部采样点（演示用；大规模时可用 onSample 流式处理）。 */
  points: Point[];
}

/**
 * 蒙特卡洛求 π。
 *
 * **原理**：单位正方形 [0,1]² 面积为 1，其中 1/4 单位圆（x²+y² ≤ 1）面积为 π/4。
 * 均匀随机撒点后，落在圆内的比例 ≈ π/4，故 `π ≈ 4 × inside / total`。
 *
 * **步骤**：投 n 个点，统计 inside；每 batchSize 个点回调一次估计值。
 * 误差按 `O(1/√n)` 收敛（中心极限定理），即精度每提升一位需百倍样本。
 *
 * @param n 采样点数
 * @param rng [0,1) 随机源；默认 Math.random（不可复现）。建议传 mulberry32(seed)
 * @param batchSize 每多少点更新一次估计（默认 n/10 向下取整，至少 1）
 * @param hooks 可选事件钩子
 */
export function monteCarloPi(
  n: number,
  rng: Rng = Math.random,
  batchSize: number = Math.max(1, Math.floor(n / 10)),
  hooks: MonteCarloHooks = {},
): MonteCarloResult {
  let insideCount = 0;
  const points: Point[] = [];

  for (let i = 0; i < n; i++) {
    const x = rng();
    const y = rng();
    const inside = x * x + y * y <= 1;
    if (inside) insideCount++;
    const p: Point = { x, y, inside };
    points.push(p);
    hooks.onSample?.(p, insideCount, i + 1);
    if ((i + 1) % batchSize === 0) {
      const piEst = (4 * insideCount) / (i + 1);
      hooks.onBatch?.(piEst, i + 1);
    }
  }

  const pi = n > 0 ? (4 * insideCount) / n : 0;
  return { pi, insideCount, totalCount: n, points };
}
