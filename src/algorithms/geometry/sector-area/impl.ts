// =============================================================================
// 扇形面积（Sector Area）· 纯算法实现
// =============================================================================

export interface SectorAreaHooks {
  /** 由角度算出扇形面积。 */
  onSectorArea?: (theta: number, area: number) => void;
}

/** 由半径与圆心角（弧度）求扇形面积：A = ½·r²·θ。 */
export function sectorArea(theta: number, r: number, hooks: SectorAreaHooks = {}): number {
  if (r < 0) throw new RangeError(`半径 r 须 >= 0，收到 ${r}`);
  if (theta < 0) throw new RangeError(`角度 θ 须 >= 0，收到 ${theta}`);
  const A = 0.5 * r * r * theta;
  hooks.onSectorArea?.(theta, A);
  return A;
}

/** 由半径与弧长求扇形面积：A = ½·r·L。 */
export function sectorAreaFromArc(L: number, r: number, hooks: SectorAreaHooks = {}): number {
  if (r < 0) throw new RangeError(`半径 r 须 >= 0，收到 ${r}`);
  if (L < 0) throw new RangeError(`弧长 L 须 >= 0，收到 ${L}`);
  const A = 0.5 * r * L;
  hooks.onSectorArea?.(r === 0 ? 0 : L / r, A);
  return A;
}
