// =============================================================================
// 线段相交 Segment Intersect · 纯算法实现（叉积判定）
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每次叉积计算与判定。
// =============================================================================

/** 二维点 / 向量。 */
export interface Point {
  x: number;
  y: number;
}

/** 一条线段：两个端点。 */
export interface Segment {
  p: Point;
  q: Point;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SegmentIntersectHooks {
  /** 计算叉积 (b - a) × (c - a)，给出三点与结果值。 */
  onCross?: (a: Point, b: Point, c: Point, value: number) => void;
  /** 判定两线段是否「规范相交」（端点不重合、内部相交）。 */
  onProper?: (intersects: boolean) => void;
  /** 判定最终结果（含端点相接/共线重叠的广义相交）。 */
  onResult?: (intersects: boolean) => void;
}

export interface SegmentIntersectResult {
  /** 是否相交（广义：含端点相接与共线重叠）。 */
  intersects: boolean;
  /** 是否规范相交（内部相交，非端点）。 */
  proper: boolean;
}

/** 叉积 (b - a) × (c - a)：>0 左转（CCW），<0 右转，=0 共线。 */
export function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

/** 方向函数：叉积的符号（-1/0/1）。 */
function direction(a: Point, b: Point, c: Point, hooks: SegmentIntersectHooks): number {
  const v = cross(a, b, c);
  hooks.onCross?.(a, b, c, v);
  if (v > 0) return 1;
  if (v < 0) return -1;
  return 0;
}

/** 点 c 是否在线段 [a, b] 的包围盒内（前提：已共线）。 */
function onSegment(a: Point, b: Point, c: Point): boolean {
  return (
    Math.min(a.x, b.x) <= c.x &&
    c.x <= Math.max(a.x, b.x) &&
    Math.min(a.y, b.y) <= c.y &&
    c.y <= Math.max(a.y, b.y)
  );
}

/**
 * 线段相交判定 —— 叉积法（CLRS 33.1）。
 *
 * 给定两条线段 p1p2 与 p3p4：\n
 * - 每条线段「跨立」另一条：即另一条的两个端点分别在线段两侧（方向符号相反）\n
 * - 用叉积判断方向：`d1 = cross(p3, p4, p1)`、`d2 = cross(p3, p4, p2)`、\n
 *   `d3 = cross(p1, p2, p3)`、`d4 = cross(p1, p2, p4)`\n
 * - 若 d1 与 d2 异号、且 d3 与 d4 异号 → **规范相交**\n
 * - 否则若有方向为 0（共线）：检查对应点是否落在另一线段上 → **广义相交**\n
 *
 * @param s1 第一条线段
 * @param s2 第二条线段
 * @param hooks 可选事件钩子
 * @returns 相交结果（含 proper 标记）
 */
export function segmentIntersect(
  s1: Segment,
  s2: Segment,
  hooks: SegmentIntersectHooks = {},
): SegmentIntersectResult {
  const { p: p1, q: p2 } = s1;
  const { p: p3, q: p4 } = s2;

  const d1 = direction(p3, p4, p1, hooks);
  const d2 = direction(p3, p4, p2, hooks);
  const d3 = direction(p1, p2, p3, hooks);
  const d4 = direction(p1, p2, p4, hooks);

  // 规范相交：异号
  let proper = false;
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    proper = true;
  }
  hooks.onProper?.(proper);

  // 广义相交：共线且点在另一线段上
  let intersects = proper;
  if (!intersects) {
    if (d1 === 0 && onSegment(p3, p4, p1)) intersects = true;
    else if (d2 === 0 && onSegment(p3, p4, p2)) intersects = true;
    else if (d3 === 0 && onSegment(p1, p2, p3)) intersects = true;
    else if (d4 === 0 && onSegment(p1, p2, p4)) intersects = true;
  }

  hooks.onResult?.(intersects);
  return { intersects, proper };
}
