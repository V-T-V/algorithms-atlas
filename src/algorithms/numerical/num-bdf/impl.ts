// =============================================================================
// BDF2 向后差分公式（隐式，简单不动点迭代）· 纯算法实现
// =============================================================================

export type Derivative = (t: number, y: number) => number;

export interface BdfStep {
  t: number;
  y: number;
}

export interface BdfHooks {
  onStep?: (t: number, y: number, iterations: number) => void;
}

/** RK4 单步（自举）。 */
function rk4Step(f: Derivative, t: number, y: number, h: number): number {
  const k1 = f(t, y);
  const k2 = f(t + h / 2, y + (h / 2) * k1);
  const k3 = f(t + h / 2, y + (h / 2) * k2);
  const k4 = f(t + h, y + h * k3);
  return y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
}

/** BDF2 单步隐式求解：不动点迭代。返回新的 y 和迭代次数。 */
export function bdf2Step(
  f: Derivative,
  tNext: number,
  yPrev: number,
  yCurr: number,
  h: number,
  tol = 1e-10,
  maxIter = 100,
): { yNext: number; iter: number } {
  // 初始猜测：显式外推
  let yNext = yCurr + (yCurr - yPrev);
  const factor = 2 / 3;
  const c = factor * (2 * yCurr - 0.5 * yPrev);
  for (let iter = 0; iter < maxIter; iter++) {
    const fVal = f(tNext, yNext);
    const yNew = c + factor * h * fVal;
    if (Math.abs(yNew - yNext) < tol) {
      return { yNext: yNew, iter: iter + 1 };
    }
    yNext = yNew;
  }
  return { yNext, iter: maxIter };
}

/** BDF2 积分。 */
export function integrateBdf2(
  f: Derivative,
  t0: number,
  y0: number,
  t1: number,
  steps: number,
  hooks: BdfHooks = {},
): BdfStep[] {
  if (steps <= 1) throw new RangeError('步数必须 > 1');
  const h = (t1 - t0) / steps;
  // 用 RK4 自举第一步
  const out: BdfStep[] = [{ t: t0, y: y0 }];
  let t = t0;
  let yPrev = y0;
  let y = rk4Step(f, t, y0, h);
  t += h;
  out.push({ t, y });
  // BDF2 继续
  for (let i = 1; i < steps; i++) {
    const { yNext, iter } = bdf2Step(f, t + h, yPrev, y, h);
    yPrev = y;
    y = yNext;
    t += h;
    out.push({ t, y });
    hooks.onStep?.(t, y, iter);
  }
  return out;
}
