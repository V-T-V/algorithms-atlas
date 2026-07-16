// =============================================================================
// OPTICS 聚类 · 纯算法实现
// 输出可达性排序；提供基于陡度的 ξ 法簇提取。
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface OpticsOrderEntry {
  /** 点在原数组中的下标。 */
  index: number;
  /** 可达距离（起点为 ∞）。 */
  reachability: number;
  /** 核心距离（非核心点为 ∞）。 */
  coreDistance: number;
}

export interface OpticsResult {
  /** 可达性排序。 */
  order: OpticsOrderEntry[];
  /** 每个点的核心距离（按原下标）。 */
  coreDistances: number[];
}

export interface OpticsHooks {
  /** 处理（弹出）一个点，给出其可达距离。 */
  onProcess?: (index: number, reachability: number) => void;
  /** 更新某点的可达距离。 */
  onUpdate?: (index: number, newReachability: number) => void;
  /** 完成。 */
  onDone?: (result: OpticsResult) => void;
}

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** 求点 p 的 MinPts-近邻距离（即核心距离，受 ε 限制）。 */
function coreDistance(points: readonly Point[], p: number, eps: number, minPts: number): number {
  const dists: number[] = [];
  for (let i = 0; i < points.length; i++) {
    if (i === p) continue;
    const d = dist(points[p]!, points[i]!);
    if (d <= eps) dists.push(d);
  }
  // 需要 eps 邻域至少有 minPts-1 个其他点（连同自身 = minPts）
  if (dists.length < minPts - 1) return Infinity;
  dists.sort((a, b) => a - b);
  return dists[minPts - 2]!; // 第 (minPts-1) 小，连同自身共 minPts 个
}

/**
 * OPTICS 主流程：生成可达性排序。
 * @param points 数据点
 * @param eps 邻域半径上限
 * @param minPts 成为核心点所需的最少邻域点数（含自身）
 */
export function optics(
  points: readonly Point[],
  eps: number,
  minPts = 4,
  hooks: OpticsHooks = {},
): OpticsResult {
  const n = points.length;
  if (n === 0) return { order: [], coreDistances: [] };
  if (eps <= 0) throw new RangeError(`eps 须 > 0，收到 ${eps}`);
  if (minPts < 1) throw new RangeError(`minPts 须 >= 1，收到 ${minPts}`);

  // 预计算核心距离
  const coreDistances = points.map((_, p) => coreDistance(points, p, eps, minPts));
  const reachability = new Array(n).fill(Infinity);
  const processed = new Array(n).fill(false);
  const order: OpticsOrderEntry[] = [];

  // 种子：用数组 + 线性选最小（教学版，O(n²)）
  for (let start = 0; start < n; start++) {
    if (processed[start]) continue;
    // 处理 start
    processed[start] = true;
    order.push({
      index: start,
      reachability: reachability[start]!,
      coreDistance: coreDistances[start]!,
    });
    hooks.onProcess?.(start, reachability[start]!);

    // 更新种子
    const updateSeeds = (center: number): void => {
      for (let i = 0; i < n; i++) {
        if (processed[i]) continue;
        const d = dist(points[center]!, points[i]!);
        if (d > eps) continue;
        const cdist = coreDistances[center]!;
        const r = Math.max(cdist, d);
        if (r < reachability[i]!) {
          reachability[i] = r;
          hooks.onUpdate?.(i, r);
        }
      }
    };
    updateSeeds(start);

    // 反复取可达距离最小的未处理点
    while (true) {
      let next = -1;
      let best = Infinity;
      for (let i = 0; i < n; i++) {
        if (!processed[i] && reachability[i]! < best) {
          best = reachability[i]!;
          next = i;
        }
      }
      if (next === -1) break;
      processed[next] = true;
      order.push({
        index: next,
        reachability: reachability[next]!,
        coreDistance: coreDistances[next]!,
      });
      hooks.onProcess?.(next, reachability[next]!);
      updateSeeds(next);
    }
  }

  const result: OpticsResult = { order, coreDistances };
  hooks.onDone?.(result);
  return result;
}

/**
 * 从 OPTICS 排序提取 DBSCAN 风格的簇（ε' < eps）。
 * 可达距离 > ε' 的点视为噪声/簇间分隔。
 * @returns 每个点的簇编号（-1 = 噪声）
 */
export function extractDBSCAN(order: readonly OpticsOrderEntry[], epsPrime: number): number[] {
  const label = new Array<number>(order.length).fill(-1);
  let clusterId = 0;
  for (let i = 0; i < order.length; i++) {
    const r = order[i]!.reachability;
    if (r > epsPrime) {
      // 边界：若该点核心距离 ≤ ε' 则开新簇，否则噪声
      if (order[i]!.coreDistance <= epsPrime) {
        clusterId++;
        label[i] = clusterId - 1;
      } else {
        label[i] = -1;
      }
    } else {
      label[i] = clusterId - 1; // 当前簇
    }
  }
  return label;
}
