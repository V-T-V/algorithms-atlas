// =============================================================================
// Adams-Moulton 隐式多步法（AB4-AM4 PECE 预测-校正）· 纯算法实现
// =============================================================================

export type Derivative = (t: number, y: number) => number;

export interface AmStep {
  t: number;
  y: number;
}

export interface AmHooks {
  onStep?: (t: number, yPredicted: number, yCorrected: number) => void;
}

/** RK4 单步（用于自举）。 */
function rk4Step(f: Derivative, t: number, y: number, h: number): number {
  const k1 = f(t, y);
  const k2 = f(t + h / 2, y + (h / 2) * k1);
  const k3 = f(t + h / 2, y + (h / 2) * k2);
  const k4 = f(t + h, y + h * k3);
  return y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
}

/** AB4 预测：用 f_n, f_{n-1}, f_{n-2}, f_{n-3}。 */
function ab4(f0: number, f1: number, f2: number, f3: number, y: number, h: number): number {
  return y + (h / 24) * (55 * f0 - 59 * f1 + 37 * f2 - 9 * f3);
}

/** AM4 校正：用 f_{n+1}, f_n, f_{n-1}, f_{n-2}。 */
function am4(fNext: number, f0: number, f1: number, f2: number, y: number, h: number): number {
  return y + (h / 24) * (9 * fNext + 19 * f0 - 5 * f1 + f2);
}

/** AB4-AM4 PECE 积分 [t0, t1]。 */
export function integrateAdamsMoulton(
  f: Derivative,
  t0: number,
  y0: number,
  t1: number,
  steps: number,
  hooks: AmHooks = {},
): AmStep[] {
  if (steps <= 0) throw new RangeError('步数必须为正');
  const h = (t1 - t0) / steps;
  if (steps < 4) throw new RangeError('Adams-Moulton 至少需要 4 步');
  // RK4 自举前 4 步
  const out: AmStep[] = [{ t: t0, y: y0 }];
  const fs: number[] = [f(t0, y0)];
  let t = t0;
  let y = y0;
  for (let i = 0; i < 3; i++) {
    y = rk4Step(f, t, y, h);
    t += h;
    out.push({ t, y });
    fs.push(f(t, y));
  }
  // AB4-AM4 PECE 继续剩余步
  for (let i = 3; i < steps; i++) {
    // 预测
    const yPred = ab4(fs[3]!, fs[2]!, fs[1]!, fs[0]!, y, h);
    const tNext = t + h;
    const fPred = f(tNext, yPred);
    // 校正
    const yCorr = am4(fPred, fs[3]!, fs[2]!, fs[1]!, y, h);
    const fCorr = f(tNext, yCorr);
    hooks.onStep?.(tNext, yPred, yCorr);
    y = yCorr;
    t = tNext;
    out.push({ t, y });
    // 滑动窗口
    fs[0] = fs[1]!;
    fs[1] = fs[2]!;
    fs[2] = fs[3]!;
    fs[3] = fCorr;
  }
  return out;
}
