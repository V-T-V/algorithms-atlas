// =============================================================================
// 最小覆盖圆（Min Enclosing Circle / Welzl）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}
export interface Circle {
  c: Point;
  r: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MinEnclosingCircleHooks {
  onBoundary?: (p: Point) => void;
  onResult?: (circle: Circle) => void;
}

export interface MinEnclosingCircleResult {
  circle: Circle;
}

/** 由两点定直径的最小圆。 */
function from2(a: Point, b: Point): Circle {
  return { c: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, r: Math.hypot(a.x - b.x, a.y - b.y) / 2 };
}

/** 由三点定外接圆；若共线返回 null。 */
function from3(a: Point, b: Point, c: Point): Circle | null {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-12) return null;
  const ux =
    ((a.x * a.x + a.y * a.y) * (b.y - c.y) +
      (b.x * b.x + b.y * b.y) * (c.y - a.y) +
      (c.x * c.x + c.y * c.y) * (a.y - b.y)) /
    d;
  const uy =
    ((a.x * a.x + a.y * a.y) * (c.x - b.x) +
      (b.x * b.x + b.y * b.y) * (a.x - c.x) +
      (c.x * c.x + c.y * c.y) * (b.x - a.x)) /
    d;
  const c0 = { x: ux, y: uy };
  return { c: c0, r: Math.hypot(a.x - ux, a.y - uy) };
}

function inCircle(p: Point, cir: Circle): boolean {
  return Math.hypot(p.x - cir.c.x, p.y - cir.c.y) <= cir.r + 1e-9;
}

/**
 * Welzl 最小覆盖圆（随机增量法）。
 * @param points 点集
 * @param hooks 可选的事件钩子
 */
export function minEnclosingCircle(
  points: Point[],
  hooks: MinEnclosingCircleHooks = {},
): MinEnclosingCircleResult {
  const pts = [...points].sort(() => Math.random() - 0.5); // 随机化以保证期望复杂度
  let c: Circle = { c: { x: pts[0]?.x ?? 0, y: pts[0]?.y ?? 0 }, r: 0 };
  for (let i = 0; i < pts.length; i++) {
    if (!inCircle(pts[i]!, c)) {
      c = { c: { x: pts[i]!.x, y: pts[i]!.y }, r: 0 };
      hooks.onBoundary?.(pts[i]!);
      for (let j = 0; j < i; j++) {
        if (!inCircle(pts[j]!, c)) {
          c = from2(pts[i]!, pts[j]!);
          hooks.onBoundary?.(pts[j]!);
          for (let k = 0; k < j; k++) {
            if (!inCircle(pts[k]!, c)) {
              const t = from3(pts[i]!, pts[j]!, pts[k]!);
              if (t) c = t;
              hooks.onBoundary?.(pts[k]!);
            }
          }
        }
      }
    }
  }
  hooks.onResult?.(c);
  return { circle: c };
}
