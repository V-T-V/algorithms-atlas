// =============================================================================
// Graham扫描（Graham Scan）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface GrahamScanHooks {
  onAnchor?: (anchor: Point) => void;
  onSorted?: (order: number[]) => void;
  onPush?: (p: Point) => void;
  onPop?: (p: Point) => void;
}

export interface GrahamScanResult {
  /** 凸包顶点（逆时针，首尾不重复）。 */
  hull: Point[];
}

/** 叉积 OA×OB。 */
function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/**
 * Graham 扫描凸包：
 * 1. 选最下/最左点为 anchor
 * 2. 按相对 anchor 的极角排序
 * 3. 维护栈：遇到非左转则弹出
 * @param points 点集
 * @param hooks 可选的事件钩子
 */
export function grahamScan(points: Point[], hooks: GrahamScanHooks = {}): GrahamScanResult {
  if (points.length < 3) return { hull: [...points] };
  let anchor = 0;
  for (let i = 1; i < points.length; i++) {
    if (
      points[i]!.y < points[anchor]!.y ||
      (points[i]!.y === points[anchor]!.y && points[i]!.x < points[anchor]!.x)
    ) {
      anchor = i;
    }
  }
  const O = points[anchor]!;
  hooks.onAnchor?.(O);

  const idx = points
    .map((_, i) => i)
    .filter((i) => i !== anchor)
    .sort((ia, ib) => {
      const a = points[ia]!;
      const b = points[ib]!;
      const cr = cross(O, a, b);
      if (cr !== 0) return cr > 0 ? -1 : 1;
      const da = (a.x - O.x) ** 2 + (a.y - O.y) ** 2;
      const db = (b.x - O.x) ** 2 + (b.y - O.y) ** 2;
      return da - db;
    });
  hooks.onSorted?.(idx);

  const stack: number[] = [anchor];
  for (const i of idx) {
    while (
      stack.length >= 2 &&
      cross(points[stack[stack.length - 2]!]!, points[stack[stack.length - 1]!]!, points[i]!) <= 0
    ) {
      hooks.onPop?.(points[stack[stack.length - 1]!]!);
      stack.pop();
    }
    stack.push(i);
    hooks.onPush?.(points[i]!);
  }
  return { hull: stack.map((i) => points[i]!) };
}
