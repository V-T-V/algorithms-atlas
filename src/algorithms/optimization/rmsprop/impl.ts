// =============================================================================
// RMSProp（Root Mean Square Propagation）· 纯算法实现（零 DOM 依赖，可独立单测）
// 用梯度的指数移动平均（而非累积和）缩放学习率，解决 AdaGrad 后期学习率过度衰减问题。
// 演示问题：最小化 f(x,y) = (x-3)² + (y+1)²，最优解 (3,-1)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RMSPropHooks {
  /** 每轮迭代：迭代号、参数、梯度、移动均方 E[g²]、目标值。 */
  onIter?: (
    iter: number,
    params: number[],
    grad: number[],
    meanSq: number[],
    value: number,
  ) => void;
}

/** RMSProp 返回结果。 */
export interface RMSPropResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

/**
 * RMSProp 自适应梯度下降。
 *
 * 维护梯度平方的**指数移动平均** `E[g²]`（Hinton 未发表，深度学习标配）：
 *
 * `E[g²] ← ρ·E[g²] + (1−ρ)·g²`
 * `params ← params − lr / √(E[g²] + ε) · g`
 *
 * 直观理解：与 AdaGrad 累加全部历史不同，RMSProp 用衰减平均只关心**近期**梯度规模。
 * - 近期梯度大 → 有效学习率小（减速，防止震荡）
 * - 近期梯度小 → 有效学习率大（加速，逃出平原）
 *
 * 由于是滑动平均而非单调累加，学习率不会无限衰减，可在非平稳目标上长期训练。
 * 常用 `lr=0.001`、`ρ=0.9`。是 Adam 的直接前身（Adam = RMSProp + 动量）。
 *
 * 演示：`rmsprop(demoFunc, demoGrad, [0,0])` 收敛到 (3,-1)。
 *
 * 时间复杂度 `O(k·n)`，空间 `O(n)`。
 *
 * @param f 目标函数
 * @param grad 梯度函数
 * @param initParams 初始参数
 * @param options lr、rho（衰减率）、eps、maxIter、tol
 * @param hooks 可选的事件钩子
 */
export function rmsprop(
  f: (params: number[]) => number,
  grad: (params: number[]) => number[],
  initParams: number[],
  options: { lr?: number; rho?: number; eps?: number; maxIter?: number; tol?: number } = {},
  hooks: RMSPropHooks = {},
): RMSPropResult {
  const { lr = 0.05, rho = 0.9, eps = 1e-8, maxIter = 1000, tol = 1e-10 } = options;
  const params = [...initParams];
  const meanSq = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;

  for (let iter = 1; iter <= maxIter; iter++) {
    const g = grad(params);
    const value = f(params);
    const gradNorm = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    for (let i = 0; i < params.length; i++)
      meanSq[i] = rho * meanSq[i]! + (1 - rho) * g[i]! * g[i]!;
    hooks.onIter?.(iter, [...params], [...g], [...meanSq], value);
    iterations = iter;
    if (gradNorm < tol) {
      converged = true;
      break;
    }
    for (let i = 0; i < params.length; i++)
      params[i]! -= (lr / Math.sqrt(meanSq[i]! + eps)) * g[i]!;
  }

  return { params, value: f(params), iterations, converged };
}

/** 演示目标函数：f(x,y) = (x-3)² + (y+1)²。 */
export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}

/** 演示梯度：∇f = [2(x-3), 2(y+1)]。 */
export function demoGrad(p: number[]): number[] {
  return [2 * (p[0]! - 3), 2 * (p[1]! + 1)];
}
