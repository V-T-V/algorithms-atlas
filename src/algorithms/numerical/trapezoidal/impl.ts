// =============================================================================
// 复合梯形积分 Composite Trapezoidal Rule · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 单个梯形条带（子区间 [x_i, x_{i+1}]）的信息。 */
export interface TrapezoidStrip {
  /** 子区间下标 i。 */
  i: number;
  /** 左端点 x_i。 */
  x0: number;
  /** 右端点 x_{i+1}。 */
  x1: number;
  /** 步长 h。 */
  h: number;
  /** 左端点函数值 f(x_i)。 */
  f0: number;
  /** 右端点函数值 f(x_{i+1})。 */
  f1: number;
  /** 该梯形面积：(h/2)·(f0 + f1)。 */
  area: number;
  /** 累计积分值（截至本条带）。 */
  cumulative: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface TrapezoidalHooks {
  /** 处理完一个梯形条带。 */
  onStrip?: (strip: TrapezoidStrip) => void;
}

/** 梯形积分返回结果。 */
export interface TrapezoidalResult {
  /** 积分近似值。 */
  integral: number;
  /** 子区间数 n。 */
  n: number;
  /** 步长 h = (b - a) / n。 */
  h: number;
  /** 各采样点 x 坐标（n+1 个）。 */
  xs: number[];
  /** 各采样点函数值（n+1 个）。 */
  fs: number[];
}

/**
 * 复合梯形积分：把积分区间 `[a, b]` 分成 `n` 个等长子区间，
 * 每个子区间上用直线段连接两端函数值，计算梯形面积后求和。
 *
 *   `I ≈ (h/2)·(f_0 + 2·(f_1 + f_2 + ... + f_{n-1}) + f_n)`
 *
 * 等价于「各梯形面积之和」。代数精度为 1（对线性函数精确），
 * 整体截断误差为 `O(h²)`。比辛普森法简单但精度低一阶。
 *
 * @param f 被积函数
 * @param a 左端点
 * @param b 右端点
 * @param n 子区间数（要求 n ≥ 1）
 * @param hooks 可选的事件钩子
 */
export function trapezoidal(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number,
  hooks: TrapezoidalHooks = {},
): TrapezoidalResult {
  if (n < 1) n = 1;
  const h = (b - a) / n;
  const xs: number[] = new Array(n + 1);
  const fs: number[] = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    xs[i] = x;
    fs[i] = f(x);
  }

  // 总积分公式
  let total = fs[0]! + fs[n]!;
  for (let i = 1; i < n; i++) total += 2 * fs[i]!;
  const integral = (h / 2) * total;

  // 逐条带报告累计值
  let cumulative = 0;
  for (let i = 0; i < n; i++) {
    const x0 = xs[i]!;
    const x1 = xs[i + 1]!;
    const f0 = fs[i]!;
    const f1 = fs[i + 1]!;
    const area = (h / 2) * (f0 + f1);
    cumulative += area;
    hooks.onStrip?.({ i, x0, x1, h, f0, f1, area, cumulative });
  }

  return { integral, n, h, xs, fs };
}
