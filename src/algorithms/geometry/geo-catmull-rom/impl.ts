// =============================================================================
// Catmull-Rom 样条 · 纯算法实现
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

export interface CatmullHooks {
  /** 每段开始时调用（段号）。 */
  onSegment?: (seg: number) => void;
  /** 每采样点（段号、t、点）。 */
  onPoint?: (seg: number, t: number, p: Point) => void;
}

/**
 * 单段 Catmull-Rom：由相邻四点 P0..P3 求 P1→P2 段在 t 处的点。
 */
export function catmullRomSegment(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

/**
 * 对整条控制点链采样 Catmull-Rom 曲线。
 * 端点用复制延拓（P0 前虚拟点 = P0，Pn 后虚拟点 = Pn）。
 * @param points 控制点（≥2 个）
 * @param samplesPerSeg 每段采样数
 */
export function catmullRom(
  points: readonly Point[],
  samplesPerSeg: number,
  hooks: CatmullHooks = {},
): Point[] {
  if (points.length < 2) throw new RangeError('catmullRom 至少需要 2 个控制点');
  if (samplesPerSeg < 2) throw new RangeError('samplesPerSeg 至少为 2');
  const out: Point[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? points[i + 1]!;
    hooks.onSegment?.(i);
    const steps = samplesPerSeg;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const p = catmullRomSegment(p0, p1, p2, p3, t);
      out.push(p);
      hooks.onPoint?.(i, t, p);
    }
  }
  // 最后一段补上终点
  out.push({ ...points[points.length - 1]! });
  return out;
}
