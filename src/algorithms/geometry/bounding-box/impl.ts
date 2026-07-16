// =============================================================================
// 轴对齐最小包围盒（AABB）· 纯算法实现
// =============================================================================

export interface Pt {
  x: number;
  y: number;
}

export interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface BBoxStats {
  bbox: BBox;
  width: number;
  height: number;
  area: number;
  perimeter: number;
  center: Pt;
}

export interface BoundingBoxHooks {
  /** 扫描到点 i 时更新当前极值。 */
  onPoint?: (i: number, current: BBox) => void;
  /** 完成。 */
  onDone?: (stats: BBoxStats) => void;
}

/** 求点集的轴对齐最小包围盒及其统计量。 */
export function boundingBox(points: readonly Pt[], hooks: BoundingBoxHooks = {}): BBoxStats {
  if (points.length === 0) throw new RangeError('点集不能为空');
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!;
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
    hooks.onPoint?.(i, { minX, minY, maxX, maxY });
  }
  const width = maxX - minX;
  const height = maxY - minY;
  const stats: BBoxStats = {
    bbox: { minX, minY, maxX, maxY },
    width,
    height,
    area: width * height,
    perimeter: 2 * (width + height),
    center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 },
  };
  hooks.onDone?.(stats);
  return stats;
}

/** 判断点是否在 AABB 内（含边界）。 */
export function pointInBBox(bbox: BBox, p: Pt): boolean {
  return p.x >= bbox.minX && p.x <= bbox.maxX && p.y >= bbox.minY && p.y <= bbox.maxY;
}

/** 两 AABB 是否相交。 */
export function bboxIntersect(a: BBox, b: BBox): boolean {
  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY;
}
