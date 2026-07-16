// =============================================================================
// 圆相交（Circle Intersect）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 圆心点。 */
export interface Point {
  x: number;
  y: number;
}
export interface Circle {
  c: Point;
  r: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CircleIntersectHooks {
  onClassify?: (state: string) => void;
  onResult?: (pts: Point[]) => void;
}

export interface CircleIntersectResult {
  /** 相交类型：'separate' | 'tangent' | 'intersect' | 'contain'。 */
  state: string;
  /** 交点（相切 1 个，相交 2 个，否则为空）。 */
  points: Point[];
}

/**
 * 两圆相交判定与交点求解。
 * 步骤：比较圆心距 d 与 r1±r2；相交时用几何关系求出交点。
 * @param c1 圆 1
 * @param c2 圆 2
 * @param hooks 可选的事件钩子
 */
export function circleIntersect(
  c1: Circle,
  c2: Circle,
  hooks: CircleIntersectHooks = {},
): CircleIntersectResult {
  const dx = c2.c.x - c1.c.x;
  const dy = c2.c.y - c1.c.y;
  const d = Math.hypot(dx, dy);
  const { r: r1 } = c1;
  const { r: r2 } = c2;
  const eps = 1e-9;

  let state: string;
  let points: Point[] = [];

  if (d > r1 + r2 + eps) {
    state = 'separate';
  } else if (Math.abs(d - (r1 + r2)) <= eps) {
    state = 'tangent';
    points = [{ x: c1.c.x + (dx / d) * r1, y: c1.c.y + (dy / d) * r1 }];
  } else if (d < Math.abs(r1 - r2) - eps) {
    state = 'contain';
  } else if (Math.abs(d - Math.abs(r1 - r2)) <= eps) {
    // 内切
    state = 'tangent';
    const sign = r1 >= r2 ? 1 : -1;
    points = [{ x: c1.c.x + (dx / d) * r1 * sign, y: c1.c.y + (dy / d) * r1 * sign }];
  } else {
    state = 'intersect';
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
    const px = c1.c.x + (a * dx) / d;
    const py = c1.c.y + (a * dy) / d;
    const rx = (-dy / d) * h;
    const ry = (dx / d) * h;
    points = [
      { x: px + rx, y: py + ry },
      { x: px - rx, y: py - ry },
    ];
  }

  hooks.onClassify?.(state);
  hooks.onResult?.(points);
  return { state, points };
}
