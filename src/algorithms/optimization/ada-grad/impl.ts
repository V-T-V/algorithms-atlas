// =============================================================================
// AdaGrad（Adaptive Gradient）· 纯算法实现（零 DOM 依赖，可独立单测）
// 为每个参数累积历史梯度平方和，自适应地缩放学习率：稀疏特征得更大步长。
// 演示问题：最小化 f(x,y) = (x-3)² + (y+1)²，最优解 (3,-1)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AdaGradHooks {
  /** 每轮迭代：迭代号、当前参数、梯度、累积梯度平方 G、目标值。 */
  onIter?: (iter: number, params: number[], grad: number[], accSq: number[], value: number) => void;
}

/** AdaGrad 返回结果。 */
export interface AdaGradResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

/**
 * AdaGrad 自适应梯度下降。
 *
 * 为每个参数 i 维护累积平方梯度 `G_i`，更新规则：
 *
 * `G_i ← G_i + grad_i²`
 * `params_i ← params_i − lr / √(G_i + ε) · grad_i`
 *
 * 直观理解：经常大幅更新的参数，其 `G_i` 较大，有效学习率随之减小；
 * 很少更新的参数（稀疏特征）则保留较大有效学习率。
 *
 * - 适合稀疏数据（NLP/CTR），对每个特征「按需」分配步长
 * - 缺点：`G_i` 单调递增，后期学习率会过度衰减，几乎停止学习
 *   （RMSProp/Adam 通过指数移动平均解决此问题）
 *
 * 演示：`adaGrad(demoFunc, demoGrad, [0,0])` 收敛到 (3,-1) 附近。
 *
 * 时间复杂度 `O(k·n)`（k 轮迭代、n 维参数），空间 `O(n)`。
 *
 * @param f 目标函数
 * @param grad 梯度函数
 * @param initParams 初始参数
 * @param options lr 学习率（默认 1.0，AdaGrad 常用较大值）、eps、maxIter、tol
 * @param hooks 可选的事件钩子
 */
export function adaGrad(
  f: (params: number[]) => number,
  grad: (params: number[]) => number[],
  initParams: number[],
  options: { lr?: number; eps?: number; maxIter?: number; tol?: number } = {},
  hooks: AdaGradHooks = {},
): AdaGradResult {
  const { lr = 1.0, eps = 1e-8, maxIter = 500, tol = 1e-8 } = options;
  const params = [...initParams];
  const accSq = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;

  for (let iter = 1; iter <= maxIter; iter++) {
    const g = grad(params);
    const value = f(params);
    let gradNorm = 0;
    for (let i = 0; i < params.length; i++) {
      gradNorm += g[i]! * g[i]!;
      accSq[i]! += g[i]! * g[i]!;
    }
    gradNorm = Math.sqrt(gradNorm);
    hooks.onIter?.(iter, [...params], [...g], [...accSq], value);
    iterations = iter;
    if (gradNorm < tol) {
      converged = true;
      break;
    }
    for (let i = 0; i < params.length; i++) {
      params[i]! -= (lr / Math.sqrt(accSq[i]! + eps)) * g[i]!;
    }
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
