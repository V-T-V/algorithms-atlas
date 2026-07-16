// =============================================================================
// 点对称（点反射）Point Reflection · 纯算法实现
// P' = 2C − P
// =============================================================================

export interface Pt {
  x: number;
  y: number;
}

export interface PointReflectionHooks {
  /** 求出 P 关于 C 的对称点 P\'。 */
  onReflect?: (p: Pt, c: Pt, reflected: Pt) => void;
}

/**
 * 求点 P 关于中心 C 的对称点。
 * @param p 待反射的点
 * @param c 对称中心
 * @returns P 关于 C 的对称点
 */
export function reflectPoint(p: Pt, c: Pt, hooks: PointReflectionHooks = {}): Pt {
  const r: Pt = { x: 2 * c.x - p.x, y: 2 * c.y - p.y };
  hooks.onReflect?.(p, c, r);
  return r;
}

/**
 * 批量反射点集关于中心 C。
 * @returns 反射后的点集（顺序对应）
 */
export function reflectPoints(
  points: readonly Pt[],
  c: Pt,
  hooks: PointReflectionHooks = {},
): Pt[] {
  return points.map((p) => reflectPoint(p, c, hooks));
}
