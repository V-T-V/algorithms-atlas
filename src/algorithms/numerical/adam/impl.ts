// =============================================================================
// 亚当斯法（Adams Method: Adams–Bashforth–Moulton 预测-校正）· 纯算法实现
// 多步法求解 ODE y' = f(t, y)。用显式 Adams–Bashforth 做「预测」，
// 隐式 Adams–Moulton 做「校正」，二者组成预测-校正格式。
// =============================================================================

/** 一步的信息。 */
export interface AdamsStep {
  /** 步号（从 0 起，对应初始值）。 */
  i: number;
  t: number;
  y: number;
  /** 预测值（AB2）。 */
  predicted: number;
  /** 校正值（梯形，AM）。 */
  corrected: number;
  /** 斜率 f(t, y)。 */
  slope: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AdamsHooks {
  onStep?: (step: AdamsStep) => void;
}

/** 亚当斯法返回结果。 */
export interface AdamsResult {
  ts: number[];
  ys: number[];
  steps: AdamsStep[];
}

/**
 * 二阶亚当斯预测-校正法（AB2 预测 + 梯形校正）。
 *
 * - **预测**（显式 Adams–Bashforth 2 步）：
 *   `y_{n+1}^P = y_n + h/2 · (3·f_n − f_{n-1})`
 * - **校正**（隐式 Adams–Moulton，即梯形法）：
 *   `y_{n+1} = y_n + h/2 · (f_n + f(t_{n+1}, y_{n+1}^P))`
 *
 * 直观理解：先用已知斜率「外推」出一个预测点（AB 步），再用预测点处的斜率
 * 与当前斜率取平均做一次「校正」（梯形），相当于把显式 Euler 与隐式梯形结合，
 * 精度提升到**二阶**（全局误差 O(h²)），且每步仅需两次函数求值。
 *
 * 启动：第一步 (n=0) 缺少 f_{n−1}，用单步**梯形法**（Heun 法）自启动。
 *
 * - 演示 `y' = y, y(0) = 1`（真解 eᵗ）。
 *
 * 时间复杂度 `O(n)`（n 步），空间 `O(n)`。
 *
 * @param f 右端函数
 * @param t0 起始 t
 * @param y0 初值 y(t0)
 * @param h 步长
 * @param n 总步数
 * @param hooks 可选的事件钩子
 */
export function adam(
  f: (t: number, y: number) => number,
  t0: number,
  y0: number,
  h: number,
  n: number,
  hooks: AdamsHooks = {},
): AdamsResult {
  const ts: number[] = [t0];
  const ys: number[] = [y0];
  const steps: AdamsStep[] = [];

  let t = t0;
  let y = y0;
  let fPrev = f(t, y); // f_{n-1}

  for (let i = 0; i < n; i++) {
    const fn = f(t, y);
    // 预测：第一步用梯形（Heun）自启动；之后用 AB2
    const predicted = i === 0 ? y + h * fn : y + (h / 2) * (3 * fn - fPrev);
    const tNext = t + h;
    const fPred = f(tNext, predicted);
    // 校正：梯形法（Adams–Moulton）
    const corrected = y + (h / 2) * (fn + fPred);

    const step: AdamsStep = { i, t, y, predicted, corrected, slope: fn };
    steps.push(step);
    hooks.onStep?.(step);

    fPrev = fn;
    y = corrected;
    t = tNext;
    ts.push(t);
    ys.push(y);
  }
  return { ts, ys, steps };
}
