// =============================================================================
// 半平面交（Half Plane Intersect）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// S&I（排序-增量）算法，输出半平面交构成的凸多边形。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}
/** 有向半平面：直线 a→b 的左侧（含线上）。 */
export interface HalfPlane {
  a: Point;
  b: Point;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface HalfPlaneIntersectHooks {
  onSort?: (order: number[]) => void;
  onIntersect?: (p: Point) => void;
  onResult?: (poly: Point[]) => void;
}

export interface HalfPlaneIntersectResult {
  /** 交区域顶点（逆时针）。若为空表示无界或空集。 */
  polygon: Point[];
}

const eps = 1e-9;
function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}
/** 两直线交点。 */
function lineIntersect(p: Point, p2: Point, q: Point, q2: Point): Point {
  const ux = p2.x - p.x;
  const uy = p2.y - p.y;
  const vx = q2.x - q.x;
  const vy = q2.y - q.y;
  const d = ux * vy - uy * vx;
  const t = ((q.x - p.x) * vy - (q.y - p.y) * vx) / d;
  return { x: p.x + t * ux, y: p.y + t * uy };
}

/**
 * 半平面交（S&I 算法）。
 * @param hps 半平面数组
 * @param hooks 可选的事件钩子
 */
export function halfPlaneIntersect(
  hps: HalfPlane[],
  hooks: HalfPlaneIntersectHooks = {},
): HalfPlaneIntersectResult {
  if (hps.length < 3) return { polygon: [] };
  // 按方向角排序
  const order = hps
    .map((hp, i) => ({ i, ang: Math.atan2(hp.b.y - hp.a.y, hp.b.x - hp.a.x) }))
    .sort((p, q) => p.ang - q.ang)
    .map((e) => e.i);
  hooks.onSort?.(order);

  const deque: HalfPlane[] = [];
  const pts: Point[] = []; // pts[i] = deque[i] 与 deque[i+1] 的交点

  const isLeft = (hp: HalfPlane, p: Point): boolean => cross(hp.a, hp.b, p) > -eps;

  for (const i of order) {
    const hp = hps[i]!;
    // 弹出尾部不满足的
    while (pts.length > 0 && !isLeft(hp, pts[pts.length - 1]!)) {
      deque.pop();
      pts.pop();
    }
    while (pts.length > 0 && !isLeft(hp, pts[0]!)) {
      deque.shift();
      pts.shift();
    }
    if (
      deque.length > 0 &&
      Math.abs(
        cross(
          { x: 0, y: 0 },
          { x: hp.b.x - hp.a.x, y: hp.b.y - hp.a.y },
          {
            x: deque[deque.length - 1]!.b.x - deque[deque.length - 1]!.a.x,
            y: deque[deque.length - 1]!.b.y - deque[deque.length - 1]!.a.y,
          },
        ),
      ) < eps
    ) {
      // 平行同向，保留更内侧的
      if (isLeft(hp, deque[deque.length - 1]!.a)) deque[deque.length - 1] = hp;
      continue;
    }
    if (deque.length >= 1) {
      const prev = deque[deque.length - 1]!;
      const p = lineIntersect(prev.a, prev.b, hp.a, hp.b);
      pts.push(p);
      hooks.onIntersect?.(p);
    }
    deque.push(hp);
  }
  // 收尾：检查头尾
  while (pts.length > 0 && !isLeft(deque[0]!, pts[pts.length - 1]!)) {
    deque.pop();
    pts.pop();
  }
  if (deque.length <= 2) return { polygon: [] };
  const first = deque[0]!;
  const last = deque[deque.length - 1]!;
  const closeP = lineIntersect(last.a, last.b, first.a, first.b);
  pts.push(closeP);
  hooks.onResult?.(pts);
  return { polygon: pts };
}
