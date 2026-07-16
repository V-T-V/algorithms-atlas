// 二维蒙特卡洛积分 · 实现

export type Rng = () => number;
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export interface Rect {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface Mc2dHooks {
  onSample?: (x: number, y: number, hit: boolean) => void;
}

/** 用蒙特卡洛估计指示函数 f 在矩形上的积分（≈ f 的面积）。 */
export function monteCarloIntegrate2d(
  f: (x: number, y: number) => boolean,
  rect: Rect,
  n: number,
  rng: Rng,
  hooks: Mc2dHooks = {},
): number {
  let hits = 0;
  const area = (rect.x1 - rect.x0) * (rect.y1 - rect.y0);
  for (let i = 0; i < n; i++) {
    const x = rect.x0 + rng() * (rect.x1 - rect.x0);
    const y = rect.y0 + rng() * (rect.y1 - rect.y0);
    const hit = f(x, y);
    if (hit) hits++;
    hooks.onSample?.(x, y, hit);
  }
  return (hits / n) * area;
}
