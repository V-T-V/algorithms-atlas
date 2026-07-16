// =============================================================================
// Dormand-Prince RK45（DOPRI5）· 纯算法实现
// =============================================================================

export type Derivative = (t: number, y: number) => number;

export interface DopriStep {
  t: number;
  y: number;
  h: number;
}

export interface DopriHooks {
  onStep?: (t: number, y: number, h: number, error: number, accepted: boolean) => void;
}

// Dormand-Prince 系数
const C2 = 1 / 5;
const C3 = 3 / 10;
const C4 = 4 / 5;
const C5 = 8 / 9;
const C6 = 1;
const C7 = 1;

const A21 = 1 / 5;
const A31 = 3 / 40;
const A32 = 9 / 40;
const A41 = 44 / 45;
const A42 = -56 / 15;
const A43 = 32 / 9;
const A51 = 19372 / 6561;
const A52 = -25360 / 2187;
const A53 = 64448 / 6561;
const A54 = -212 / 729;
const A61 = 9017 / 3168;
const A62 = -355 / 33;
const A63 = 46732 / 5247;
const A64 = 49 / 176;
const A65 = -5103 / 18656;
// DOPRI 第 7 阶段系数（FSAL：A7i 与 5 阶权重 Bi 相同），
// 故实现中直接由 yNew 计算 k7 = f(t+h, yNew)，无需单独的 A7i 常量。

// 5 阶权重 b_i
const B1 = 35 / 384;
const B3 = 500 / 1113;
const B4 = 125 / 192;
const B5 = -2187 / 6784;
const B6 = 11 / 84;
// B7 = 0
// 误差权重 b_i - b̂_i（b̂ 是 4 阶权重）
const E1 = 71 / 57600;
const E3 = -71 / 16695;
const E4 = 71 / 1920;
const E5 = -17253 / 339200;
const E6 = 22 / 525;
const E7 = -1 / 40;

/** 单步 DOPRI5：返回新 y 和局部误差。 */
export function dopriStep(
  f: Derivative,
  t: number,
  y: number,
  h: number,
): { yNew: number; error: number; k1: number } {
  const k1 = f(t, y);
  const k2 = f(t + C2 * h, y + h * (A21 * k1));
  const k3 = f(t + C3 * h, y + h * (A31 * k1 + A32 * k2));
  const k4 = f(t + C4 * h, y + h * (A41 * k1 + A42 * k2 + A43 * k3));
  const k5 = f(t + C5 * h, y + h * (A51 * k1 + A52 * k2 + A53 * k3 + A54 * k4));
  const k6 = f(t + C6 * h, y + h * (A61 * k1 + A62 * k2 + A63 * k3 + A64 * k4 + A65 * k5));
  const yNew = y + h * (B1 * k1 + B3 * k3 + B4 * k4 + B5 * k5 + B6 * k6);
  // k7 = f(t+h, yNew)（FSAL）
  const k7 = f(t + C7 * h, yNew);
  const error = Math.abs(h * (E1 * k1 + E3 * k3 + E4 * k4 + E5 * k5 + E6 * k6 + E7 * k7));
  return { yNew, error, k1 };
}

/** 自适应 DOPRI5 积分。 */
export function integrateDopri(
  f: Derivative,
  t0: number,
  y0: number,
  t1: number,
  h0: number,
  tol = 1e-6,
  maxSteps = 10000,
  hooks: DopriHooks = {},
): DopriStep[] {
  if (h0 <= 0) throw new RangeError('初始步长必须为正');
  if (tol <= 0) throw new RangeError('容差必须为正');
  const direction = t1 >= t0 ? 1 : -1;
  const out: DopriStep[] = [{ t: t0, y: y0, h: 0 }];
  let t = t0;
  let y = y0;
  let h = h0 * direction;
  for (let step = 0; step < maxSteps; step++) {
    if (direction * (t + h - t1) > 0) h = t1 - t;
    if (Math.abs(h) < 1e-15) break;
    const { yNew, error } = dopriStep(f, t, y, h);
    const errPerUnit = error / (Math.abs(h) + 1e-30);
    if (errPerUnit <= tol || Math.abs(h) < 1e-12) {
      t += h;
      y = yNew;
      out.push({ t, y, h });
      hooks.onStep?.(t, y, Math.abs(h), error, true);
      if (Math.abs(t - t1) < 1e-9) break;
    } else {
      hooks.onStep?.(t, y, Math.abs(h), error, false);
    }
    if (errPerUnit > 0) {
      const s = Math.min(5, Math.max(0.2, 0.9 * Math.pow(tol / errPerUnit, 0.2)));
      h *= s;
    }
  }
  return out;
}
