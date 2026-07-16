// =============================================================================
// KD树 KD-Tree · 纯算法实现（零 DOM 依赖，可独立单测）
// 实现：k=2 的 KD 树，交替以 x / y 轴中位数切分，支持最近邻搜索。
//   - 建树 O(n log n)：每层按当前轴排序取中位数为根，递归构造左右子树
//   - 最近邻查询 O(log n) 期望：递归下行 + 回溯剪枝（用分割超平面距离剪枝）
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 建树 / 查询过程中的事件钩子。任一可选。 */
export interface KDTreeHooks {
  /** 建树：选中点 idx 作为当前轴 axis 的分割节点（深度 depth）。 */
  onSplit?: (idx: number, axis: 'x' | 'y', depth: number) => void;
  /** 查询：访问节点 idx，当前最佳距离 best。 */
  onVisit?: (idx: number, best: number) => void;
  /** 查询：更新最佳点（newIdx, newDist）。 */
  onUpdateBest?: (newIdx: number, newDist: number) => void;
  /** 查询：剪枝掉某子树（因为分割面距离 >= best）。 */
  onPrune?: (idx: number) => void;
  /** 查询：需要回溯检查另一侧子树。 */
  onBacktrack?: (idx: number) => void;
  /** 最近邻查询结束。 */
  onResult?: (target: Point, nearestIdx: number, dist: number) => void;
}

/** KD 树节点。 */
interface KDNode {
  idx: number; // 对应原点集下标
  axis: 0 | 1; // 0=x, 1=y
  left: KDNode | null;
  right: KDNode | null;
}

/** 平方欧氏距离（避免开方，比较等价）。 */
function distSq(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/**
 * KD 树（2D）：建树 + 最近邻查询。
 */
export class KDTree {
  readonly points: Point[];
  readonly root: KDNode | null;

  constructor(points: readonly Point[], hooks: KDTreeHooks = {}) {
    this.points = points.map((p) => ({ x: p.x, y: p.y }));
    const idxList = this.points.map((_, i) => i);
    this.root = this.build(idxList, 0, hooks);
  }

  /** 递归建树。 */
  private build(idxList: number[], depth: number, hooks: KDTreeHooks): KDNode | null {
    if (idxList.length === 0) return null;
    const axis: 0 | 1 = depth % 2 === 0 ? 0 : 1;
    // 按当前轴排序取中位数
    const sorted = [...idxList].sort((a, b) => {
      const pa = this.points[a]!;
      const pb = this.points[b]!;
      return axis === 0 ? pa.x - pb.x : pa.y - pb.y;
    });
    const mid = sorted.length >> 1;
    const idx = sorted[mid]!;
    hooks.onSplit?.(idx, axis === 0 ? 'x' : 'y', depth);
    const node: KDNode = {
      idx,
      axis,
      left: this.build(sorted.slice(0, mid), depth + 1, hooks),
      right: this.build(sorted.slice(mid + 1), depth + 1, hooks),
    };
    return node;
  }

  /** 最近邻查询：返回最近点的下标与距离（真实距离，非平方）。 */
  nearest(target: Point, hooks: KDTreeHooks = {}): { idx: number; dist: number } | null {
    if (!this.root) return null;
    let bestIdx = -1;
    let bestDist = Infinity;

    const search = (node: KDNode | null, depth: number): void => {
      if (!node) return;
      const p = this.points[node.idx]!;
      const d = distSq(p, target);
      hooks.onVisit?.(node.idx, Math.sqrt(bestDist));
      // 距离严格更小，或等距但下标更小（与暴力遍历一致）才更新
      if (d < bestDist || (d === bestDist && node.idx < bestIdx)) {
        bestDist = d;
        bestIdx = node.idx;
        hooks.onUpdateBest?.(node.idx, Math.sqrt(d));
      }
      const axis = node.axis;
      const diff = axis === 0 ? target.x - p.x : target.y - p.y;
      const [near, far] = diff < 0 ? [node.left, node.right] : [node.right, node.left];
      // 先走近侧
      search(near, depth + 1);
      // 回溯：检查远侧是否可能更优（分割面距离平方 <= bestDist，含等距）
      if (far && diff * diff <= bestDist) {
        hooks.onBacktrack?.(node.idx);
        search(far, depth + 1);
      } else if (far) {
        hooks.onPrune?.(node.idx);
      }
    };

    search(this.root, 0);
    const dist = bestIdx >= 0 ? Math.sqrt(bestDist) : NaN;
    hooks.onResult?.(target, bestIdx, dist);
    return bestIdx >= 0 ? { idx: bestIdx, dist } : null;
  }

  /** 暴力最近邻（验证用）。 */
  bruteNearest(target: Point): { idx: number; dist: number } | null {
    if (this.points.length === 0) return null;
    let bi = 0;
    let bd = Infinity;
    for (let i = 0; i < this.points.length; i++) {
      const d = distSq(this.points[i]!, target);
      if (d < bd) {
        bd = d;
        bi = i;
      }
    }
    return { idx: bi, dist: Math.sqrt(bd) };
  }
}

/**
 * 便利函数：建树并查询若干目标点的最近邻，返回 [idx, dist] 列表。
 */
export function kdTree(
  input: { points: Point[]; targets: Point[] },
  hooks: KDTreeHooks = {},
): Array<{ idx: number; dist: number }> {
  const tree = new KDTree(input.points, hooks);
  return input.targets.map((t) => {
    const r = tree.nearest(t, hooks);
    return r ?? { idx: -1, dist: NaN };
  });
}
