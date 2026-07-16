// =============================================================================
// Nesterov 加速梯度 · 纯算法实现
// 演示：最小化 f(x,y) = (x-3)² + (y+1)²，最优 (3,-1)。
// =============================================================================

export interface NesterovHooks {
  onIter?: (
    iter: number,
    params: number[],
    velocity: number[],
    lookAhead: number[],
    value: number,
  ) => void;
  onDone?: (params: number[], iterations: number, converged: boolean) => void;
}

export interface NesterovResult {
  params: number[];
  iterations: number;
  converged: boolean;
  value: number;
}

/** 演示目标函数。 */
export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}

/** 演示梯度。 */
export function demoGrad(p: number[]): number[] {
  return [2 * (p[0]! - 3), 2 * (p[1]! + 1)];
}

/**
 * Nesterov 加速梯度。
 */
export function nesterovAcceleratedGradient(
  initParams: number[],
  lr: number,
  momentum: number,
  maxIter: number,
  tol: number,
  hooks: NesterovHooks = {},
): NesterovResult {
  const params = [...initParams];
  const velocity = initParams.map(() => 0);
  let iterations = 0;
  let converged = false;
  for (let iter = 1; iter <= maxIter; iter++) {
    // 前瞻位置 = params + momentum * velocity
    const lookAhead = params.map((p, i) => p + momentum * velocity[i]!);
    const g = demoGrad(lookAhead);
    const value = demoFunc(lookAhead);
    hooks.onIter?.(iter, [...params], [...velocity], [...lookAhead], value);
    iterations = iter;
    const norm = Math.hypot(g[0]!, g[1]!);
    if (norm < tol) {
      converged = true;
      break;
    }
    for (let i = 0; i < params.length; i++) {
      velocity[i]! = momentum * velocity[i]! - lr * g[i]!;
      params[i]! += velocity[i]!;
    }
  }
  const result: NesterovResult = {
    params,
    iterations,
    converged,
    value: demoFunc(params),
  };
  hooks.onDone?.(result.params, result.iterations, result.converged);
  return result;
}
