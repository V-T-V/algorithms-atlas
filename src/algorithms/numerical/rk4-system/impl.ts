// =============================================================================
// RK4 方程组 · 纯算法实现
// 解耦合 ODE 组 y' = F(x, y)，y ∈ R^s。
// =============================================================================

type Vec = number[];

export interface RK4SystemHooks {
  onStep?: (step: number, x: number, y: Vec) => void;
}

export interface RK4SystemResult {
  points: Array<{ x: number; y: Vec }>;
}

function add(a: Vec, b: Vec): Vec {
  return a.map((v, i) => v + b[i]!);
}
function addScaled(a: Vec, b: Vec, s: number): Vec {
  return a.map((v, i) => v + b[i]! * s);
}
function scale(a: Vec, s: number): Vec {
  return a.map((v) => v * s);
}

/**
 * 经典 RK4 解 ODE 方程组 y' = F(x, y)。
 * @param F 右端向量函数
 * @param x0 初值 x
 * @param y0 初值向量（长度 = 系统维数）
 * @param xEnd 终点 x
 * @param h 步长
 */
export function rk4System(
  F: (x: number, y: Vec) => Vec,
  x0: number,
  y0: Vec,
  xEnd: number,
  h: number,
  hooks: RK4SystemHooks = {},
): RK4SystemResult {
  const points: Array<{ x: number; y: Vec }> = [{ x: x0, y: [...y0] }];
  let x = x0;
  let y = [...y0];
  let step = 0;
  while (x < xEnd - 1e-12) {
    const k1 = F(x, y);
    const k2 = F(x + h / 2, addScaled(y, k1, h / 2));
    const k3 = F(x + h / 2, addScaled(y, k2, h / 2));
    const k4 = F(x + h, addScaled(y, k3, h));
    // y ← y + (h/6)(k1 + 2k2 + 2k3 + k4)
    const sum = add(add(add(k1, scale(k2, 2)), scale(k3, 2)), k4);
    y = addScaled(y, sum, h / 6);
    x = x + h;
    step++;
    hooks.onStep?.(step, x, y);
    points.push({ x, y: [...y] });
  }
  return { points };
}
