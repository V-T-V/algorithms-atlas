// =============================================================================
// 龙格-库塔法 Runge-Kutta RK4 · 纯算法实现
// 四阶经典 RK4：用 4 个斜率加权平均，解 ODE 初值问题 y' = f(x,y)。
// =============================================================================

export interface RK4Hooks {
  /** 每完成一步时触发。 */
  onStep?: (
    step: number,
    x: number,
    y: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
  ) => void;
}

export interface RK4Result {
  points: Array<{ x: number; y: number }>;
}

/**
 * 经典四阶 Runge-Kutta 法。
 * @param f 微分方程右端 f(x, y)
 * @param x0 初始 x
 * @param y0 初始 y
 * @param xEnd 终点 x
 * @param h 步长
 */
export function rungeKutta4(
  f: (x: number, y: number) => number,
  x0: number,
  y0: number,
  xEnd: number,
  h: number,
  hooks: RK4Hooks = {},
): RK4Result {
  const points: Array<{ x: number; y: number }> = [{ x: x0, y: y0 }];
  let x = x0;
  let y = y0;
  let step = 0;

  while (x < xEnd - 1e-12) {
    const k1 = f(x, y);
    const k2 = f(x + h / 2, y + (h * k1) / 2);
    const k3 = f(x + h / 2, y + (h * k2) / 2);
    const k4 = f(x + h, y + h * k3);
    y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    x = x + h;
    step++;
    hooks.onStep?.(step, x, y, k1, k2, k3, k4);
    points.push({ x, y });
  }
  return { points };
}
