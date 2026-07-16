// =============================================================================
// 批量梯度下降（动量 + 梯度裁剪）· 纯算法实现
// 演示：拟合 y = w·x + b，最小化 MSE。
// =============================================================================

export interface Sample {
  x: number;
  y: number;
}

export interface BatchGD2Result {
  params: number[];
  iterations: number;
  converged: boolean;
  loss: number;
}

export interface BatchGD2Hooks {
  onEpoch?: (
    epoch: number,
    params: number[],
    grad: number[],
    velocity: number[],
    loss: number,
    clipped: boolean,
  ) => void;
  onDone?: (r: BatchGD2Result) => void;
}

/** MSE 损失。 */
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

/** 按最大范数裁剪梯度（原地修改返回新数组）。 */
export function clipByNorm(grad: number[], maxNorm: number): { grad: number[]; clipped: boolean } {
  const norm = Math.hypot(...grad);
  if (norm > maxNorm && norm > 0) {
    const scale = maxNorm / norm;
    return { grad: grad.map((g) => g * scale), clipped: true };
  }
  return { grad: [...grad], clipped: false };
}

/**
 * 动量 + 裁剪 批量梯度下降。
 *
 * @param samples 样本
 * @param initParams 初始 [w, b]
 * @param lr 学习率
 * @param momentum 动量系数（0=无动量）
 * @param maxGradNorm 梯度范数上界
 * @param maxIter 最大轮数
 * @param tol 收敛阈值（梯度范数）
 * @param hooks 可选钩子
 */
export function batchGradientDescent2(
  samples: readonly Sample[],
  initParams: number[],
  lr: number,
  momentum: number,
  maxGradNorm: number,
  maxIter: number,
  tol: number,
  hooks: BatchGD2Hooks = {},
): BatchGD2Result {
  const params = [...initParams];
  const velocity = [0, 0];
  let iterations = 0;
  let converged = false;
  for (let epoch = 1; epoch <= maxIter; epoch++) {
    let g = mseGrad(params, samples);
    const { grad: clippedGrad, clipped } = clipByNorm(g, maxGradNorm);
    g = clippedGrad;
    const loss = mseLoss(params, samples);
    // 动量更新：v = momentum*v + g；params -= lr * v
    velocity[0] = momentum * velocity[0]! + g[0]!;
    velocity[1] = momentum * velocity[1]! + g[1]!;
    hooks.onEpoch?.(epoch, [...params], [...g], [...velocity], loss, clipped);
    iterations = epoch;
    const norm = Math.hypot(g[0]!, g[1]!);
    if (norm < tol) {
      converged = true;
      break;
    }
    params[0]! -= lr * velocity[0]!;
    params[1]! -= lr * velocity[1]!;
  }
  const result: BatchGD2Result = {
    params,
    iterations,
    converged,
    loss: mseLoss(params, samples),
  };
  hooks.onDone?.(result);
  return result;
}
