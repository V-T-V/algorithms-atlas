// =============================================================================
// 矩形相交面积（Rectangle Intersection Area）· 纯算法实现
// =============================================================================

/** 轴对齐矩形：左上角 (x,y) + 宽 w + 高 h。 */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface RectIntersectResult {
  /** 相交面积（不相交为 0）。 */
  area: number;
  /** 相交矩形（不相交时为 null）。 */
  rect: Rect | null;
}

export interface RectIntersectHooks {
  onOverlap?: (w: number, h: number, area: number) => void;
}

/**
 * 计算两轴对齐矩形的相交面积与相交矩形。
 */
export function rectIntersect(
  a: Rect,
  b: Rect,
  hooks: RectIntersectHooks = {},
): RectIntersectResult {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const w = x2 - x1;
  const h = y2 - y1;
  if (w <= 0 || h <= 0) {
    hooks.onOverlap?.(0, 0, 0);
    return { area: 0, rect: null };
  }
  const area = w * h;
  hooks.onOverlap?.(w, h, area);
  return { area, rect: { x: x1, y: y1, w, h } };
}
