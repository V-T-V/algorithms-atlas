// =============================================================================
// Adam 优化器（Adaptive Moment Estimation）· 纯算法实现（零 DOM 依赖，可独立单测）
// 结合动量（一阶矩）与 RMSProp（二阶矩），并做偏差校正。深度学习最常用优化器。
// 演示问题：最小化 f(x,y) = (x-3)² + (y+1)²，最优解 (3,-1)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AdamHooks {
  /** 每轮迭代：迭代号、参数、梯度、一阶矩 m、二阶矩 v、目标值。 */
  onIter?: (
    iter: number,
    params: number[],
    grad: number[],
    m: number[],
    v: number[],
    value: number,
  ) => void;
}

/** Adam 返回结果。 */
export interface AdamResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

/**
 * Adam 优化器。
 *
 * 同时维护梯度的**一阶矩** `m`（动量）与**二阶矩** `v`（梯度平方的指数平均）：
 *
 * `m ← β₁·m + (1−β₁)·g`（一阶矩，方向）
 * `v ← β₂·v + (1−β₂)·g²`（二阶矩，规模）
 *
 * 由于 `m`、`v` 初始化为 0，初期会偏向 0，做**偏差校正**：
 *
 * `m̂ = m / (1 − β₁ᵗ)`，`v̂ = v / (1 − β₂ᵗ)`
 *
 * 最终更新：`params ← params − lr · m̂ / (√v̂ + ε)`
 *
 * 直观理解：方向（动量 `m̂`）除以规模（`√v̂`）——即「往一致方向走、按近期噪声自适应缩放」。
 * 偏差校正让早期步长不被严重低估。`β₁=0.9, β₂=0.999, lr=0.001` 是著名默认值。
 *
 * 演示：`adamOpt(demoFunc, demoGrad, [0,0])` 收敛到 (3,-1)。
 *
 * 时间复杂度 `O(k·n)`，空间 `O(n)`。
 *
 * @param f 目标函数
 * @param grad 梯度函数
 * @param initParams 初始参数
 * @param options lr、beta1、beta2、eps、maxIter、tol
 * @param hooks 可选的事件钩子
 */
export function adamOpt(
  f: (params: number[]) => number,
  grad: (params: number[]) => number[],
  initParams: number[],
  options: {
    lr?: number;
    beta1?: number;
    beta2?: number;
    eps?: number;
    maxIter?: number;
    tol?: number;
  } = {},
  hooks: AdamHooks = {},
): AdamResult {
  const { lr = 0.1, beta1 = 0.9, beta2 = 0.999, eps = 1e-8, maxIter = 500, tol = 1e-8 } = options;
  const params = [...initParams];
  const m = new Array(params.length).fill(0);
  const v = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;

  for (let iter = 1; iter <= maxIter; iter++) {
    const g = grad(params);
    const value = f(params);
    const gradNorm = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    for (let i = 0; i < params.length; i++) {
      m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
      v[i] = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
    }
    hooks.onIter?.(iter, [...params], [...g], [...m], [...v], value);
    iterations = iter;
    if (gradNorm < tol) {
      converged = true;
      break;
    }
    const bc1 = 1 - beta1 ** iter; // 偏差校正分母
    const bc2 = 1 - beta2 ** iter;
    for (let i = 0; i < params.length; i++) {
      const mHat = m[i]! / bc1;
      const vHat = v[i]! / bc2;
      params[i]! -= (lr * mHat) / (Math.sqrt(vHat) + eps);
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
