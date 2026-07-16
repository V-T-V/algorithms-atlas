// =============================================================================
// 欧拉法（Euler Method / Forward Euler）· 纯算法实现（零 DOM 依赖，可独立单测）
// 用最简单的一阶显式格式数值求解常微分方程初值问题 y' = f(t, y), y(t0)=y0。
// =============================================================================

/** 一欧拉步的信息。 */
export interface EulerStep {
  /** 步号（从 0 起，对应初始值）。 */
  i: number;
  /** 当前自变量 t。 */
  t: number;
  /** 当前因变量 y。 */
  y: number;
  /** 斜率 f(t, y)。 */
  slope: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface EulerHooks {
  /** 每完成一步推进后触发（含初始值第 0 步）。 */
  onStep?: (step: EulerStep) => void;
}

/** 欧拉法返回结果。 */
export interface EulerResult {
  /** 各节点 t 值。 */
  ts: number[];
  /** 各节点 y 值。 */
  ys: number[];
  /** 步信息。 */
  steps: EulerStep[];
}

/**
 * 显式欧拉法求解 `y' = f(t, y), y(t0) = y0`。
 *
 * 迭代格式：`y_{n+1} = y_n + h · f(t_n, y_n)`，`t_{n+1} = t_n + h`。
 *
 * 直观理解：每一步沿当前点的切线方向走一段长度 h。
 * 最朴素的 ODE 数值方法，**一阶精度**（全局误差 O(h)）。
 *
 * - 稳定性差（对刚性方程易发散），但实现极简、教学价值高。
 * - 更高精度见 runge-kutta（四阶龙格库塔）。
 *
 * 时间复杂度 `O(n)`（n 步），空间 `O(n)`（保存轨迹）。
 *
 * @param f 右端函数
 * @param t0 起始 t
 * @param y0 初值 y(t0)
 * @param h 步长
 * @param n 总步数
 * @param hooks 可选的事件钩子
 */
export function euler(
  f: (t: number, y: number) => number,
  t0: number,
  y0: number,
  h: number,
  n: number,
  hooks: EulerHooks = {},
): EulerResult {
  const ts: number[] = [t0];
  const ys: number[] = [y0];
  const steps: EulerStep[] = [];
  let t = t0;
  let y = y0;
  for (let i = 0; i < n; i++) {
    const slope = f(t, y);
    const step: EulerStep = { i, t, y, slope };
    steps.push(step);
    hooks.onStep?.(step);
    y = y + h * slope;
    t = t + h;
    ts.push(t);
    ys.push(y);
  }
  return { ts, ys, steps };
}
