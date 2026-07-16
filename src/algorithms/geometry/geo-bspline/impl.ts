// =============================================================================
// B 样条曲线（均匀三次）· 纯算法实现
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

export interface BSplineHooks {
  /** 每段开始时调用（段号）。 */
  onSegment?: (seg: number) => void;
  /** 每采样点（段号、t、点）。 */
  onPoint?: (seg: number, t: number, p: Point) => void;
}

/**
 * 单段均匀三次 B 样条：由相邻四点 P0..P3 在 t∈[0,1] 求点。
 */
export function bsplineSegment(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  const b0 = (-t3 + 3 * t2 - 3 * t + 1) / 6;
  const b1 = (3 * t3 - 6 * t2 + 4) / 6;
  const b2 = (-3 * t3 + 3 * t2 + 3 * t + 1) / 6;
  const b3 = t3 / 6;
  return {
    x: b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
    y: b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
  };
}

/**
 * 对控制点链采样均匀三次 B 样条。
 * 首末各复制一个端点，使曲线起止接近首末控制点。
 * @param control 控制点（≥4 个）
 * @param samplesPerSeg 每段采样数
 */
export function bspline(
  control: readonly Point[],
  samplesPerSeg: number,
  hooks: BSplineHooks = {},
): Point[] {
  if (control.length < 4) throw new RangeError('bspline 至少需要 4 个控制点');
  if (samplesPerSeg < 2) throw new RangeError('samplesPerSeg 至少为 2');
  // 端点复制延拓
  const ext = [control[0]!, ...control, control[control.length - 1]!];
  const out: Point[] = [];
  const segs = ext.length - 3;
  for (let i = 0; i < segs; i++) {
    const p0 = ext[i]!;
    const p1 = ext[i + 1]!;
    const p2 = ext[i + 2]!;
    const p3 = ext[i + 3]!;
    hooks.onSegment?.(i);
    for (let s = 0; s < samplesPerSeg; s++) {
      const t = s / samplesPerSeg;
      const p = bsplineSegment(p0, p1, p2, p3, t);
      out.push(p);
      hooks.onPoint?.(i, t, p);
    }
  }
  return out;
}
