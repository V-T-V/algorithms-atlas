// =============================================================================
// 线段共线判定（Segment Collinearity Test）· 纯算法实现
// =============================================================================

/** 二维点 / 向量。 */
export interface Point {
  x: number;
  y: number;
}

export interface CollinearResult {
  /** 两线段是否共线（四点都在同一直线上）。 */
  collinear: boolean;
  /** 共线情况下是否在投影上有重叠（重叠 > 0 长度，含端点相接视为重叠）。 */
  overlap: boolean;
}

export interface CollinearHooks {
  onCross?: (crossAC: number, crossAD: number) => void;
  onResult?: (r: CollinearResult) => void;
}

const EPS = 1e-9;

/** 叉积 (B - A) × (C - A)。 */
export function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

/**
 * 判定线段 AB 与线段 CD 是否共线、是否重叠。
 * 共线要求 C、D 都在直线 AB 上（叉积为 0）。
 * 重叠判定：共线时，把四点投影到主导轴上比较区间相交。
 */
export function segmentCollinear(
  a: Point,
  b: Point,
  c: Point,
  d: Point,
  hooks: CollinearHooks = {},
): CollinearResult {
  const cAC = cross(a, b, c);
  const cAD = cross(a, b, d);
  hooks.onCross?.(cAC, cAD);
  const collinear = Math.abs(cAC) <= EPS && Math.abs(cAD) <= EPS;
  let overlap = false;
  if (collinear) {
    // 投影到主导轴（dx 或 dy 较大者）
    const dx = Math.abs(b.x - a.x);
    const dy = Math.abs(b.y - a.y);
    if (dx >= dy) {
      const lo1 = Math.min(a.x, b.x);
      const hi1 = Math.max(a.x, b.x);
      const lo2 = Math.min(c.x, d.x);
      const hi2 = Math.max(c.x, d.x);
      overlap = Math.min(hi1, hi2) - Math.max(lo1, lo2) > -EPS;
    } else {
      const lo1 = Math.min(a.y, b.y);
      const hi1 = Math.max(a.y, b.y);
      const lo2 = Math.min(c.y, d.y);
      const hi2 = Math.max(c.y, d.y);
      overlap = Math.min(hi1, hi2) - Math.max(lo1, lo2) > -EPS;
    }
  }
  const r: CollinearResult = { collinear, overlap };
  hooks.onResult?.(r);
  return r;
}
