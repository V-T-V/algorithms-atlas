// =============================================================================
// 牛顿法优化（Newton's Method for Optimization）· 纯算法实现（零 DOM 依赖，可独立单测）
// 用二阶 Taylor 近似：沿海森逆 × 负梯度方向（牛顿方向）更新，凸问题二阶收敛。
// 演示问题：最小化 f(x,y) = (x-3)² + (y+1)²，最优解 (3,-1)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface NewtonOptHooks {
  /** 每轮迭代：迭代号、参数、梯度、牛顿步、目标值。 */
  onIter?: (
    iter: number,
    params: number[],
    grad: number[],
    newtonStep: number[],
    value: number,
  ) => void;
}

/** 牛顿法优化返回结果。 */
export interface NewtonOptResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

/**
 * 牛顿法求 `min f(x)`（使用梯度 + 海森矩阵）。
 *
 * 在当前点做二阶 Taylor 近似 `f(x+p) ≈ f + gᵀp + ½ pᵀ H p`，求其极小得**牛顿步**：
 *
 * `H · p = −g`，即 `p = −H⁻¹·g`
 *
 * 更新：`x ← x + p`。
 *
 * 直观理解：最速下降只看「坡度」（梯度），牛顿法还看「曲率」（海森）——
 * 在凸、曲率良态时一步直达最优，二阶收敛（每步有效位数翻倍）。
 *
 * **代价与风险**：
 * - 每步需解 `n×n` 线性方程组（求逆 `O(n³)`），大规模问题昂贵
 * - 海森非正定时牛顿方向可能非下降方向，需修正（如 Levenberg-Marquardt 加 `λI`）
 * - 对初值敏感，非凸函数上可能收敛到鞍点
 *
 * 本实现解小规模线性系统（高斯消元带部分主元）。演示 `f=(x-3)²+(y+1)²` 在 1 步内精确收敛（海森为常数对角阵）。
 *
 * 时间复杂度 `O(k·n³)`，空间 `O(n²)`。
 *
 * @param f 目标函数
 * @param grad 梯度函数
 * @param hess 海森矩阵函数（n×n）
 * @param initParams 初始参数
 * @param options maxIter、tol
 * @param hooks 可选的事件钩子
 */
export function newtonOpt(
  f: (params: number[]) => number,
  grad: (params: number[]) => number[],
  hess: (params: number[]) => number[][],
  initParams: number[],
  options: { maxIter?: number; tol?: number } = {},
  hooks: NewtonOptHooks = {},
): NewtonOptResult {
  const { maxIter = 100, tol = 1e-10 } = options;
  const params = [...initParams];
  let iterations = 0;
  let converged = false;

  for (let iter = 1; iter <= maxIter; iter++) {
    const g = grad(params);
    const value = f(params);
    const gradNorm = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    const H = hess(params);
    const rhs = g.map((x) => -x);
    const step = solveLinear(H, rhs); // 解 H·step = -g
    hooks.onIter?.(iter, [...params], [...g], [...step], value);
    iterations = iter;
    if (gradNorm < tol) {
      converged = true;
      break;
    }
    for (let i = 0; i < params.length; i++) params[i]! += step[i]!;
  }

  return { params, value: f(params), iterations, converged };
}

/** 用带部分主元的高斯消元解 `A·x = b`（小规模）。 */
function solveLinear(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]!]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r]![col]!) > Math.abs(M[piv]![col]!)) piv = r;
    }
    if (piv !== col) {
      const tmp = M[col]!;
      M[col] = M[piv]!;
      M[piv] = tmp;
    }
    const pv = M[col]![col]!;
    if (Math.abs(pv) < 1e-14) continue;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = M[r]![col]! / pv;
      for (let c = col; c <= n; c++) M[r]![c]! -= factor * M[col]![c]!;
    }
  }
  const x = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    const d = M[i]![i]!;
    x[i] = M[i]![n]! / (Math.abs(d) < 1e-14 ? 1 : d);
  }
  return x;
}

/** 演示目标函数：f(x,y) = (x-3)² + (y+1)²。 */
export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}

/** 演示梯度：∇f = [2(x-3), 2(y+1)]。 */
export function demoGrad(p: number[]): number[] {
  return [2 * (p[0]! - 3), 2 * (p[1]! + 1)];
}

/** 演示海森矩阵：常数对角阵 diag(2, 2)。 */
export function demoHess(_p: number[]): number[][] {
  return [
    [2, 0],
    [0, 2],
  ];
}
