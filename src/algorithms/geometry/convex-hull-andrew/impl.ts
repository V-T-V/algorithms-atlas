// =============================================================================
// Andrew凸包（Andrew Monotone Chain）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ConvexHullAndrewHooks {
  onSort?: (order: number[]) => void;
  onPush?: (p: Point) => void;
  onPop?: (p: Point) => void;
}

export interface ConvexHullAndrewResult {
  /** 凸包顶点（逆时针，首尾不重复）。 */
  hull: Point[];
}

/** 叉积 OA×OB。 */
function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/**
 * Andrew 单调链凸包：
 * 1. 按 (x, y) 排序
 * 2. 自左向右构建下凸包（维护左转），再自右向左构建上凸包
 * @param points 点集
 * @param hooks 可选的事件钩子
 */
export function convexHullAndrew(
  points: Point[],
  hooks: ConvexHullAndrewHooks = {},
): ConvexHullAndrewResult {
  if (points.length < 3) return { hull: [...points] };
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  hooks.onSort?.(pts.map((_, i) => i));
  const n = pts.length;
  const hull: Point[] = [];

  // 下凸包
  for (let i = 0; i < n; i++) {
    while (
      hull.length >= 2 &&
      cross(hull[hull.length - 2]!, hull[hull.length - 1]!, pts[i]!) <= 0
    ) {
      hooks.onPop?.(hull[hull.length - 1]!);
      hull.pop();
    }
    hull.push(pts[i]!);
    hooks.onPush?.(pts[i]!);
  }
  // 上凸包
  const lower = hull.length + 1;
  for (let i = n - 2; i >= 0; i--) {
    while (
      hull.length >= lower &&
      cross(hull[hull.length - 2]!, hull[hull.length - 1]!, pts[i]!) <= 0
    ) {
      hooks.onPop?.(hull[hull.length - 1]!);
      hull.pop();
    }
    hull.push(pts[i]!);
    hooks.onPush?.(pts[i]!);
  }
  hull.pop(); // 去掉与起点重复的尾
  return { hull };
}
