// =============================================================================
// 凸多边形判定（Convex Check）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ConvexPolygonHooks {
  onEdge?: (i: number, cross: number) => void;
  onResult?: (convex: boolean) => void;
}

export interface ConvexPolygonResult {
  /** 是否为严格凸多边形。 */
  convex: boolean;
  /** 所有相邻边叉积的符号集合。 */
  signs: number[];
}

/** 叉积 (b-a) × (c-a)。 */
function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

/**
 * 凸多边形判定：检查所有相邻边的叉积符号是否一致（全正或全负）。
 * @param poly 顶点按顺序（顺/逆时针），首尾不重复
 * @param hooks 可选的事件钩子
 */
export function convexPolygon(poly: Point[], hooks: ConvexPolygonHooks = {}): ConvexPolygonResult {
  if (poly.length < 3) return { convex: false, signs: [] };
  const n = poly.length;
  const signs: number[] = [];
  let pos = 0;
  let neg = 0;
  for (let i = 0; i < n; i++) {
    const a = poly[i]!;
    const b = poly[(i + 1) % n]!;
    const c = poly[(i + 2) % n]!;
    const cr = cross(a, b, c);
    const s = cr > 0 ? 1 : cr < 0 ? -1 : 0;
    signs.push(s);
    if (s > 0) pos++;
    else if (s < 0) neg++;
    hooks.onEdge?.(i, cr);
  }
  // 严格凸：不允许共线（无 0），且方向一致
  const convex = pos === n || neg === n;
  hooks.onResult?.(convex);
  return { convex, signs };
}
