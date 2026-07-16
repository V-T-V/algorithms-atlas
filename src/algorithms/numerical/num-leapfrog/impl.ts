// =============================================================================
// Leapfrog 蛙跳积分（辛）· 纯算法实现
// =============================================================================

export type Accel = (x: number) => number;

export interface LeapfrogStep {
  t: number;
  x: number;
  v: number;
}

export interface LeapfrogHooks {
  onStep?: (t: number, x: number, v: number) => void;
}

/** Leapfrog 积分：x'' = a(x)，从 (t0, x0, v0) 积到 t1，返回完整轨迹。 */
export function integrateLeapfrog(
  accel: Accel,
  t0: number,
  x0: number,
  v0: number,
  t1: number,
  steps: number,
  hooks: LeapfrogHooks = {},
): LeapfrogStep[] {
  if (steps <= 0) throw new RangeError('步数必须为正');
  const h = (t1 - t0) / steps;
  const out: LeapfrogStep[] = [{ t: t0, x: x0, v: v0 }];
  let t = t0;
  let x = x0;
  // 半步速度
  let vHalf = v0 + (h / 2) * accel(x);
  for (let i = 0; i < steps; i++) {
    // 全步位置
    x = x + h * vHalf;
    t = t0 + (i + 1) * h;
    // 全步速度（用新位置算加速度）
    const a = accel(x);
    vHalf = vHalf + h * a;
    // 同步速度（vFull = vHalf - (h/2)·a，把速度推回整数点）
    const vFull = vHalf - (h / 2) * a;
    out.push({ t, x, v: vFull });
    hooks.onStep?.(t, x, vFull);
  }
  return out;
}

/** 单步 Leapfrog（已知 v_{n-1/2}），返回 {xNew, vNewHalf}。 */
export function leapfrogStep(
  accel: Accel,
  x: number,
  vHalf: number,
  h: number,
): { xNew: number; vNewHalf: number } {
  const xNew = x + h * vHalf;
  const vNewHalf = vHalf + h * accel(xNew);
  return { xNew, vNewHalf };
}
