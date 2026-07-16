// =============================================================================
// 小批量 K-均值（Mini-Batch K-Means）· 纯算法实现
// 零 DOM 依赖，可独立单测。支持确定性 mulberry32 RNG。
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface MiniBatchKMeansResult {
  assignments: number[];
  centroids: Point[];
  iterations: number;
  converged: boolean;
}

export interface MiniBatchKMeansHooks {
  /** 第 iter 轮开始（iter 从 0 计）。 */
  onIteration?: (iter: number, centroids: Point[]) => void;
  /** 把小批量中的样本 i 分配到簇 k。 */
  onAssign?: (i: number, k: number) => void;
  /** 簇 k 的质心被增量更新（n_k 为该簇累计计数）。 */
  onUpdateCentroid?: (k: number, newCentroid: Point, nk: number) => void;
  /** 完成。 */
  onDone?: (result: MiniBatchKMeansResult) => void;
}

/** 确定性伪随机数发生器 mulberry32。 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dist2(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/** 用前 K 个点初始化质心（确定性）。 */
function initCentroids(points: readonly Point[], k: number, rng: () => number): Point[] {
  if (points.length === 0) throw new RangeError('点集不能为空');
  if (k > points.length) throw new RangeError(`K(${k}) 不能大于样本数 ${points.length}`);
  const idx = [...points.keys()];
  // Fisher-Yates 抽 K 个
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j]!, idx[i]!];
  }
  return idx.slice(0, k).map((i) => ({ ...points[i]! }));
}

/**
 * 小批量 K-均值。
 * @param points 数据点
 * @param k 簇数
 * @param batchSize 小批量大小
 * @param maxIter 最大迭代轮数
 * @param seed RNG 种子（保证可复现）
 */
export function miniBatchKMeans(
  points: readonly Point[],
  k: number,
  batchSize = 10,
  maxIter = 100,
  seed = 42,
  hooks: MiniBatchKMeansHooks = {},
): MiniBatchKMeansResult {
  if (k < 1) throw new RangeError(`K 须 >= 1，收到 ${k}`);
  if (batchSize < 1) throw new RangeError(`batchSize 须 >= 1，收到 ${batchSize}`);
  const rng = mulberry32(seed);
  const centroids = initCentroids(points, k, rng);
  const counts = new Array(k).fill(0); // 每簇已见样本数 n_k
  const n = points.length;
  const b = Math.min(batchSize, n);

  let converged = false;
  let iter = 0;
  for (; iter < maxIter; iter++) {
    hooks.onIteration?.(
      iter,
      centroids.map((c) => ({ ...c })),
    );
    // 抽一个小批量
    const batch: number[] = [];
    for (let s = 0; s < b; s++) batch.push(Math.floor(rng() * n));
    let totalShift = 0;
    for (const i of batch) {
      const p = points[i]!;
      // 找最近质心
      let bestK = 0;
      let bestD = Infinity;
      for (let c = 0; c < k; c++) {
        const d = dist2(p, centroids[c]!);
        if (d < bestD) {
          bestD = d;
          bestK = c;
        }
      }
      hooks.onAssign?.(i, bestK);
      // 增量更新：η = 1/(n_k+1)
      counts[bestK]! += 1;
      const eta = 1 / counts[bestK]!;
      const old = { ...centroids[bestK]! };
      centroids[bestK] = {
        x: old.x + eta * (p.x - old.x),
        y: old.y + eta * (p.y - old.y),
      };
      totalShift += dist2(old, centroids[bestK]!);
      hooks.onUpdateCentroid?.(bestK, { ...centroids[bestK]! }, counts[bestK]!);
    }
    // 收敛判据：本轮质心几乎不动
    if (totalShift < 1e-6 * b) {
      converged = true;
      break;
    }
  }

  // 最终分配所有点
  const assignments = points.map((p) => {
    let bestK = 0;
    let bestD = Infinity;
    for (let c = 0; c < k; c++) {
      const d = dist2(p, centroids[c]!);
      if (d < bestD) {
        bestD = d;
        bestK = c;
      }
    }
    return bestK;
  });

  const result: MiniBatchKMeansResult = { assignments, centroids, iterations: iter + 1, converged };
  hooks.onDone?.(result);
  return result;
}
