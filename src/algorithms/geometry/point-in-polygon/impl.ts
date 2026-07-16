// =============================================================================
// 点在多边形内 Point-in-Polygon · 纯算法实现
// 射线法（Ray Casting）：从查询点水平向右发射射线，统计与多边形边的交点数。
// 奇数个交点 → 在内部；偶数 → 在外部。
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface PointInPolyHooks {
  /** 检查第 i 条边与射线相交时触发。crossing=true 表示相交。 */
  onCheckEdge?: (edgeIndex: number, crossing: boolean) => void;
  /** 最终判定时触发。inside=true 表示在多边形内部。 */
  onResult?: (inside: boolean, crossingCount: number) => void;
}

/**
 * 射线法判定点是否在多边形内部。
 * @param p 查询点
 * @param polygon 多边形顶点（按顺时针或逆时针顺序，不自交）
 */
export function pointInPolygon(
  p: Point,
  polygon: readonly Point[],
  hooks: PointInPolyHooks = {},
): boolean {
  let count = 0;
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    const a = polygon[i]!;
    const b = polygon[(i + 1) % n]!;
    // 射线水平向右 (y=p.y, x→+∞)，检查边 a-b 是否与射线相交
    const crossing = rayCrossesSegment(p, a, b);
    hooks.onCheckEdge?.(i, crossing);
    if (crossing) count++;
  }
  const inside = count % 2 === 1;
  hooks.onResult?.(inside, count);
  return inside;
}

/** 判定水平射线 (p 向右) 是否穿过线段 a-b。 */
function rayCrossesSegment(p: Point, a: Point, b: Point): boolean {
  // a 和 b 必须在射线的两侧（一上一下），且交点 x > p.x
  const aboveA = a.y > p.y;
  const aboveB = b.y > p.y;
  if (aboveA === aboveB) return false; // 同侧，不穿越
  // 计算交点 x 坐标（线性插值）
  const t = (p.y - a.y) / (b.y - a.y);
  const xIntersect = a.x + t * (b.x - a.x);
  return xIntersect > p.x;
}
