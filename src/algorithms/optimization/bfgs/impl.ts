// =============================================================================
// BFGS 拟牛顿法（Broyden–Fletcher–Goldfarb–Shanno）· 纯算法实现（零 DOM 依赖，可独立单测）
// 不显式求海森矩阵，而是用一阶梯度信息迭代更新海森逆的近似 B（秩二更新），超线性收敛。
// 演示问题：最小化 f(x,y) = (x-3)² + (y+1)²，最优解 (3,-1)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BFGSHooks {
  /** 每轮迭代：迭代号、参数、梯度、目标值。 */
  onIter?: (iter: number, params: number[], grad: number[], value: number) => void;
}

/** BFGS 返回结果。 */
export interface BFGSResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

/**
 * BFGS 拟牛顿法。
 *
 * 维护海森**逆**的近似 `H ≈ (∇²f)⁻¹`（初始为单位阵 `I`）。每步：
 *
 * 1. 搜索方向 `p = −H·g`
 * 2. 沿 `p` 线搜索得步长 `α`，更新 `x_new = x + α·p`
 * 3. 令 `s = x_new − x`、`y = g_new − g`，用 BFGS 秩二公式更新 `H`：
 *
 * `ρ = 1 / (yᵀs)`，`H ← (I − ρ·s·yᵀ)·H·(I − ρ·y·sᵀ) + ρ·s·sᵀ`
 *
 * 直观理解：用一对 `(s, y)` 估计曲率，相当于「用最近的梯度变化去模拟海森逆」，
 * 既获得接近牛顿的超线性收敛，又只花 `O(n²)` 存储、`O(n²)` 每步（无需真实海森 `O(n³)`）。
 *
 * **优点**：超线性收敛、对线搜索精度要求比 DFP 低、是有限内存 L-BFGS 的基础（大规模场景）。
 * **要求**：线搜索需满足 Wolfe 条件，否则 `yᵀs` 可能为负导致 `H` 不正定。
 *
 * 演示：`bfgs(demoFunc, demoGrad, [0,0])` 几步收敛到 (3,-1)。
 *
 * 时间复杂度 `O(k·n²)`，空间 `O(n²)`。
 *
 * @param f 目标函数
 * @param grad 梯度函数
 * @param initParams 初始参数
 * @param options maxIter、tol（梯度范数阈值）
 * @param hooks 可选的事件钩子
 */
export function bfgs(
  f: (params: number[]) => number,
  grad: (params: number[]) => number[],
  initParams: number[],
  options: { maxIter?: number; tol?: number } = {},
  hooks: BFGSHooks = {},
): BFGSResult {
  const { maxIter = 200, tol = 1e-10 } = options;
  const n = initParams.length;
  const params = [...initParams];
  const H = identity(n);
  let g = grad(params);
  let iterations = 0;
  let converged = false;

  if (Math.sqrt(dot(g, g)) < tol) {
    return { params, value: f(params), iterations: 0, converged: true };
  }

  for (let iter = 1; iter <= maxIter; iter++) {
    iterations = iter;
    const value = f(params);
    hooks.onIter?.(iter, [...params], [...g], value);

    // 搜索方向 p = -H·g（H 近似海森逆）
    const p = matVec(H, g).map((x) => -x);
    const alpha = backtrackingLineSearch(f, params, p, g);
    const paramsNew = params.map((x, i) => x + alpha * p[i]!);
    const gNew = grad(paramsNew);
    const s = paramsNew.map((x, i) => x - params[i]!);
    const y = gNew.map((x, i) => x - g[i]!);

    const ys = dot(y, s);
    if (Math.sqrt(dot(gNew, gNew)) < tol) {
      for (let i = 0; i < n; i++) params[i] = paramsNew[i]!;
      converged = true;
      g = gNew;
      break;
    }

    // BFGS 更新（仅当曲率条件满足 ys > 0）
    if (Math.abs(ys) > 1e-16) {
      const rho = 1 / ys;
      // H <- (I - rho s yᵀ) H (I - rho y sᵀ) + rho s sᵀ
      const Hy = matVec(H, y);
      const sHy = dot(s, Hy); // sᵀ H y
      // 用展开后的对称秩二更新：H += rho*(1 + rho*sHy)*ss_outer - rho*(s Hyᵀ + Hy sᵀ)
      const coef = rho * (1 + rho * sHy);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          H[i]![j]! += coef * s[i]! * s[j]! - rho * (s[i]! * Hy[j]! + Hy[i]! * s[j]!);
        }
      }
    }

    for (let i = 0; i < n; i++) params[i] = paramsNew[i]!;
    g = gNew;
  }

  return { params, value: f(params), iterations, converged };
}

function identity(n: number): number[][] {
  const M = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) M[i]![i] = 1;
  return M;
}

function matVec(M: number[][], v: number[]): number[] {
  const n = v.length;
  const out = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += M[i]![j]! * v[j]!;
    out[i] = s;
  }
  return out;
}

function dot(a: readonly number[], b: readonly number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i]! * b[i]!;
  return s;
}

/** 回溯线搜索（Armijo 充分下降条件）。 */
function backtrackingLineSearch(
  f: (params: number[]) => number,
  params: number[],
  dir: number[],
  grad: number[],
): number {
  let alpha = 1.0;
  const c1 = 1e-4;
  const slope = dot(grad, dir);
  const f0 = f(params);
  const p = [...params];
  for (let k = 0; k < 50; k++) {
    for (let i = 0; i < p.length; i++) p[i] = params[i]! + alpha * dir[i]!;
    if (f(p) <= f0 + c1 * alpha * slope) break;
    alpha *= 0.5;
  }
  return alpha;
}

/** 演示目标函数：f(x,y) = (x-3)² + (y+1)²。 */
export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}

/** 演示梯度：∇f = [2(x-3), 2(y+1)]。 */
export function demoGrad(p: number[]): number[] {
  return [2 * (p[0]! - 3), 2 * (p[1]! + 1)];
}
