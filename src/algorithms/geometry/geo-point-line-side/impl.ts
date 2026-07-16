// =============================================================================
// 点在直线哪侧（Point-Line Side Test）· 纯算法实现
// =============================================================================

/** 二维点 / 向量。 */
export interface Point {
  x: number;
  y: number;
}

export interface SideHooks {
  /** 计算叉积后调用（叉积值、判定结果 1/-1/0）。 */
  onCross?: (crossValue: number, side: number) => void;
}

const EPS = 1e-9;

/** 叉积 (B - A) × (P - A)。>0 左，<0 右，=0 共线。 */
export function cross(a: Point, b: Point, p: Point): number {
  return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
}

/**
 * 点 P 在有向直线 AB 的哪一侧。
 * @returns 1=左侧（CCW），-1=右侧，0=共线
 */
export function pointLineSide(a: Point, b: Point, p: Point, hooks: SideHooks = {}): number {
  const c = cross(a, b, p);
  let side = 0;
  if (c > EPS) side = 1;
  else if (c < -EPS) side = -1;
  hooks.onCross?.(c, side);
  return side;
}
