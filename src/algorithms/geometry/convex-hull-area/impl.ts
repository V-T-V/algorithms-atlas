// =============================================================================
// 凸包面积（Convex Hull Area）· 纯算法实现
// Andrew 单调链 + 鞋带公式
// =============================================================================

export interface Pt {
  x: number;
  y: number;
}

export interface ConvexHullAreaHooks {
  /** 排序完成。 */
  onSorted?: (pts: Pt[]) => void;
  /** 凸包构造完成。 */
  onHull?: (hull: Pt[]) => void;
  /** 面积计算完成。 */
  onArea?: (area: number) => void;
}

/** 三点叉积 (B−A) × (C−A)；>0 左转，<0 右转，=0 共线。 */
function cross(a: Pt, b: Pt, c: Pt): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

/** Andrew 单调链求凸包（逆时针，不含末尾重复起点）。 */
export function convexHull(points: readonly Pt[], hooks: ConvexHullAreaHooks = {}): Pt[] {
  const n = points.length;
  if (n <= 2) return points.map((p) => ({ ...p }));
  const pts = [...points].sort((a, b) => (a.x !== b.x ? a.x - b.x : a.y - b.y));
  hooks.onSorted?.(pts);

  // 下凸包
  const lower: Pt[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  // 上凸包
  const upper: Pt[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i]!;
    while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  // 合并：去掉两端重复点
  const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
  hooks.onHull?.(hull);
  return hull;
}

/** 鞋带公式求多边形面积（绝对值，按顶点任意顺序）。 */
export function polygonArea(poly: readonly Pt[]): number {
  const n = poly.length;
  if (n < 3) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const a = poly[i]!;
    const b = poly[(i + 1) % n]!;
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}

/** 求点集的凸包面积。 */
export function convexHullArea(points: readonly Pt[], hooks: ConvexHullAreaHooks = {}): number {
  const hull = convexHull(points, hooks);
  const area = polygonArea(hull);
  hooks.onArea?.(area);
  return area;
}
