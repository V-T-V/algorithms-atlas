// =============================================================================
// K-Medoids 聚类（PAM 算法）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 与 K-Means 不同：簇代表必须是真实数据点（medoid），用任意距离/相异度均可。
// =============================================================================

/** 二维数据点。 */
export interface Point {
  x: number;
  y: number;
}

export interface KMedoidsResult {
  /** 每个点所属簇编号。 */
  assignments: number[];
  /** 每个簇的 medoid 在原数据集中的索引。 */
  medoidIndices: number[];
  /** 最终总代价（簇内距离和）。 */
  cost: number;
  /** 是否收敛（无交换能降低代价）。 */
  converged: boolean;
  /** 实际迭代轮数。 */
  iterations: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface KMedoidsHooks {
  /** 一轮迭代开始。 */
  onIteration?: (iter: number, medoidIndices: number[]) => void;
  /** 把第 i 个点分配给簇 k。 */
  onAssign?: (i: number, k: number, assignments: number[]) => void;
  /** 尝试用 o 替换 m：代价变化为 Δ（负数=改善）。accepted 表示是否采纳。 */
  onSwapTry?: (m: number, o: number, oldCost: number, newCost: number, accepted: boolean) => void;
}

/** mulberry32 伪随机数发生器（确定性）。 */
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

/** 欧氏距离。 */
function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export interface KMedoidsOptions {
  /** 簇数。 */
  k: number;
  /** 最大迭代轮数。默认 100。 */
  maxIterations?: number;
  /** 随机数发生器，用于初始化 medoid。默认 mulberry32(42)。 */
  rng?: () => number;
  /** 初始化种子（仅当未提供 rng 时生效）。默认 42。 */
  seed?: number;
}

/**
 * K-Medoids 聚类（PAM，Partitioning Around Medoids）。
 *
 * @param points 数据点
 * @param options 配置
 * @param hooks 可选的事件钩子
 */
export function kMedoids(
  points: Point[],
  options: KMedoidsOptions,
  hooks: KMedoidsHooks = {},
): KMedoidsResult {
  const { k } = options;
  const maxIterations = options.maxIterations ?? 100;
  const rng = options.rng ?? mulberry32(options.seed ?? 42);

  const n = points.length;
  const assignments = new Array<number>(n).fill(-1);

  if (n === 0 || k <= 0) {
    return { assignments, medoidIndices: [], cost: 0, converged: true, iterations: 0 };
  }
  if (k >= n) {
    const medoidIndices = Array.from({ length: n }, (_, i) => i);
    for (let i = 0; i < n; i++) assignments[i] = i;
    return { assignments, medoidIndices, cost: 0, converged: true, iterations: 0 };
  }

  // 初始化：随机选 k 个不重复的数据点作 medoid
  const pool = Array.from({ length: n }, (_, i) => i);
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(rng() * (n - i));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  const medoidIndices = pool.slice(0, k);

  /** 计算「每个点到最近 medoid 的距离」数组，并返回总代价。 */
  const assignAndCost = (): { nearest: number[]; dists: number[]; total: number } => {
    const nearest = new Array<number>(n).fill(0);
    const dists = new Array<number>(n).fill(0);
    let total = 0;
    for (let i = 0; i < n; i++) {
      let bestM = 0;
      let bestD = Infinity;
      for (let m = 0; m < k; m++) {
        const d = dist(points[i]!, points[medoidIndices[m]!]!);
        if (d < bestD) {
          bestD = d;
          bestM = m;
        }
      }
      nearest[i] = bestM;
      dists[i] = bestD;
      total += bestD;
    }
    return { nearest, dists, total };
  };

  let { nearest: curNearest, total: curCost } = assignAndCost();
  for (let i = 0; i < n; i++) assignments[i] = curNearest[i]!;

  let converged = false;
  let iter = 0;
  for (; iter < maxIterations; iter++) {
    hooks.onIteration?.(iter, [...medoidIndices]);

    let improved = false;
    // swap 尝试：对每个 medoid 位置 h，对每个非 medoid 数据点 o
    for (let h = 0; h < k; h++) {
      for (let o = 0; o < n; o++) {
        if (medoidIndices.includes(o)) continue;
        // 用 o 替换 medoidIndices[h]，重算代价
        const saved = medoidIndices[h]!;
        medoidIndices[h] = o;
        const { nearest, total } = assignAndCost();
        const accepted = total < curCost;
        hooks.onSwapTry?.(saved, o, curCost, total, accepted);
        if (accepted) {
          medoidIndices[h] = o; // keep
          curNearest = nearest;
          curCost = total;
          for (let i = 0; i < n; i++) assignments[i] = nearest[i]!;
          improved = true;
        } else {
          medoidIndices[h] = saved; // revert
        }
      }
    }

    hooks.onAssign?.(-1, -1, [...assignments]);
    if (!improved) {
      converged = true;
      break;
    }
    // 重新计算赋值与代价（驱动迭代）
    assignAndCost();
  }

  return {
    assignments,
    medoidIndices,
    cost: curCost,
    converged: converged || iter >= maxIterations,
    iterations: iter,
  };
}
