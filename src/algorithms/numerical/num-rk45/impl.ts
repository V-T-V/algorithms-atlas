// =============================================================================
// RK45 自适应（Runge-Kutta-Fehlberg）· 纯算法实现
// =============================================================================

export type Derivative = (t: number, y: number) => number;

export interface Rk45Step {
  t: number;
  y: number;
  h: number;
}

export interface Rk45Hooks {
  onStep?: (t: number, y: number, h: number, error: number, accepted: boolean) => void;
}

// Fehlberg 系数（RKF45）
const A = [
  [1 / 4],
  [3 / 32, 9 / 32],
  [1932 / 2197, -7200 / 2197, 7296 / 2197],
  [439 / 216, -8, 3680 / 513, -845 / 4104],
  [-8 / 27, 2, -3544 / 2565, 1859 / 4104, -11 / 40],
];
const C = [0, 1 / 4, 3 / 8, 12 / 13, 1, 1 / 2];
// 4 阶权重
const B4 = [25 / 216, 0, 1408 / 2565, 2197 / 4104, -1 / 5, 0];
// 5 阶权重
const B5 = [16 / 135, 0, 6656 / 12825, 28561 / 56430, -9 / 50, 2 / 55];

/** 单步 RKF45：返回 4 阶、5 阶近似与各级 k。 */
export function rkf45Step(
  f: Derivative,
  t: number,
  y: number,
  h: number,
): { y4: number; y5: number; error: number; ks: number[] } {
  const ks: number[] = [f(t, y)];
  for (let i = 1; i < 6; i++) {
    let dy = 0;
    for (let j = 0; j < i; j++) dy += A[i - 1]![j]! * ks[j]!;
    ks.push(f(t + C[i]! * h, y + h * dy));
  }
  let y4 = 0;
  let y5 = 0;
  for (let i = 0; i < 6; i++) {
    y4 += B4[i]! * ks[i]!;
    y5 += B5[i]! * ks[i]!;
  }
  return { y4: y + h * y4, y5: y + h * y5, error: Math.abs(h * (y5 - y4)), ks };
}

/** 自适应 RKF45 积分 [t0, t1]。 */
export function integrateRk45(
  f: Derivative,
  t0: number,
  y0: number,
  t1: number,
  h0: number,
  tol = 1e-6,
  maxSteps = 10000,
  hooks: Rk45Hooks = {},
): Rk45Step[] {
  if (h0 <= 0) throw new RangeError('初始步长必须为正');
  if (tol <= 0) throw new RangeError('容差必须为正');
  const direction = t1 >= t0 ? 1 : -1;
  const out: Rk45Step[] = [{ t: t0, y: y0, h: 0 }];
  let t = t0;
  let y = y0;
  let h = h0 * direction;
  for (let step = 0; step < maxSteps; step++) {
    // 防止越过终点
    if (direction * (t + h - t1) > 0) h = t1 - t;
    if (Math.abs(h) < 1e-15) break;
    const { y5, error } = rkf45Step(f, t, y, h);
    const errPerUnit = error / (Math.abs(h) + 1e-30);
    if (errPerUnit <= tol || Math.abs(h) < 1e-12) {
      t += h;
      y = y5;
      out.push({ t, y, h });
      hooks.onStep?.(t, y, Math.abs(h), error, true);
      if (Math.abs(t - t1) < 1e-9) break;
    } else {
      hooks.onStep?.(t, y, Math.abs(h), error, false);
    }
    // 步长调整
    if (errPerUnit > 0) {
      const s = Math.min(5, Math.max(0.1, 0.84 * Math.pow(tol / errPerUnit, 0.2)));
      h *= s;
    }
  }
  return out;
}
