// =============================================================================
// AMSGrad 优化器 · 纯算法实现
// 演示：最小化 f(x,y) = (x-3)² + (y+1)²。
// =============================================================================

export interface AmsGradHooks {
  onIter?: (iter: number, params: number[], vHat: number[], value: number) => void;
  onDone?: (params: number[], iterations: number, converged: boolean) => void;
}

export interface AmsGradResult {
  params: number[];
  iterations: number;
  converged: boolean;
  value: number;
}

export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}

export function demoGrad(p: number[]): number[] {
  return [2 * (p[0]! - 3), 2 * (p[1]! + 1)];
}

/**
 * AMSGrad。
 */
export function amsGrad(
  initParams: number[],
  lr: number,
  beta1: number,
  beta2: number,
  eps: number,
  maxIter: number,
  tol: number,
  hooks: AmsGradHooks = {},
): AmsGradResult {
  const params = [...initParams];
  const m = initParams.map(() => 0); // 一阶矩
  const v = initParams.map(() => 0); // 二阶矩
  const vHat = initParams.map(() => 0); // v̂ 历史最大
  let iterations = 0;
  let converged = false;
  for (let t = 1; t <= maxIter; t++) {
    const g = demoGrad(params);
    const value = demoFunc(params);
    hooks.onIter?.(t, [...params], [...vHat], value);
    iterations = t;
    const norm = Math.hypot(g[0]!, g[1]!);
    if (norm < tol) {
      converged = true;
      break;
    }
    for (let i = 0; i < params.length; i++) {
      m[i]! = beta1 * m[i]! + (1 - beta1) * g[i]!;
      v[i]! = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
      vHat[i]! = Math.max(vHat[i]!, v[i]!);
      params[i]! -= (lr * m[i]!) / (Math.sqrt(vHat[i]!) + eps);
    }
  }
  const result: AmsGradResult = { params, iterations, converged, value: demoFunc(params) };
  hooks.onDone?.(result.params, result.iterations, result.converged);
  return result;
}
