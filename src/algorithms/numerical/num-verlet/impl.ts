// =============================================================================
// 速度 Verlet 积分（辛）· 纯算法实现
// =============================================================================

export type Accel = (x: number) => number;

export interface VerletStep {
  t: number;
  x: number;
  v: number;
}

export interface VerletHooks {
  onStep?: (t: number, x: number, v: number) => void;
}

/** 单步速度 Verlet。 */
export function verletStep(
  accel: Accel,
  x: number,
  v: number,
  a: number,
  h: number,
): { xNew: number; vNew: number; aNew: number } {
  const xNew = x + h * v + ((h * h) / 2) * a;
  const aNew = accel(xNew);
  const vNew = v + (h / 2) * (a + aNew);
  return { xNew, vNew, aNew };
}

/** 速度 Verlet 积分：x'' = a(x)。 */
export function integrateVerlet(
  accel: Accel,
  t0: number,
  x0: number,
  v0: number,
  t1: number,
  steps: number,
  hooks: VerletHooks = {},
): VerletStep[] {
  if (steps <= 0) throw new RangeError('步数必须为正');
  const h = (t1 - t0) / steps;
  const out: VerletStep[] = [{ t: t0, x: x0, v: v0 }];
  let t = t0;
  let x = x0;
  let v = v0;
  let a = accel(x);
  for (let i = 0; i < steps; i++) {
    const r = verletStep(accel, x, v, a, h);
    x = r.xNew;
    v = r.vNew;
    a = r.aNew;
    t = t0 + (i + 1) * h;
    out.push({ t, x, v });
    hooks.onStep?.(t, x, v);
  }
  return out;
}
