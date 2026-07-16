// =============================================================================
// 单纯形法 Nelder-Mead · 纯算法实现（零 DOM 依赖，可独立单测）
// 无导数优化：维护 n+1 个顶点的单纯形，通过反射/扩张/收缩/缩边逐步逼近极小。
// 演示问题：最小化 f(x,y) = (x-3)² + (y+1)²，最优解 (3,-1)。
// =============================================================================

/** 一个单纯形顶点：参数向量 + 目标值。 */
export interface NMPoint {
  x: number[];
  fx: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface NelderMeadHooks {
  /** 每轮迭代：迭代号、当前最优顶点、整个单纯形（按目标值升序）。 */
  onIter?: (iter: number, best: NMPoint, simplex: NMPoint[]) => void;
}

/** Nelder-Mead 返回结果。 */
export interface NelderMeadResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

/**
 * Nelder-Mead 单纯形法（无导数优化）。
 *
 * 在 n 维空间维护一个有 n+1 个顶点的单纯形，每轮按目标值排序后做形变：
 *
 * 1. **反射** `x_r = x_c + α(x_c − x_w)`（`x_c` 为去掉最坏点后的质心，`α=1`）
 *    - 若 `f_r` 介于次坏与最好之间 → 用 `x_r` 替换最坏点，进入下一轮
 *    - 若 `f_r` 比最好还小 → **扩张** `x_e = x_c + γ(x_r − x_c)`（`γ=2`），取更优者替换
 *    - 若 `f_r` 比次坏还大 → **收缩**（向内 `x_c − ρ(x_w − x_c)` 或向外，`ρ=0.5`）
 * 2. 收缩后若仍无改善 → **缩边**：所有点向最好点收缩一半
 * 3. 当单纯形「尺寸」（最好与最坏目标值之差，或边长）足够小则收敛
 *
 * 直观理解：单纯形象一个变形虫——朝好方向拉伸、遇坏方向收缩，逐步「爬」向极小。
 *
 * **优点**：完全不需导数，对不可导/噪声/黑盒目标函数有效；实现简单。
 * **缺点**：在高维（n≳10）上收敛慢且不可靠，不保证全局最优。
 *
 * 演示：`nelderMead(demoFunc, [0,0])` 收敛到 (3,-1)。
 *
 * 时间复杂度 `O(k·n²)`（每轮排序 + 质心），空间 `O(n²)`。
 *
 * @param f 目标函数
 * @param init 初始顶点（参数）
 * @param options maxIter、tol（单纯形尺寸阈值）、initStep（初始边长）
 * @param hooks 可选的事件钩子
 */
export function nelderMead(
  f: (x: number[]) => number,
  init: number[],
  options: { maxIter?: number; tol?: number; initStep?: number } = {},
  hooks: NelderMeadHooks = {},
): NelderMeadResult {
  const { maxIter = 500, tol = 1e-10, initStep = 1 } = options;
  const n = init.length;
  // 经典形变系数
  const alpha = 1; // 反射
  const gamma = 2; // 扩张
  const rho = 0.5; // 收缩
  const sigma = 0.5; // 缩边

  // 构造初始单纯形：init + 沿每个坐标 +initStep
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
    for (let i = 0; i < n; i++) {
      // simplex[n] 是最坏，排除
      for (let j = 0; j < n; j++) c[j]! += simplex[i]!.x[j]!;
    }
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
    // 收缩（向内 / 向外）
    const better = fr < worst.fx ? xr : worst.x;
    const xc = c.map((cj, j) => cj + rho * (better[j]! - cj));
    const fc = f(xc);
    if (fc < Math.min(fr, worst.fx)) {
      simplex[n]! = { x: xc, fx: fc };
      sortByFx();
      continue;
    }
    // 缩边：所有点向 best 收缩
    for (let i = 1; i <= n; i++) {
      const xs = best.x.map((bj, j) => bj + sigma * (simplex[i]!.x[j]! - bj));
      simplex[i]! = { x: xs, fx: f(xs) };
    }
    sortByFx();
  }

  const best = simplex[0]!;
  return { params: [...best.x], value: best.fx, iterations, converged };
}

/** 演示目标函数：f(x,y) = (x-3)² + (y+1)²。 */
export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}
