// =============================================================================
// 动量梯度下降（Momentum Gradient Descent）· 纯算法实现（零 DOM 依赖，可独立单测）
// 累积历史梯度方向形成「动量」，加速收敛并抑制震荡。
// 演示问题：最小化 f(x,y) = (x-3)² + (y+1)²，最优解 (3,-1)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MomentumHooks {
  /** 每轮迭代：迭代号、参数、梯度、当前速度、目标值。 */
  onIter?: (
    iter: number,
    params: number[],
    grad: number[],
    velocity: number[],
    value: number,
  ) => void;
}

/** 动量梯度下降返回结果。 */
export interface MomentumResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

/**
 * 重球法（Heavy-Ball / Polyak Momentum）梯度下降。
 *
 * 维护一个「速度」向量 `v`，它由上一步速度（乘衰减系数 `β`）与当前梯度合成：
 *
 * `v ← β·v + grad`
 * `params ← params − lr·v`
 *
 * 直观理解：像重球在山谷里滚下，惯性（`β·v`）让它穿过小沟壑、沿一致方向加速；
 * 当梯度方向稳定时，速度不断累加、步长放大；方向震荡时正负相消、抑制摆动。
 *
 * - `β=0` 即退化为普通梯度下降
 * - 典型 `β∈[0.8, 0.99]`，比纯 SGD 在病态曲率（狭长山谷）上快数倍
 * - 是 Nesterov 动量、Adam 等更复杂方法的基础
 *
 * 演示：`momentum(demoFunc, demoGrad, [0,0])` 收敛到 (3,-1)。
 *
 * 时间复杂度 `O(k·n)`，空间 `O(n)`。
 *
 * @param f 目标函数
 * @param grad 梯度函数
 * @param initParams 初始参数
 * @param options lr、beta（动量系数）、maxIter、tol
 * @param hooks 可选的事件钩子
 */
export function momentum(
  f: (params: number[]) => number,
  grad: (params: number[]) => number[],
  initParams: number[],
  options: { lr?: number; beta?: number; maxIter?: number; tol?: number } = {},
  hooks: MomentumHooks = {},
): MomentumResult {
  const { lr = 0.1, beta = 0.9, maxIter = 500, tol = 1e-8 } = options;
  const params = [...initParams];
  const velocity = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;

  for (let iter = 1; iter <= maxIter; iter++) {
    const g = grad(params);
    const value = f(params);
    const gradNorm = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    for (let i = 0; i < params.length; i++) velocity[i] = beta * velocity[i]! + g[i]!;
    hooks.onIter?.(iter, [...params], [...g], [...velocity], value);
    iterations = iter;
    if (gradNorm < tol) {
      converged = true;
      break;
    }
    for (let i = 0; i < params.length; i++) params[i]! -= lr * velocity[i]!;
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
