// =============================================================================
// 圆弧长度（Arc Length）· 纯算法实现
// =============================================================================

export interface ArcLengthHooks {
  /** 由角度（弧度）算出弧长。 */
  onArcLength?: (theta: number, length: number) => void;
}

/** 由半径与圆心角（弧度）求弧长。 */
export function arcLength(theta: number, r: number, hooks: ArcLengthHooks = {}): number {
  if (r < 0) throw new RangeError(`半径 r 须 >= 0，收到 ${r}`);
  if (theta < 0) throw new RangeError(`角度 θ 须 >= 0，收到 ${theta}`);
  const L = r * theta;
  hooks.onArcLength?.(theta, L);
  return L;
}

/** 把角度（度数）转弧度。 */
export function degreesToRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** 由弦长 c 与半径 r 反推弧长。 */
export function arcLengthFromChord(c: number, r: number, hooks: ArcLengthHooks = {}): number {
  if (r <= 0) throw new RangeError(`半径 r 须 > 0，收到 ${r}`);
  if (c < 0) throw new RangeError(`弦长 c 须 >= 0，收到 ${c}`);
  if (c > 2 * r) throw new RangeError(`弦长 c(${c}) 不能超过直径 2r(${2 * r})`);
  const theta = 2 * Math.asin(c / (2 * r));
  return arcLength(theta, r, hooks);
}
