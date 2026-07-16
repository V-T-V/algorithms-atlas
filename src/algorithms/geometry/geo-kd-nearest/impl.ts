// =============================================================================
// KD-Tree 最近邻 · 纯算法实现
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

export interface KDNode {
  point: Point;
  /** 0 = 按 x 划分，1 = 按 y 划分。 */
  axis: 0 | 1;
  left: KDNode | null;
  right: KDNode | null;
}

export interface KDHooks {
  onVisit?: (node: KDNode, best: Point | null) => void;
  onPrune?: (node: KDNode) => void;
}

/** 构建 2D KD-Tree（按 axis 轮流取中位数）。 */
export function buildKDTree(points: readonly Point[], depth = 0): KDNode | null {
  if (points.length === 0) return null;
  const axis = (depth % 2 === 0 ? 0 : 1) as 0 | 1;
  const sorted = [...points].sort((a, b) => (axis === 0 ? a.x - b.x : a.y - b.y));
  const mid = Math.floor(sorted.length / 2);
  return {
    point: sorted[mid]!,
    axis,
    left: buildKDTree(sorted.slice(0, mid), depth + 1),
    right: buildKDTree(sorted.slice(mid + 1), depth + 1),
  };
}

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * 在 KD-Tree 上查询 target 的最近邻点。
 */
export function kdNearest(root: KDNode | null, target: Point, hooks: KDHooks = {}): Point | null {
  let best: Point | null = null;
  let bestDist = Infinity;

  const search = (node: KDNode | null): void => {
    if (!node) return;
    hooks.onVisit?.(node, best);
    const d = dist(node.point, target);
    if (d < bestDist) {
      bestDist = d;
      best = node.point;
    }
    const coord = node.axis === 0 ? 'x' : 'y';
    const diff = target[coord] - node.point[coord];
    const near = diff < 0 ? node.left : node.right;
    const far = diff < 0 ? node.right : node.left;
    search(near);
    // 检查另一侧是否可能更近
    if (Math.abs(diff) < bestDist) {
      search(far);
    } else {
      if (far) hooks.onPrune?.(far);
    }
  };
  search(root);
  return best;
}
