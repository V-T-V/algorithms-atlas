// =============================================================================
// 多边形简化（Douglas-Peucker）· 纯算法实现
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

export interface SimplifyHooks {
  /** 每次考察一段（起止下标）时调用。 */
  onSegment?: (lo: number, hi: number) => void;
  /** 找到当前段最远点时调用（下标、距离）。 */
  onFarthest?: (idx: number, dist: number) => void;
  /** 决定保留某点时调用（下标）。 */
  onKeep?: (idx: number) => void;
}

/** 点 P 到线段 AB 的垂直距离（投影夹紧到 [0,1]）。 */
export function pointSegDist(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-18) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const fx = a.x + t * dx;
  const fy = a.y + t * dy;
  return Math.hypot(p.x - fx, p.y - fy);
}

/**
 * Douglas-Peucker 简化折线。
 * @param points 折线顶点序列（至少 2 个点）
 * @param epsilon 距离阈值（>0）
 */
export function simplify(
  points: readonly Point[],
  epsilon: number,
  hooks: SimplifyHooks = {},
): Point[] {
  if (points.length < 3) return points.slice();
  const keep = new Array<boolean>(points.length).fill(false);
  keep[0] = true;
  keep[points.length - 1] = true;

  const recurse = (lo: number, hi: number): void => {
    if (hi <= lo + 1) return;
    hooks.onSegment?.(lo, hi);
    let dmax = 0;
    let idx = -1;
    const a = points[lo]!;
    const b = points[hi]!;
    for (let i = lo + 1; i < hi; i++) {
      const d = pointSegDist(points[i]!, a, b);
      if (d > dmax) {
        dmax = d;
        idx = i;
      }
    }
    hooks.onFarthest?.(idx, dmax);
    if (dmax > epsilon && idx !== -1) {
      keep[idx] = true;
      hooks.onKeep?.(idx);
      recurse(lo, idx);
      recurse(idx, hi);
    }
  };
  recurse(0, points.length - 1);

  return points.filter((_, i) => keep[i]);
}
