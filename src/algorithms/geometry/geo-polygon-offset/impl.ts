// =============================================================================
// 多边形偏移（Polygon Offset）· 纯算法实现
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

export interface OffsetHooks {
  /** 处理每个顶点时调用（旧顶点下标、新顶点）。 */
  onVertex?: (idx: number, newV: Point) => void;
}

/**
 * 求两直线交点。直线 1 过 a 沿方向 d1，直线 2 过 b 沿方向 d2。
 */
function lineIntersect(a: Point, d1: Point, b: Point, d2: Point): Point {
  const denom = d1.x * d2.y - d1.y * d2.x;
  if (Math.abs(denom) < 1e-12) {
    // 平行：直接返回 a 沿 d1 推进的点
    return { x: a.x + d1.x, y: a.y + d1.y };
  }
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = (dx * d2.y - dy * d2.x) / denom;
  return { x: a.x + t * d1.x, y: a.y + t * d1.y };
}

/**
 * 多边形偏移：对 CCW 多边形沿各边外法向偏移距离 d。
 * @param polygon 顶点序列（建议逆时针；顺时针时 d 符号反向）
 * @param d 偏移距离（>0 沿外法向）
 */
export function polygonOffset(
  polygon: readonly Point[],
  d: number,
  hooks: OffsetHooks = {},
): Point[] {
  if (polygon.length < 3) throw new RangeError('polygonOffset 至少需要 3 个顶点');
  const n = polygon.length;
  const result: Point[] = [];
  for (let i = 0; i < n; i++) {
    const prev = polygon[(i - 1 + n) % n]!;
    const cur = polygon[i]!;
    const next = polygon[(i + 1) % n]!;
    // 入边 prev→cur，出边 cur→next 的单位方向
    const e1 = { x: cur.x - prev.x, y: cur.y - prev.y };
    const e2 = { x: next.x - cur.x, y: next.y - cur.y };
    const l1 = Math.hypot(e1.x, e1.y) || 1;
    const l2 = Math.hypot(e2.x, e2.y) || 1;
    // 外法向（CCW 多边形）：方向向量逆时针旋转 90° = (-dy, dx)
    const n1 = { x: -e1.y / l1, y: e1.x / l1 };
    const n2 = { x: -e2.y / l2, y: e2.x / l2 };
    // 偏移后两直线
    const a = { x: prev.x + n1.x * d, y: prev.y + n1.y * d };
    const b = { x: cur.x + n2.x * d, y: cur.y + n2.y * d };
    const newV = lineIntersect(a, e1, b, e2);
    result.push(newV);
    hooks.onVertex?.(i, newV);
  }
  return result;
}
