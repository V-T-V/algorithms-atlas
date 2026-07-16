// =============================================================================
// 外点对圆的切线（切点）Tangents from External Point to Circle · 纯算法实现
// =============================================================================

export interface Pt {
  x: number;
  y: number;
}

export interface TangentResult {
  /** 两个切点（无切点时为空数组）。 */
  tangentPoints: Pt[];
  /** 切线长度（= √(d² − r²)）。 */
  tangentLength: number;
}

export interface CircleTangentHooks {
  /** 计算出 T 相对 C 的方位角 α。 */
  onBearing?: (alpha: number) => void;
  /** 计算出夹角 φ = acos(r/d)。 */
  onAngle?: (phi: number) => void;
  /** 计算出两个切点。 */
  onTangentPoints?: (pts: Pt[]) => void;
}

/**
 * 求圆外一点 T 到圆 (C, r) 的切点。
 * @returns 两个切点；若 T 在圆内则返回空数组。
 */
export function circleTangent(
  c: Pt,
  r: number,
  t: Pt,
  hooks: CircleTangentHooks = {},
): TangentResult {
  if (r <= 0) throw new RangeError(`半径 r 须 > 0，收到 ${r}`);
  const dx = t.x - c.x;
  const dy = t.y - c.y;
  const d = Math.hypot(dx, dy);
  if (d <= r) {
    // T 在圆内或圆上：无切线
    return { tangentPoints: [], tangentLength: 0 };
  }
  const alpha = Math.atan2(dy, dx);
  hooks.onBearing?.(alpha);
  const phi = Math.acos(r / d);
  hooks.onAngle?.(phi);
  const p1: Pt = { x: c.x + r * Math.cos(alpha - phi), y: c.y + r * Math.sin(alpha - phi) };
  const p2: Pt = { x: c.x + r * Math.cos(alpha + phi), y: c.y + r * Math.sin(alpha + phi) };
  const pts = [p1, p2];
  hooks.onTangentPoints?.(pts);
  const tangentLength = Math.sqrt(d * d - r * r);
  return { tangentPoints: pts, tangentLength };
}
