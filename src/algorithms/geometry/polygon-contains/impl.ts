// =============================================================================
// 点在多边形内（射线法 / Ray Casting）· 纯算法实现
// =============================================================================

export interface Pt {
  x: number;
  y: number;
}

export interface PolygonContainsHooks {
  /** 考察第 i 条边 (Pi → Pi+1)。 */
  onEdge?: (i: number, crosses: boolean) => void;
  /** 完成判定。 */
  onDone?: (inside: boolean, crossings: number) => void;
}

/**
 * 射线法判定点 P 是否在多边形内（含 even-odd 规则）。
 * @param poly 多边形顶点（按顺序，首尾可不闭合，实现内部按环处理）
 * @param p 待测点
 * @returns 是否在内部
 */
export function pointInPolygon(
  poly: readonly Pt[],
  p: Pt,
  hooks: PolygonContainsHooks = {},
): boolean {
  const n = poly.length;
  if (n < 3) {
    hooks.onDone?.(false, 0);
    return false;
  }
  let crossing = 0;
  for (let i = 0; i < n; i++) {
    const a = poly[i]!;
    const b = poly[(i + 1) % n]!;
    // 半开区间避免顶点重复计数：一端严格 > y，另一端 <= y
    if (a.y > p.y !== b.y > p.y) {
      // 计算射线与该边交点的 x 坐标
      const xInt = a.x + ((p.y - a.y) * (b.x - a.x)) / (b.y - a.y);
      if (p.x < xInt) {
        crossing++;
        hooks.onEdge?.(i, true);
        continue;
      }
    }
    hooks.onEdge?.(i, false);
  }
  const inside = crossing % 2 === 1;
  hooks.onDone?.(inside, crossing);
  return inside;
}

/** 点是否在多边形边界上（容差 eps）。 */
export function pointOnPolygonEdge(poly: readonly Pt[], p: Pt, eps = 1e-9): boolean {
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i]!;
    const b = poly[(i + 1) % n]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) {
      if (Math.hypot(p.x - a.x, p.y - a.y) < eps) return true;
      continue;
    }
    const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
    if (t < -eps || t > 1 + eps) continue;
    const px = a.x + t * dx;
    const py = a.y + t * dy;
    if (Math.hypot(p.x - px, p.y - py) < eps) return true;
  }
  return false;
}
