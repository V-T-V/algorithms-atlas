// =============================================================================
// 批量梯度下降 · 纯算法实现
// 演示：对一组样本 (x_i, y_i) 拟合 y = w·x + b，最小化 MSE。
// =============================================================================

export interface Sample {
  x: number;
  y: number;
}

export interface BatchGDHooks {
  onEpoch?: (epoch: number, params: number[], grad: number[], loss: number) => void;
  onDone?: (params: number[], iterations: number, converged: boolean) => void;
}

export interface GDResult {
  params: number[];
  iterations: number;
  converged: boolean;
  loss: number;
}

/** MSE 损失：对参数 [w, b] 与样本。 */
export function mseLoss(params: number[], samples: readonly Sample[]): number {
  const w = params[0]!;
  const b = params[1]!;
  let s = 0;
  for (const smp of samples) {
    const e = w * smp.x + b - smp.y;
    s += e * e;
  }
  return s / Math.max(1, samples.length);
}

/** MSE 全样本梯度 [∂L/∂w, ∂L/∂b]。 */
export function mseGrad(params: number[], samples: readonly Sample[]): number[] {
  const w = params[0]!;
  const b = params[1]!;
  let gw = 0;
  let gb = 0;
  for (const smp of samples) {
    const e = w * smp.x + b - smp.y;
    gw += 2 * e * smp.x;
    gb += 2 * e;
  }
  const n = Math.max(1, samples.length);
  return [gw / n, gb / n];
}

/**
 * 批量梯度下降。
 */
export function batchGradientDescent(
  samples: readonly Sample[],
  initParams: number[],
  lr: number,
  maxIter: number,
  tol: number,
  hooks: BatchGDHooks = {},
): GDResult {
  const params = [...initParams];
  let iterations = 0;
  let converged = false;
  for (let epoch = 1; epoch <= maxIter; epoch++) {
    const g = mseGrad(params, samples);
    const loss = mseLoss(params, samples);
    hooks.onEpoch?.(epoch, [...params], [...g], loss);
    iterations = epoch;
    const norm = Math.hypot(g[0]!, g[1]!);
    if (norm < tol) {
      converged = true;
      break;
    }
    params[0]! -= lr * g[0]!;
    params[1]! -= lr * g[1]!;
  }
  const result: GDResult = {
    params,
    iterations,
    converged,
    loss: mseLoss(params, samples),
  };
  hooks.onDone?.(result.params, result.iterations, result.converged);
  return result;
}
