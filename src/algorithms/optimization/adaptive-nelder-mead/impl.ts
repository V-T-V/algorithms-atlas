// =============================================================================
// 自适应 Nelder-Mead · 纯算法实现
// Gao-Han 维度自适应形变系数。零 DOM 依赖，可独立单测。
// =============================================================================

export interface NMPoint {
  x: number[];
  fx: number;
}

export interface AdaptiveNMResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

export interface AdaptiveNMHooks {
  onIter?: (iter: number, best: NMPoint, simplex: NMPoint[]) => void;
}

/** 自适应系数（Gao-Han 2012）。 */
export function adaptiveCoeffs(n: number): {
  alpha: number;
  gamma: number;
  rho: number;
  sigma: number;
} {
  return {
    alpha: 1,
    gamma: 1 + 2 / n,
    rho: 0.75 - 1 / (2 * n),
    sigma: 1 - 1 / n,
  };
}

/**
 * 自适应 Nelder-Mead（Gao-Han）。
 *
 * @param f 目标函数
 * @param init 初始顶点
 * @param options maxIter / tol / initStep
 * @param hooks 可选事件钩子
 */
export function adaptiveNelderMead(
  f: (x: number[]) => number,
  init: number[],
  options: { maxIter?: number; tol?: number; initStep?: number } = {},
  hooks: AdaptiveNMHooks = {},
): AdaptiveNMResult {
  const { maxIter = 500, tol = 1e-10, initStep = 1 } = options;
  const n = init.length;
  const { alpha, gamma, rho, sigma } = adaptiveCoeffs(n);

  const simplex: NMPoint[] = [{ x: [...init], fx: f(init) }];
  for (let i = 0; i < n; i++) {
    const x = [...init];
    x[i] = (x[i] ?? 0) + initStep;
    simplex.push({ x, fx: f(x) });
  }

  const sortByFx = (): void => {
    simplex.sort((a, b) => a.fx - b.fx);
  };
  sortByFx();
  let iterations = 0;
  let converged = false;

  const centroidExcludingWorst = (): number[] => {
    const c = new Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c[j]! += simplex[i]!.x[j]!;
    for (let j = 0; j < n; j++) c[j]! /= n;
    return c;
  };

  const size = (): number => Math.abs(simplex[n]!.fx - simplex[0]!.fx);

  for (let iter = 1; iter <= maxIter; iter++) {
    iterations = iter;
    if (size() < tol) {
      converged = true;
      break;
    }
    hooks.onIter?.(
      iter,
      { ...simplex[0]!, x: [...simplex[0]!.x] },
      simplex.map((p) => ({ ...p, x: [...p.x] })),
    );

    const best = simplex[0]!;
    const worst = simplex[n]!;
    const c = centroidExcludingWorst();

    // 反射
    const xr = c.map((cj, j) => cj + alpha * (cj - worst.x[j]!));
    const fr = f(xr);
    if (fr >= best.fx && fr < simplex[n - 1]!.fx) {
      simplex[n]! = { x: xr, fx: fr };
      sortByFx();
      continue;
    }
    if (fr < best.fx) {
      // 扩张
      const xe = c.map((cj, j) => cj + gamma * (xr[j]! - cj));
      const fe = f(xe);
      simplex[n]! = fe < fr ? { x: xe, fx: fe } : { x: xr, fx: fr };
      sortByFx();
      continue;
    }
    // 收缩
    const better = fr < worst.fx ? xr : worst.x;
    const xc = c.map((cj, j) => cj + rho * (better[j]! - cj));
    const fc = f(xc);
    if (fc < Math.min(fr, worst.fx)) {
      simplex[n]! = { x: xc, fx: fc };
      sortByFx();
      continue;
    }
    // 缩边
    for (let i = 1; i <= n; i++) {
      const xs = best.x.map((bj, j) => bj + sigma * (simplex[i]!.x[j]! - bj));
      simplex[i]! = { x: xs, fx: f(xs) };
    }
    sortByFx();
  }

  const best = simplex[0]!;
  return { params: [...best.x], value: best.fx, iterations, converged };
}

/** 演示：Rosenbrock 函数 f(x,y) = (1−x)² + 100(y−x²)²，最优 (1,1)。 */
export function rosenbrock(p: number[]): number {
  const x = p[0]!;
  const y = p[1]!;
  return (1 - x) ** 2 + 100 * (y - x * x) ** 2;
}

/** 演示：球面 f(x,y) = (x−3)² + (y+1)²，最优 (3,−1)。 */
export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}
