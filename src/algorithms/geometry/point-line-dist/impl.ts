// =============================================================================
// 点到直线距离（Point-Line Dist）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PointLineDistHooks {
  onCross?: (cross2: number) => void;
  onResult?: (dist: number) => void;
}

export interface PointLineDistResult {
  /** 点 P 到直线 AB 的距离。 */
  distance: number;
}

/**
 * 点到直线距离：d = |AB × AP| / |AB|。
 * @param line 直线两端点 A、B
 * @param p 待测点
 * @param hooks 可选的事件钩子
 */
export function pointLineDist(
  line: { a: Point; b: Point },
  p: Point,
  hooks: PointLineDistHooks = {},
): PointLineDistResult {
  const { a, b } = line;
  const cross2 = Math.abs((b.x - a.x) * (a.y - p.y) - (a.x - p.x) * (b.y - a.y));
  hooks.onCross?.(cross2);
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  if (len === 0) return { distance: Math.hypot(p.x - a.x, p.y - a.y) };
  const distance = cross2 / len;
  hooks.onResult?.(distance);
  return { distance };
}

/** 点到线段（非延长线）的距离。 */
export function pointSegmentDist(a: Point, b: Point, p: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const proj = { x: a.x + t * dx, y: a.y + t * dy };
  return Math.hypot(p.x - proj.x, p.y - proj.y);
}
