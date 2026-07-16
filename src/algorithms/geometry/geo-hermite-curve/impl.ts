// =============================================================================
// Hermite 曲线 · 纯算法实现
// =============================================================================

/** 二维点 / 向量。 */
export interface Point {
  x: number;
  y: number;
}

export interface HermiteHooks {
  /** 每采样一点后调用（t、点坐标）。 */
  onPoint?: (t: number, p: Point) => void;
}

/**
 * 三次 Hermite 曲线在 t 处的点。
 * @param p0 起点
 * @param p1 终点
 * @param m0 起点切向
 * @param m1 终点切向
 * @param t 参数 ∈ [0,1]
 */
export function hermite(p0: Point, p1: Point, m0: Point, m1: Point, t: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  const h0 = 2 * t3 - 3 * t2 + 1;
  const h1 = t3 - 2 * t2 + t;
  const h2 = -2 * t3 + 3 * t2;
  const h3 = t3 - t2;
  return {
    x: h0 * p0.x + h1 * m0.x + h2 * p1.x + h3 * m1.x,
    y: h0 * p0.y + h1 * m0.y + h2 * p1.y + h3 * m1.y,
  };
}

/** 采样 Hermite 曲线，返回 points 个点。 */
export function sampleHermite(
  p0: Point,
  p1: Point,
  m0: Point,
  m1: Point,
  samples: number,
  hooks: HermiteHooks = {},
): Point[] {
  if (samples < 2) throw new RangeError('samples 至少为 2');
  const out: Point[] = [];
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const p = hermite(p0, p1, m0, m1, t);
    out.push(p);
    hooks.onPoint?.(t, p);
  }
  return out;
}
