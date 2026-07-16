// =============================================================================
// 中点法 (Midpoint Method) · 纯算法实现
// 二阶显式单步法：k1=f(x,y); k2=f(x+h/2, y+h/2·k1); y ← y + h·k2
// =============================================================================

export interface MidpointHooks {
  onStep?: (step: number, x: number, y: number, k1: number, k2: number) => void;
}

export interface MidpointResult {
  points: Array<{ x: number; y: number }>;
}

/**
 * 中点法解 y' = f(x, y)。
 * @param f 右端函数
 * @param x0 初值 x
 * @param y0 初值 y
 * @param xEnd 终点 x
 * @param h 步长
 */
export function midpointMethod(
  f: (x: number, y: number) => number,
  x0: number,
  y0: number,
  xEnd: number,
  h: number,
  hooks: MidpointHooks = {},
): MidpointResult {
  const points: Array<{ x: number; y: number }> = [{ x: x0, y: y0 }];
  let x = x0;
  let y = y0;
  let step = 0;
  while (x < xEnd - 1e-12) {
    const k1 = f(x, y);
    const k2 = f(x + h / 2, y + (h / 2) * k1);
    y = y + h * k2;
    x = x + h;
    step++;
    hooks.onStep?.(step, x, y, k1, k2);
    points.push({ x, y });
  }
  return { points };
}
