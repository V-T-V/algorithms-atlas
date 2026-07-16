// =============================================================================
// 旋转卡壳（Rotating Calipers）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 在凸多边形上用旋转卡壳求最远点对（直径）。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RotatingCalipersHooks {
  onAntipodal?: (i: number, j: number, dist: number) => void;
  onResult?: (diameter: number, pair: [Point, Point]) => void;
}

export interface RotatingCalipersResult {
  /** 凸包直径（最远点对距离）。 */
  diameter: number;
  /** 最远点对。 */
  pair: [Point, Point];
}

/** 点到直线 AB 的距离。 */
function pointLineDist(a: Point, b: Point, p: Point): number {
  return (
    Math.abs((b.x - a.x) * (a.y - p.y) - (a.x - p.x) * (b.y - a.y)) /
    Math.hypot(b.x - a.x, b.y - a.y)
  );
}

/** 两点距离平方。 */
function dist2(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/**
 * 旋转卡壳：对凸多边形求对踵点（antipodal pair）中的最远距离。
 * 要求输入已是逆时针凸包。
 * @param hull 凸包顶点（逆时针，首尾不重复）
 * @param hooks 可选的事件钩子
 */
export function rotatingCalipers(
  hull: Point[],
  hooks: RotatingCalipersHooks = {},
): RotatingCalipersResult {
  const n = hull.length;
  if (n < 2) throw new Error('需要至少 2 个点');
  if (n === 2) {
    return { diameter: Math.sqrt(dist2(hull[0]!, hull[1]!)), pair: [hull[0]!, hull[1]!] };
  }
  let j = 1;
  let best = -1;
  let pair: [Point, Point] = [hull[0]!, hull[1]!];
  for (let i = 0; i < n; i++) {
    const ni = (i + 1) % n;
    // 让 j 前进直到它离边 i→ni 最远
    while (true) {
      const nj = (j + 1) % n;
      const d1 = pointLineDist(hull[i]!, hull[ni]!, hull[j]!);
      const d2 = pointLineDist(hull[i]!, hull[ni]!, hull[nj]!);
      if (d2 > d1) {
        j = nj;
      } else break;
    }
    const di = Math.sqrt(dist2(hull[i]!, hull[j]!));
    hooks.onAntipodal?.(i, j, di);
    if (di > best) {
      best = di;
      pair = [hull[i]!, hull[j]!];
    }
  }
  hooks.onResult?.(best, pair);
  return { diameter: best, pair };
}
