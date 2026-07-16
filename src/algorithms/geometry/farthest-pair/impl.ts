// =============================================================================
// 最远点对（旋转卡壳）· 纯算法实现
// 先 Andrew 单调链建凸包，再旋转卡壳 O(h) 求对踵点最大距离。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 事件钩子。 */
export interface FarthestPairHooks {
  /** 建包完成。 */
  onHull?: (hull: Point[]) => void;
  /** 旋转卡壳：当前对踵点对 (i, j) 与其距离。 */
  onAntipodal?: (i: number, j: number, dist: number) => void;
  /** 找到更优解时更新。 */
  onImprove?: (dist: number, pair: [Point, Point]) => void;
  /** 完成。 */
  onDone?: (diameter: number, pair: [Point, Point]) => void;
}

export interface FarthestPairResult {
  /** 点集直径（最远距离）。 */
  diameter: number;
  /** 最远点对。 */
  pair: [Point, Point];
  /** 凸包（逆时针）。 */
  hull: Point[];
}

/** 叉积 OA×OB。 */
function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/** 两点距离。 */
export function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** 点到直线 AB 的距离。 */
function pointLineDist(a: Point, b: Point, p: Point): number {
  return (
    Math.abs((b.x - a.x) * (a.y - p.y) - (a.x - p.x) * (b.y - a.y)) /
    Math.hypot(b.x - a.x, b.y - a.y)
  );
}

/** Andrew 单调链凸包（逆时针，首尾不重复）。 */
export function convexHull(points: Point[]): Point[] {
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const n = pts.length;
  if (n < 3) return pts;
  // 下凸包
  const lower: Point[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, p) <= 0)
      lower.pop();
    lower.push(p);
  }
  // 上凸包
  const upper: Point[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const p = pts[i]!;
    while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, p) <= 0)
      upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return [...lower, ...upper];
}

/**
 * 旋转卡壳求最远点对。
 *
 * @param points 原始点集
 * @param hooks 可选事件钩子
 * @returns 直径与最远点对
 */
export function farthestPair(points: Point[], hooks: FarthestPairHooks = {}): FarthestPairResult {
  const n = points.length;
  if (n < 2) throw new Error('需要至少 2 个点 / need >= 2 points');
  const hull = convexHull(points);
  hooks.onHull?.(hull);
  const h = hull.length;

  if (h === 1) {
    const pair: [Point, Point] = [hull[0]!, hull[0]!];
    hooks.onDone?.(0, pair);
    return { diameter: 0, pair, hull };
  }
  if (h === 2) {
    const d = dist(hull[0]!, hull[1]!);
    const pair: [Point, Point] = [hull[0]!, hull[1]!];
    hooks.onDone?.(d, pair);
    return { diameter: d, pair, hull };
  }

  // 旋转卡壳
  let j = 1;
  let best = -1;
  let pair: [Point, Point] = [hull[0]!, hull[1]!];
  for (let i = 0; i < h; i++) {
    const ni = (i + 1) % h;
    while (true) {
      const nj = (j + 1) % h;
      const d1 = pointLineDist(hull[i]!, hull[ni]!, hull[j]!);
      const d2 = pointLineDist(hull[i]!, hull[ni]!, hull[nj]!);
      if (d2 > d1) j = nj;
      else break;
    }
    const di = dist(hull[i]!, hull[j]!);
    hooks.onAntipodal?.(i, j, di);
    if (di > best) {
      best = di;
      pair = [hull[i]!, hull[j]!];
      hooks.onImprove?.(best, pair);
    }
  }
  hooks.onDone?.(best, pair);
  return { diameter: best, pair, hull };
}
