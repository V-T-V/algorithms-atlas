// =============================================================================
// BIRCH 聚类（CF 树）· 纯算法实现
// 聚类特征 CF = (N, LS, SS)，单遍扫描建叶条目。
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

/** 聚类特征 CF = (N, LSx, LSy, SS)。 */
export interface CF {
  n: number;
  lsX: number;
  lsY: number;
  ss: number;
}

/** 叶子子簇条目。 */
export interface CFEntry {
  cf: CF;
  /** 成员点的原下标（便于标签映射）。 */
  members: number[];
  /** 质心（由 CF 推导）。 */
  centroid: Point;
  /** 半径。 */
  radius: number;
}

export interface BirchResult {
  /** 叶子子簇条目。 */
  entries: CFEntry[];
  /** 每个点的最终簇标签。 */
  labels: number[];
}

export interface BirchHooks {
  /** 插入一个点。 */
  onInsert?: (pointIndex: number, entryIndex: number) => void;
  /** 新建一个叶条目。 */
  onCreateEntry?: (entryIndex: number) => void;
  /** 完成。 */
  onDone?: (result: BirchResult) => void;
}

/** 由点列表计算 CF。 */
function cfOf(points: Point[]): CF {
  let lsX = 0;
  let lsY = 0;
  let ss = 0;
  for (const p of points) {
    lsX += p.x;
    lsY += p.y;
    ss += p.x * p.x + p.y * p.y;
  }
  return { n: points.length, lsX, lsY, ss };
}

/** 两个 CF 合并后若加入点 p 的半径（用 D0 距离：平均欧氏）。 */
function radiusAfter(entry: CFEntry, p: Point): number {
  const n1 = entry.cf.n;
  const lsX = entry.cf.lsX + p.x;
  const lsY = entry.cf.lsY + p.y;
  const ss = entry.cf.ss + p.x * p.x + p.y * p.y;
  const n = n1 + 1;
  // 半径 = √(SS/N − ||LS/N||²)
  const cX = lsX / n;
  const cY = lsY / n;
  return Math.sqrt(Math.max(0, ss / n - (cX * cX + cY * cY)));
}

/**
 * BIRCH 聚类（单遍扫描，半径阈值 T）。
 * @param points 数据点
 * @param threshold 子簇半径阈值 T（加入点后半径不得超过此值）
 */
export function birch(
  points: readonly Point[],
  threshold: number,
  hooks: BirchHooks = {},
): BirchResult {
  const n = points.length;
  if (n === 0) return { entries: [], labels: [] };
  if (threshold < 0) throw new RangeError(`threshold 须 >= 0，收到 ${threshold}`);

  const entries: CFEntry[] = [];

  for (let i = 0; i < n; i++) {
    const p = points[i]!;
    // 找最近的叶条目（按质心欧氏距离）
    let bestIdx = -1;
    let bestD = Infinity;
    for (let e = 0; e < entries.length; e++) {
      const dx = entries[e]!.centroid.x - p.x;
      const dy = entries[e]!.centroid.y - p.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestD) {
        bestD = d;
        bestIdx = e;
      }
    }
    // 若最近条目加入 p 后半径 <= T 则吸收
    if (bestIdx !== -1 && radiusAfter(entries[bestIdx]!, p) <= threshold) {
      const entry = entries[bestIdx]!;
      entry.cf.n += 1;
      entry.cf.lsX += p.x;
      entry.cf.lsY += p.y;
      entry.cf.ss += p.x * p.x + p.y * p.y;
      entry.members.push(i);
      // 重算质心与半径
      entry.centroid = { x: entry.cf.lsX / entry.cf.n, y: entry.cf.lsY / entry.cf.n };
      entry.radius = Math.sqrt(
        Math.max(0, entry.cf.ss / entry.cf.n - (entry.centroid.x ** 2 + entry.centroid.y ** 2)),
      );
      hooks.onInsert?.(i, bestIdx);
    } else {
      // 新建叶条目
      const idx = entries.length;
      const cf = cfOf([p]);
      entries.push({
        cf,
        members: [i],
        centroid: { x: p.x, y: p.y },
        radius: 0,
      });
      hooks.onCreateEntry?.(idx);
      hooks.onInsert?.(i, idx);
    }
  }

  // 标签：每个点取其所属条目的下标
  const labels = new Array(n).fill(-1);
  for (let e = 0; e < entries.length; e++) {
    for (const m of entries[e]!.members) labels[m] = e;
  }

  const result: BirchResult = { entries, labels };
  hooks.onDone?.(result);
  return result;
}
