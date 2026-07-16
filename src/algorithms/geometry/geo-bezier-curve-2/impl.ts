// =============================================================================
// 贝塞尔曲线（de Casteljau）· 纯算法实现
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

export interface BezierHooks {
  /** 每层插值后调用（层号 1..、该层点集）。 */
  onLevel?: (level: number, points: Point[]) => void;
}

const lerp = (a: Point, b: Point, t: number): Point => ({
  x: (1 - t) * a.x + t * b.x,
  y: (1 - t) * a.y + t * b.y,
});

/**
 * de Casteljau 算法：求 n 阶贝塞尔曲线在参数 t 处的点。
 * @param controlPoints 控制点序列（≥2 个）
 * @param t 参数 ∈ [0,1]
 */
export function bezierDeCasteljau(
  controlPoints: readonly Point[],
  t: number,
  hooks: BezierHooks = {},
): Point {
  if (controlPoints.length < 2) {
    throw new RangeError('bezier 至少需要 2 个控制点');
  }
  let pts = controlPoints.map((p) => ({ ...p }));
  let level = 1;
  while (pts.length > 1) {
    const next: Point[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      next.push(lerp(pts[i]!, pts[i + 1]!, t));
    }
    hooks.onLevel?.(
      level,
      next.map((p) => ({ ...p })),
    );
    pts = next;
    level++;
  }
  return pts[0]!;
}

/** 用解析伯恩斯坦多项式求三次贝塞尔点（与 de Casteljau 等价，独立验证用）。 */
export function cubicBezierBernstein(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const u = 1 - t;
  const b0 = u * u * u;
  const b1 = 3 * u * u * t;
  const b2 = 3 * u * t * t;
  const b3 = t * t * t;
  return {
    x: b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
    y: b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
  };
}
