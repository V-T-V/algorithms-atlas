// =============================================================================
// K-D 树最近邻 · 纯算法实现（二维）
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface KdHooks {
  onBuild?: (depth: number, axis: 0 | 1, point: Point) => void;
  onVisit?: (depth: number, point: Point) => void;
  onPrune?: (depth: number) => void;
  onCandidate?: (point: Point, dist: number) => void;
}

interface KdNode {
  point: Point;
  left: KdNode | null;
  right: KdNode | null;
}

function dist2(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/** 由点集建 K-D 树（按 axis = depth % 2 中位数划分）。 */
export function buildKdTree(points: Point[], hooks: KdHooks = {}): KdNode | null {
  const build = (pts: Point[], depth: number): KdNode | null => {
    if (pts.length === 0) return null;
    const axis: 0 | 1 = depth % 2 === 0 ? 0 : 1;
    pts.sort((a, b) => (axis === 0 ? a.x - b.x : a.y - b.y));
    const mid = pts.length >> 1;
    const node: KdNode = { point: pts[mid]!, left: null, right: null };
    hooks.onBuild?.(depth, axis, node.point);
    node.left = build(pts.slice(0, mid), depth + 1);
    node.right = build(pts.slice(mid + 1), depth + 1);
    return node;
  };
  return build(points.slice(), 0);
}

export interface NearestResult {
  point: Point | null;
  dist: number; // 平方距离
}

/** 最近邻查询。 */
export function nearestNeighbor(
  root: KdNode | null,
  target: Point,
  hooks: KdHooks = {},
): NearestResult {
  let best: Point | null = null;
  let bestDist2 = Infinity;

  const search = (node: KdNode | null, depth: number): void => {
    if (node === null) return;
    hooks.onVisit?.(depth, node.point);
    const axis: 0 | 1 = depth % 2 === 0 ? 0 : 1;
    const d2 = dist2(node.point, target);
    if (d2 < bestDist2) {
      bestDist2 = d2;
      best = node.point;
      hooks.onCandidate?.(node.point, d2);
    }
    const diff = axis === 0 ? target.x - node.point.x : target.y - node.point.y;
    const [first, second] = diff < 0 ? [node.left, node.right] : [node.right, node.left];
    search(first, depth + 1);
    // 是否需要查另一侧：到分割轴的距离 < 当前最佳
    if (diff * diff < bestDist2) {
      search(second, depth + 1);
    } else {
      hooks.onPrune?.(depth + 1);
    }
  };

  search(root, 0);
  return { point: best, dist: bestDist2 };
}

/** 返回点到根的距离（开方后的真实欧氏距离）。 */
export function realDistance(r: NearestResult): number {
  return r.point === null ? Infinity : Math.sqrt(r.dist);
}
