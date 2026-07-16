// =============================================================================
// 圆与三角形关系（Circle-Triangle Relationship）· 纯算法实现
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

export type CircleTriRelation = 'disjoint' | 'intersect' | 'circle-contains-triangle';

export interface CircleTriHooks {
  onCenterInTri?: (inside: boolean) => void;
  onMinDist?: (minDist: number) => void;
  onResult?: (r: CircleTriRelation) => void;
}

/** 点 P 到线段 AB 的距离（投影夹紧到 [0,1]）。 */
export function pointSegDist(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-18) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/** 叉积 (B-A) × (P-A)。 */
function cross(a: Point, b: Point, p: Point): number {
  return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
}

/** 点 P 是否在三角形 ABC 内（含边）。 */
export function pointInTriangle(p: Point, a: Point, b: Point, c: Point): boolean {
  const d1 = cross(a, b, p);
  const d2 = cross(b, c, p);
  const d3 = cross(c, a, p);
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

/**
 * 判定圆（圆心 center、半径 r）与三角形 ABC 的关系。
 */
export function circleTriangle(
  center: Point,
  r: number,
  a: Point,
  b: Point,
  c: Point,
  hooks: CircleTriHooks = {},
): CircleTriRelation {
  const verts = [a, b, c];
  const vDist = verts.map((v) => Math.hypot(v.x - center.x, v.y - center.y));
  if (vDist.every((d) => d <= r)) {
    const res: CircleTriRelation = 'circle-contains-triangle';
    hooks.onResult?.(res);
    return res;
  }
  const centerIn = pointInTriangle(center, a, b, c);
  hooks.onCenterInTri?.(centerIn);
  if (centerIn) {
    const res: CircleTriRelation = 'intersect';
    hooks.onResult?.(res);
    return res;
  }
  const edges = [
    [a, b],
    [b, c],
    [c, a],
  ] as const;
  let minDist = Infinity;
  for (const d of vDist) minDist = Math.min(minDist, d);
  for (const [p, q] of edges) minDist = Math.min(minDist, pointSegDist(center, p, q));
  hooks.onMinDist?.(minDist);
  const res: CircleTriRelation = minDist <= r ? 'intersect' : 'disjoint';
  hooks.onResult?.(res);
  return res;
}
