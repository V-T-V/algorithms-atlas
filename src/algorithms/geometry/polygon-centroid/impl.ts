// =============================================================================
// 多边形重心（Polygon Centroid）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PolygonCentroidHooks {
  onEdge?: (i: number, cross: number) => void;
  onResult?: (cx: number, cy: number, area: number) => void;
}

export interface PolygonCentroidResult {
  centroid: Point;
  /** 多边形有向面积（用于按面积加权）。 */
  signedArea: number;
}

/**
 * 多边形重心：用有向面积加权的 Shoelace 公式。
 * Cx = (1/6A) Σ (x_i + x_{i+1})(x_i y_{i+1} − x_{i+1} y_i)
 * Cy = (1/6A) Σ (y_i + y_{i+1})(x_i y_{i+1} − x_{i+1} y_i)
 * @param poly 顶点按顺序（顺/逆时针均可），首尾不重复
 * @param hooks 可选的事件钩子
 */
export function polygonCentroid(
  poly: Point[],
  hooks: PolygonCentroidHooks = {},
): PolygonCentroidResult {
  if (poly.length < 3) throw new Error('多边形至少需要 3 个顶点');
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]!;
    const b = poly[(i + 1) % poly.length]!;
    const cr = a.x * b.y - b.x * a.y;
    area += cr;
    cx += (a.x + b.x) * cr;
    cy += (a.y + b.y) * cr;
    hooks.onEdge?.(i, cr);
  }
  area /= 2;
  if (area === 0) return { centroid: { x: poly[0]!.x, y: poly[0]!.y }, signedArea: 0 };
  cx /= 6 * area;
  cy /= 6 * area;
  hooks.onResult?.(cx, cy, area);
  return { centroid: { x: cx, y: cy }, signedArea: area };
}

/** 仅用 Shoelace 计算多边形面积。 */
export function polygonArea(poly: Point[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i]!;
    const q = poly[(i + 1) % poly.length]!;
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a) / 2;
}
