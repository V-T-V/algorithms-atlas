// =============================================================================
// K-均值聚类 K-Means Clustering · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 支持可选的确定性 RNG（mulberry32 种子），保证 buildTrace 与测试可复现。
// =============================================================================

/** 二维数据点。 */
export interface Point {
  x: number;
  y: number;
}

export interface KMeansResult {
  /** 每个点的最终簇编号（-1 表示未分配，理论上不会出现）。 */
  assignments: number[];
  /** 每个簇的最终质心。 */
  centroids: Point[];
  /** 质心在最后一次迭代是否还发生变化。 */
  converged: boolean;
  /** 实际迭代轮数。 */
  iterations: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface KMeansHooks {
  /** 一轮迭代开始（第 iter 轮，从 0 计）。 */
  onIteration?: (iter: number, centroids: Point[]) => void;
  /** 把第 i 个点分配给簇 k。 */
  onAssign?: (i: number, k: number, assignments: number[]) => void;
  /** 更新簇 k 的质心为新的位置。 */
  onUpdateCentroid?: (k: number, centroid: Point, centroids: Point[]) => void;
}

/** mulberry32 伪随机数发生器：给定种子产生确定的 [0,1) 序列。 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function (): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 欧氏距离平方（省去开方，比较结果等价且更快）。 */
function distSq(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export interface KMeansOptions {
  /** 簇数。 */
  k: number;
  /** 最大迭代轮数。默认 100。 */
  maxIterations?: number;
  /** 质心位移阈值（小于则认为收敛）。默认 1e-6。 */
  tolerance?: number;
  /** 随机数发生器，用于初始化质心。默认 mulberry32(42)。 */
  rng?: () => number;
  /** 初始化种子（仅当未提供 rng 时生效）。默认 42。 */
  seed?: number;
}

/**
 * K-Means 聚类（Lloyd 算法）。
 *
 * 初始化用「随机选取数据点」策略（k-means 简化版）。
 *
 * @param points 数据点
 * @param options 配置
 * @param hooks 可选的事件钩子
 */
export function kmeans(
  points: Point[],
  options: KMeansOptions,
  hooks: KMeansHooks = {},
): KMeansResult {
  const { k } = options;
  const maxIterations = options.maxIterations ?? 100;
  const tolerance = options.tolerance ?? 1e-6;
  const rng = options.rng ?? mulberry32(options.seed ?? 42);

  const n = points.length;
  const assignments = new Array<number>(n).fill(-1);

  if (n === 0 || k <= 0) {
    return { assignments, centroids: [], converged: true, iterations: 0 };
  }
  if (k >= n) {
    // 每点自成一簇
    const centroids = points.map((p) => ({ x: p.x, y: p.y }));
    for (let i = 0; i < n; i++) assignments[i] = i;
    return { assignments, centroids, converged: true, iterations: 0 };
  }

  // 初始化：随机选 k 个不重复的数据点作质心
  const indices = new Set<number>();
  const centroids: Point[] = [];
  // 先按序选，再用 rng 在整个集合上扰动选取（保证确定且去重）
  const pool = Array.from({ length: n }, (_, i) => i);
  // Fisher-Yates 洗牌前 k 个
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(rng() * (n - i));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
    indices.add(pool[i]!);
    const p = points[pool[i]!]!;
    centroids.push({ x: p.x, y: p.y });
  }

  let converged = false;
  let iter = 0;

  for (; iter < maxIterations; iter++) {
    hooks.onIteration?.(
      iter,
      centroids.map((c) => ({ ...c })),
    );

    // 1. 分配：每个点归到最近质心
    let changed = false;
    for (let i = 0; i < n; i++) {
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < k; c++) {
        const d = distSq(points[i]!, centroids[c]!);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      if (assignments[i] !== best) {
        assignments[i] = best;
        changed = true;
      }
      hooks.onAssign?.(i, best, [...assignments]);
    }

    // 2. 更新质心 = 各簇点的均值
    const sums = Array.from({ length: k }, () => ({ x: 0, y: 0, count: 0 }));
    for (let i = 0; i < n; i++) {
      const c = assignments[i]!;
      sums[c]!.x += points[i]!.x;
      sums[c]!.y += points[i]!.y;
      sums[c]!.count++;
    }

    let maxMove = 0;
    for (let c = 0; c < k; c++) {
      const s = sums[c]!;
      if (s.count === 0) continue; // 空簇：保留原质心
      const nx = s.x / s.count;
      const ny = s.y / s.count;
      const move = Math.hypot(nx - centroids[c]!.x, ny - centroids[c]!.y);
      if (move > maxMove) maxMove = move;
      centroids[c] = { x: nx, y: ny };
      hooks.onUpdateCentroid?.(
        c,
        { x: nx, y: ny },
        centroids.map((cc) => ({ ...cc })),
      );
    }

    if (!changed && maxMove < tolerance) {
      converged = true;
      break;
    }
  }

  return {
    assignments,
    centroids,
    converged: converged || iter >= maxIterations,
    iterations: iter,
  };
}
