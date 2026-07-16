// =============================================================================
// 在线凸包（Online Convex Hull）· 纯算法实现
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

export interface OnlineHullHooks {
  /** 每次插入后调用（点、是否在当前凸包内部、当前凸包大小）。 */
  onInsert?: (p: Point, inside: boolean, hullSize: number) => void;
}

const EPS = 1e-9;

/** 叉积 (B-A) × (C-A)。 */
export function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

/** Jarvis 礼包法求 CCW 凸包。 */
export function jarvisMarch(points: readonly Point[]): Point[] {
  if (points.length < 3) return points.slice();
  let left = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i]!.x < points[left]!.x) left = i;
  }
  const hull: Point[] = [];
  let p = left;
  do {
    hull.push(points[p]!);
    let q = (p + 1) % points.length;
    for (let i = 0; i < points.length; i++) {
      if (cross(points[p]!, points[i]!, points[q]!) < -EPS) q = i;
    }
    p = q;
  } while (p !== left && hull.length <= points.length);
  return hull;
}

/** 点 p 是否在凸包内（含边界），要求 hull 为 CCW。 */
export function inConvexHull(p: Point, hull: readonly Point[]): boolean {
  if (hull.length < 3) {
    return hull.some((q) => Math.hypot(p.x - q.x, p.y - q.y) < 1e-9);
  }
  for (let i = 0; i < hull.length; i++) {
    const j = (i + 1) % hull.length;
    if (cross(hull[i]!, hull[j]!, p) < -EPS) return false;
  }
  return true;
}

/**
 * 在线凸包：依次插入点，维护当前凸包。
 * @param points 按到达顺序排列的点
 * @returns 每次插入后的凸包快照序列（用于可视化）
 */
export function onlineConvexHull(points: readonly Point[], hooks: OnlineHullHooks = {}): Point[] {
  let currentHull: Point[] = [];
  const all: Point[] = [];
  for (const p of points) {
    const inside = currentHull.length >= 3 && inConvexHull(p, currentHull);
    if (!inside) {
      all.push(p);
      currentHull = all.length < 3 ? all.slice() : jarvisMarch(all);
    }
    hooks.onInsert?.(p, inside, currentHull.length);
  }
  return currentHull;
}
