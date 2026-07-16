// =============================================================================
// Jarvis凸包（Jarvis March / 礼物包裹）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ConvexHullJarvisHooks {
  onStart?: (p: Point) => void;
  onWrap?: (cur: Point, next: Point) => void;
}

export interface ConvexHullJarvisResult {
  /** 凸包顶点（逆时针，首尾不重复）。 */
  hull: Point[];
}

/** 叉积 OA×OB：>0 表示 O→A→B 左转。 */
function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/**
 * Jarvis 步进（礼物包裹）凸包：
 * 每次从当前点出发，选择相对它最「右转」（顺时针最远）的点作为下一个凸包点。
 * @param points 点集
 * @param hooks 可选的事件钩子
 */
export function convexHullJarvis(
  points: Point[],
  hooks: ConvexHullJarvisHooks = {},
): ConvexHullJarvisResult {
  if (points.length < 3) return { hull: [...points] };
  const n = points.length;
  // 起点：最左下
  let start = 0;
  for (let i = 1; i < n; i++) {
    if (
      points[i]!.x < points[start]!.x ||
      (points[i]!.x === points[start]!.x && points[i]!.y < points[start]!.y)
    ) {
      start = i;
    }
  }
  hooks.onStart?.(points[start]!);

  const hull: Point[] = [];
  let p = start;
  do {
    hull.push(points[p]!);
    let q = (p + 1) % n;
    for (let r = 0; r < n; r++) {
      if (r === p) continue;
      // 若 r 在 p→q 的右侧（叉积为正，更逆时针），则选 r
      const cr = cross(points[p]!, points[q]!, points[r]!);
      if (cr < 0 || (cr === 0 && dist2(points[p]!, points[r]!) > dist2(points[p]!, points[q]!))) {
        q = r;
      }
    }
    hooks.onWrap?.(points[p]!, points[q]!);
    p = q;
  } while (p !== start);
  return { hull };
}

function dist2(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}
