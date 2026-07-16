// =============================================================================
// Euler 法 + Richardson 外推 · 纯算法实现
// =============================================================================

export type Derivative = (t: number, y: number) => number;

export interface EulerStep {
  t: number;
  y: number;
}

export interface RichardsonHooks {
  onCoarseStep?: (t: number, y: number) => void;
  onFineStep?: (t: number, y: number) => void;
}

/** 前向欧拉积分单步。 */
export function eulerStep(f: Derivative, t: number, y: number, h: number): number {
  return y + h * f(t, y);
}

/** 用步长 h 积分 [t0, t1]，返回终点值。 */
export function integrateEuler(
  f: Derivative,
  t0: number,
  y0: number,
  t1: number,
  steps: number,
  hooks: RichardsonHooks = {},
): number {
  if (steps <= 0) throw new RangeError('步数必须为正');
  const h = (t1 - t0) / steps;
  let t = t0;
  let y = y0;
  for (let i = 0; i < steps; i++) {
    y = eulerStep(f, t, y, h);
    t = t0 + (i + 1) * h;
    hooks.onCoarseStep?.(t, y);
  }
  return y;
}

/**
 * Richardson 外推：用步长对应 n 步和 2n 步各积分一次，外推消去一阶误差。
 * 返回外推后的近似值（接近二阶精度）。
 */
export function eulerRichardson(
  f: Derivative,
  t0: number,
  y0: number,
  t1: number,
  steps: number,
  hooks: RichardsonHooks = {},
): { coarse: number; fine: number; extrapolated: number } {
  if (steps <= 0) throw new RangeError('步数必须为正');
  const yH = integrateEuler(f, t0, y0, t1, steps, { onCoarseStep: hooks.onCoarseStep });
  const yH2 = integrateEuler(f, t0, y0, t1, steps * 2, { onCoarseStep: hooks.onFineStep });
  // Euler 是 O(h)：A* = 2*A(h/2) - A(h)
  const extrapolated = 2 * yH2 - yH;
  return { coarse: yH, fine: yH2, extrapolated };
}

/** 返回完整轨迹（细步长），便于可视化。 */
export function trajectory(
  f: Derivative,
  t0: number,
  y0: number,
  t1: number,
  steps: number,
): EulerStep[] {
  if (steps <= 0) throw new RangeError('步数必须为正');
  const h = (t1 - t0) / steps;
  const out: EulerStep[] = [{ t: t0, y: y0 }];
  let t = t0;
  let y = y0;
  for (let i = 0; i < steps; i++) {
    y = eulerStep(f, t, y, h);
    t = t0 + (i + 1) * h;
    out.push({ t, y });
  }
  return out;
}
