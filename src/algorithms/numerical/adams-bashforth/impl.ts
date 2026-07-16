// =============================================================================
// Adams-Bashforth 4 步法 · 纯算法实现
// 用 RK4 启动前 4 步，再用 AB4 公式推进。
// =============================================================================

export interface AdamsBashforthHooks {
  onStep?: (step: number, x: number, y: number, f: number) => void;
}

export interface AdamsBashforthResult {
  points: Array<{ x: number; y: number }>;
}

/** 单步 RK4（用于启动）。 */
function rk4Step(
  f: (x: number, y: number) => number,
  x: number,
  y: number,
  h: number,
): { y: number; slope: number } {
  const k1 = f(x, y);
  const k2 = f(x + h / 2, y + (h / 2) * k1);
  const k3 = f(x + h / 2, y + (h / 2) * k2);
  const k4 = f(x + h, y + h * k3);
  const newY = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
  return { y: newY, slope: f(x + h, newY) };
}

/**
 * Adams-Bashforth 4 步法解 y' = f(x, y)。
 * 前 3 步用 RK4 启动，累计 4 个历史斜率后切换到 AB4。
 */
export function adamsBashforth4(
  f: (x: number, y: number) => number,
  x0: number,
  y0: number,
  xEnd: number,
  h: number,
  hooks: AdamsBashforthHooks = {},
): AdamsBashforthResult {
  const points: Array<{ x: number; y: number }> = [{ x: x0, y: y0 }];
  // 历史：最近 4 个 (x, y, f)
  const history: Array<{ x: number; y: number; f: number }> = [{ x: x0, y: y0, f: f(x0, y0) }];
  let x = x0;
  let y = y0;
  let step = 0;

  while (x < xEnd - 1e-12) {
    step++;
    let newY: number;
    let newF: number;
    if (history.length < 4) {
      // 用 RK4 启动
      const r = rk4Step(f, x, y, h);
      newY = r.y;
      newF = r.slope;
    } else {
      // AB4：y_{n+1} = y_n + (h/24)(55 f_n - 59 f_{n-1} + 37 f_{n-2} - 9 f_{n-3})
      const f0 = history[history.length - 1]!.f;
      const f1 = history[history.length - 2]!.f;
      const f2 = history[history.length - 3]!.f;
      const f3 = history[history.length - 4]!.f;
      newY = y + (h / 24) * (55 * f0 - 59 * f1 + 37 * f2 - 9 * f3);
      newF = f(x + h, newY);
    }
    x = x + h;
    y = newY;
    history.push({ x, y, f: newF });
    if (history.length > 4) history.shift();
    points.push({ x, y });
    hooks.onStep?.(step, x, y, newF);
  }
  return { points };
}
