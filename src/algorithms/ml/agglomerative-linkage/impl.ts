// =============================================================================
// 凝聚层次聚类（链接策略）· 纯算法实现
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

export type Linkage = 'single' | 'complete' | 'average' | 'centroid';

export interface MergeStep {
  /** 合并的两个簇 id（合并后取较小者作为新 id）。 */
  a: number;
  b: number;
  /** 合并时的簇间距离。 */
  distance: number;
  /** 新簇包含的原点下标集合。 */
  members: number[];
}

export interface AgglomerativeResult {
  /** 合并序列（按发生顺序），长度 n-1。 */
  merges: MergeStep[];
  /** 每个点最终的簇标签（按目标簇数切分）。 */
  labels: number[];
}

export interface AgglomerativeHooks {
  /** 一次合并发生。 */
  onMerge?: (step: MergeStep) => void;
  /** 完成。 */
  onDone?: (result: AgglomerativeResult) => void;
}

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** 计算两簇（成员集合）间的链接距离。 */
function clusterDistance(
  membersA: number[],
  membersB: number[],
  points: readonly Point[],
  linkage: Linkage,
): number {
  if (linkage === 'single') {
    let m = Infinity;
    for (const i of membersA)
      for (const j of membersB) {
        const d = dist(points[i]!, points[j]!);
        if (d < m) m = d;
      }
    return m;
  }
  if (linkage === 'complete') {
    let m = -Infinity;
    for (const i of membersA)
      for (const j of membersB) {
        const d = dist(points[i]!, points[j]!);
        if (d > m) m = d;
      }
    return m;
  }
  if (linkage === 'average') {
    let sum = 0;
    let cnt = 0;
    for (const i of membersA)
      for (const j of membersB) {
        sum += dist(points[i]!, points[j]!);
        cnt++;
      }
    return cnt > 0 ? sum / cnt : 0;
  }
  // centroid
  const mean = (ms: number[]): Point => {
    const cx = ms.reduce((s, i) => s + points[i]!.x, 0) / ms.length;
    const cy = ms.reduce((s, i) => s + points[i]!.y, 0) / ms.length;
    return { x: cx, y: cy };
  };
  return dist(mean(membersA), mean(membersB));
}

/**
 * 凝聚层次聚类。
 * @param points 数据点
 * @param linkage 链接策略
 * @param targetClusters 目标簇数（停止合并当剩余簇数 = 此值），默认 1
 */
export function agglomerative(
  points: readonly Point[],
  linkage: Linkage = 'average',
  targetClusters = 1,
  hooks: AgglomerativeHooks = {},
): AgglomerativeResult {
  const n = points.length;
  if (n === 0) return { merges: [], labels: [] };
  if (targetClusters < 1 || targetClusters > n) {
    throw new RangeError(`targetClusters 须 ∈ [1, ${n}]，收到 ${targetClusters}`);
  }
  // 每个活动簇：id → 成员集合
  const clusters = new Map<number, number[]>();
  for (let i = 0; i < n; i++) clusters.set(i, [i]);

  const merges: MergeStep[] = [];
  while (clusters.size > targetClusters) {
    // 找最近两簇
    let bestD = Infinity;
    let bestA = -1;
    let bestB = -1;
    const ids = [...clusters.keys()];
    for (let x = 0; x < ids.length; x++) {
      for (let y = x + 1; y < ids.length; y++) {
        const d = clusterDistance(clusters.get(ids[x]!)!, clusters.get(ids[y]!)!, points, linkage);
        if (d < bestD) {
          bestD = d;
          bestA = ids[x]!;
          bestB = ids[y]!;
        }
      }
    }
    if (bestA === -1) break;
    const merged = [...clusters.get(bestA)!, ...clusters.get(bestB)!].sort((a, b) => a - b);
    clusters.delete(bestB);
    clusters.set(bestA, merged);
    const step: MergeStep = { a: bestA, b: bestB, distance: bestD, members: merged };
    merges.push(step);
    hooks.onMerge?.(step);
  }

  // 生成标签：剩余每个簇一个编号
  const labels = new Array(n).fill(-1);
  let labelId = 0;
  for (const members of clusters.values()) {
    for (const i of members) labels[i] = labelId;
    labelId++;
  }

  const result: AgglomerativeResult = { merges, labels };
  hooks.onDone?.(result);
  return result;
}
