// =============================================================================
// 点在凸多边形内（二分法）· 纯算法实现
// 以 p0 为极点，二分定位查询点所在扇形，单次叉积判定。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 事件钩子。 */
export interface PointInConvexHooks {
  /** 第 1 步：极点 p0 与 q 的方位检查。 */
  onRangeCheck?: (q: Point, inRange: boolean) => void;
  /** 第 2 步：二分中点 mid，给出当前扇形方向。 */
  onBinarySearch?: (lo: number, hi: number, mid: number) => void;
  /** 第 3 步：最终边判定。 */
  onFinalTest?: (k: number, crossValue: number, inside: boolean) => void;
  /** 结论。 */
  onResult?: (inside: boolean) => void;
}

/** 叉积 OA×OB。 */
function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/** 点在点 a 上（含）沿线段 a→b 的方向：cross>0 左转、<0 右转、0 共线。 */

/**
 * 判定点 q 是否在凸多边形 polygon 内（含边界）。
 * 要求 polygon 逆时针、严格凸、顶点数 ≥3。
 *
 * @returns 'in' | 'out' | 'on'（在内部 / 外部 / 边界上）
 */
export function pointInConvex(
  q: Point,
  polygon: Point[],
  hooks: PointInConvexHooks = {},
): 'in' | 'out' | 'on' {
  const n = polygon.length;
  if (n < 3) {
    hooks.onResult?.(false);
    return 'out';
  }
  const p0 = polygon[0]!;
  const p1 = polygon[1]!;
  const pn1 = polygon[n - 1]!;

  // 若 q 与 p0 重合，直接判为边界
  if (Math.abs(q.x - p0.x) <= 1e-12 && Math.abs(q.y - p0.y) <= 1e-12) {
    hooks.onFinalTest?.(0, 0, true);
    hooks.onResult?.(true);
    return 'on';
  }

  // 判定 q 是否在线段 (a,b) 上（共线 + 落在线段参数范围内）。
  const onSeg = (a: Point, b: Point): boolean => {
    const cr = cross(a, b, q);
    if (Math.abs(cr) > 1e-9) return false; // 不共线
    const minX = Math.min(a.x, b.x) - 1e-12;
    const maxX = Math.max(a.x, b.x) + 1e-12;
    const minY = Math.min(a.y, b.y) - 1e-12;
    const maxY = Math.max(a.y, b.y) + 1e-12;
    return q.x >= minX && q.x <= maxX && q.y >= minY && q.y <= maxY;
  };
  // 边界边 p0→p1、p0→pn1：若 q 在其上，判为 'on'
  if (onSeg(p0, p1) || onSeg(p0, pn1)) {
    hooks.onFinalTest?.(0, 0, true);
    hooks.onResult?.(true);
    return 'on';
  }

  // 步骤 1：检查 q 是否在角度范围 [p0→p1, p0→pn1] 之内（逆时针扇区）
  // 即 cross(p0, p1, q) >= 0 且 cross(p0, pn1, q) <= 0
  const c1 = cross(p0, p1, q);
  const c2 = cross(p0, pn1, q);
  const inRange = c1 >= -1e-12 && c2 <= 1e-12;
  hooks.onRangeCheck?.(q, inRange);
  if (!inRange) {
    hooks.onResult?.(false);
    return 'out';
  }

  // 步骤 2：二分找最大的 k 使得 cross(p0, p_k, q) >= 0
  let lo = 1;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    hooks.onBinarySearch?.(lo, hi, mid);
    if (cross(p0, polygon[mid]!, q) >= 0) lo = mid;
    else hi = mid;
  }
  const k = lo; // q 在扇形 (p0, p_k, p_{k+1}) 内

  // 步骤 3：判定 q 与边 (p_k, p_{k+1}) 的位置
  const pk = polygon[k]!;
  const pk1 = polygon[k + 1]!;
  const cv = cross(pk, pk1, q);
  const inside = cv > 1e-12;
  const onEdge = Math.abs(cv) <= 1e-12;
  hooks.onFinalTest?.(k, cv, inside || onEdge);

  if (onEdge) {
    hooks.onResult?.(true);
    return 'on';
  }
  if (inside) {
    hooks.onResult?.(true);
    return 'in';
  }
  hooks.onResult?.(false);
  return 'out';
}

/**
 * 便捷封装：返回布尔（内部或边界都算「在」）。
 */
export function isPointInConvex(
  q: Point,
  polygon: Point[],
  hooks: PointInConvexHooks = {},
): boolean {
  const r = pointInConvex(q, polygon, hooks);
  return r === 'in' || r === 'on';
}
