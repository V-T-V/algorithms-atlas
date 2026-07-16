// Gibbs 采样 · 实现
// 示例：二元正态分布 N([mu0,mu1], 协差 [[1,rho],[rho,1]]) 的条件分布可解析

export type Rng = () => number;
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export interface GibbsHooks {
  onUpdate?: (dim: number, value: number, state: number[]) => void;
}

/**
 * Gibbs 采样二元正态。
 * 条件分布：x0 | x1 ~ N(mu0 + rho*(x1-mu1)/1, 1-rho^2)
 *          x1 | x0 ~ N(mu1 + rho*(x0-mu0)/1, 1-rho^2)
 */
export function gibbsSample2d(
  steps: number,
  mu0: number,
  mu1: number,
  rho: number,
  start: [number, number],
  rng: Rng,
  hooks: GibbsHooks = {},
): Array<[number, number]> {
  const samples: Array<[number, number]> = [];
  let [x0, x1] = start;
  const condStd = Math.sqrt(1 - rho * rho);
  // Box-Muller 生成正态
  const normal = (): number => {
    const u1 = Math.max(1e-9, rng());
    const u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  for (let i = 0; i < steps; i++) {
    // 采样 x0 | x1
    const mean0 = mu0 + rho * (x1 - mu1);
    x0 = mean0 + condStd * normal();
    hooks.onUpdate?.(0, x0, [x0, x1]);
    // 采样 x1 | x0
    const mean1 = mu1 + rho * (x0 - mu0);
    x1 = mean1 + condStd * normal();
    hooks.onUpdate?.(1, x1, [x0, x1]);
    samples.push([x0, x1]);
  }
  return samples;
}
