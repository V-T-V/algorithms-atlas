// =============================================================================
// Mean-Shift（带带宽核）· 纯算法实现
// 高斯核加权均值漂移，收敛到密度模式。
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface MeanShiftResult {
  labels: number[];
  /** 各簇的模式点（收敛中心）。 */
  modes: Point[];
  iterations: number;
}

export interface MeanShiftHooks {
  /** 某起始点的第 iter 次漂移。 */
  onShift?: (pointIndex: number, iter: number, oldCenter: Point, newCenter: Point) => void;
  /** 一个点收敛到模式。 */
  onConverge?: (pointIndex: number, mode: Point) => void;
  /** 完成。 */
  onDone?: (result: MeanShiftResult) => void;
}

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * 单点 Mean-Shift 漂移直到收敛。
 */
function shiftOnce(center: Point, points: readonly Point[], bandwidth: number): Point {
  let sumX = 0;
  let sumY = 0;
  let sumW = 0;
  for (const p of points) {
    const d = dist(center, p) / bandwidth;
    const w = Math.exp(-(d * d) / 2); // 高斯核
    sumX += p.x * w;
    sumY += p.y * w;
    sumW += w;
  }
  if (sumW < 1e-12) return { ...center };
  return { x: sumX / sumW, y: sumY / sumW };
}

/**
 * Mean-Shift 聚类。
 * @param points 数据点（同时作为各起始点）
 * @param bandwidth 核带宽 h
 * @param maxIter 单点最大漂移次数
 * @param eps 收敛阈值（位移 < eps 视为收敛）
 * @param clusterEps 合并模式点的距离阈值
 */
export function meanShift(
  points: readonly Point[],
  bandwidth: number,
  maxIter = 100,
  eps = 1e-4,
  clusterEps = 0.1,
  hooks: MeanShiftHooks = {},
): MeanShiftResult {
  const n = points.length;
  if (n === 0) return { labels: [], modes: [], iterations: 0 };
  if (bandwidth <= 0) throw new RangeError(`bandwidth 须 > 0，收到 ${bandwidth}`);

  const modes: Point[] = [];
  const labels = new Array(n).fill(-1);
  let totalIters = 0;

  for (let i = 0; i < n; i++) {
    let center = { ...points[i]! };
    let iter = 0;
    for (; iter < maxIter; iter++) {
      const next = shiftOnce(center, points, bandwidth);
      const moved = dist(center, next);
      hooks.onShift?.(i, iter, center, next);
      center = next;
      if (moved < eps) break;
    }
    totalIters += iter;
    hooks.onConverge?.(i, center);
    // 归入已有模式或新建
    let foundIdx = -1;
    for (let m = 0; m < modes.length; m++) {
      if (dist(modes[m]!, center) < clusterEps) {
        foundIdx = m;
        break;
      }
    }
    if (foundIdx === -1) {
      modes.push(center);
      labels[i] = modes.length - 1;
    } else {
      labels[i] = foundIdx;
    }
  }

  const result: MeanShiftResult = { labels, modes, iterations: totalIters };
  hooks.onDone?.(result);
  return result;
}
