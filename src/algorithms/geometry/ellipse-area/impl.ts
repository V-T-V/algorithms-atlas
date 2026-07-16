// =============================================================================
// 椭圆面积（Ellipse Area）· 纯算法实现
// =============================================================================

export interface EllipseAreaHooks {
  /** 计算出面积。 */
  onArea?: (area: number) => void;
  /** 计算出离心率。 */
  onEccentricity?: (e: number) => void;
}

/** 椭圆面积 A = π·a·b。 */
export function ellipseArea(a: number, b: number, hooks: EllipseAreaHooks = {}): number {
  if (a <= 0) throw new RangeError(`半轴 a 须 > 0，收到 ${a}`);
  if (b <= 0) throw new RangeError(`半轴 b 须 > 0，收到 ${b}`);
  const A = Math.PI * a * b;
  hooks.onArea?.(A);
  // 离心率（约定 a 为半长轴；若 b>a 由调用方自行处理）
  const major = Math.max(a, b);
  const minor = Math.min(a, b);
  const e = Math.sqrt(1 - (minor * minor) / (major * major));
  hooks.onEccentricity?.(e);
  return A;
}

/** 由半长轴 a 与离心率 e 反推椭圆面积：A = π·a²·√(1 − e²)。 */
export function ellipseAreaFromEccentricity(
  a: number,
  e: number,
  hooks: EllipseAreaHooks = {},
): number {
  if (a <= 0) throw new RangeError(`半长轴 a 须 > 0，收到 ${a}`);
  if (e < 0 || e >= 1) throw new RangeError(`离心率 e 须在 [0,1)，收到 ${e}`);
  const b = a * Math.sqrt(1 - e * e);
  return ellipseArea(a, b, hooks);
}

/** 拉马努金椭圆周长近似。 */
export function ellipsePerimeterRamanujan(a: number, b: number): number {
  if (a <= 0 || b <= 0) throw new RangeError(`半轴须 > 0`);
  const h = (a - b) ** 2 / (a + b) ** 2;
  return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
}
