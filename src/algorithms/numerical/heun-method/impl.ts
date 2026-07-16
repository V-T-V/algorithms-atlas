// =============================================================================
// Heun 方法 (改进欧拉) · 纯算法实现
// k1=f(x,y); y*=y+h·k1; k2=f(x+h, y*); y ← y + (h/2)(k1+k2)
// =============================================================================

export interface HeunHooks {
  onStep?: (step: number, x: number, y: number, k1: number, yStar: number, k2: number) => void;
}

export interface HeunResult {
  points: Array<{ x: number; y: number }>;
}

export function heunMethod(
  f: (x: number, y: number) => number,
  x0: number,
  y0: number,
  xEnd: number,
  h: number,
  hooks: HeunHooks = {},
): HeunResult {
  const points: Array<{ x: number; y: number }> = [{ x: x0, y: y0 }];
  let x = x0;
  let y = y0;
  let step = 0;
  while (x < xEnd - 1e-12) {
    const k1 = f(x, y);
    const yStar = y + h * k1;
    const k2 = f(x + h, yStar);
    y = y + (h / 2) * (k1 + k2);
    x = x + h;
    step++;
    hooks.onStep?.(step, x, y, k1, yStar, k2);
    points.push({ x, y });
  }
  return { points };
}
