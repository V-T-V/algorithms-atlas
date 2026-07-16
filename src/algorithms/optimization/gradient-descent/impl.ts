// =============================================================================
// 梯度下降 Gradient Descent · 纯算法实现
// 沿负梯度方向迭代更新参数，最小化目标函数。
// 演示问题：最小化 f(x,y) = (x-3)² + (y+1)²，最优解 (3,-1)。
// =============================================================================

export interface GradientDescentHooks {
  onIter?: (iter: number, params: number[], grad: number[], value: number) => void;
}

export interface GDResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

/**
 * 梯度下降。目标函数与梯度由调用方提供。
 * @param f 目标函数
 * @param grad 梯度函数
 * @param initParams 初始参数
 * @param lr 学习率
 * @param maxIter 最大迭代次数
 * @param tol 收敛阈值（梯度范数）
 */
export function gradientDescent(
  f: (params: number[]) => number,
  grad: (params: number[]) => number[],
  initParams: number[],
  lr: number,
  maxIter: number,
  tol: number,
  hooks: GradientDescentHooks = {},
): GDResult {
  const params = [...initParams];
  let iterations = 0;
  let converged = false;

  for (let iter = 1; iter <= maxIter; iter++) {
    const g = grad(params);
    const value = f(params);
    const gradNorm = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    hooks.onIter?.(iter, [...params], [...g], value);
    iterations = iter;
    if (gradNorm < tol) {
      converged = true;
      break;
    }
    for (let i = 0; i < params.length; i++) {
      params[i]! -= lr * g[i]!;
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
