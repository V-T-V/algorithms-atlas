// =============================================================================
// 麦克劳林级数（数值求导）· 纯算法实现
// 用有限差分递归求 f 在 0 处的各阶导数，再构造级数。
// =============================================================================

export interface MaclaurinHooks {
  /** 求出第 k 阶导数（在 0 处）。 */
  onDerivative?: (k: number, value: number) => void;
  /** 完成。 */
  onDone?: (result: number) => void;
}

/** 阶乘。 */
function factorial(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

/**
 * 数值求 f 在 x 处的第 order 阶导数（中心差分递归，步长 h）。
 * order=0 直接返回 f(x)；高阶递归地差分低一阶。
 */
function numericDerivative(f: (x: number) => number, x: number, order: number, h: number): number {
  if (order === 0) return f(x);
  return (
    (numericDerivative(f, x + h, order - 1, h) - numericDerivative(f, x - h, order - 1, h)) /
    (2 * h)
  );
}

/**
 * 求 f 的 n 阶麦克劳林级数在 x 处的值。
 * @param f 被展开函数
 * @param x 求值点
 * @param n 项数（0..n）
 * @param h 数值微分步长（默认 1e-2，高阶导数误差大不宜过小）
 */
export function maclaurinSeries(
  f: (x: number) => number,
  x: number,
  n: number,
  h = 1e-2,
  hooks: MaclaurinHooks = {},
): number {
  if (n < 0) throw new RangeError(`n 须 >= 0，收到 ${n}`);
  if (h <= 0) throw new RangeError(`h 须 > 0，收到 ${h}`);
  let sum = 0;
  let power = 1; // x^0
  for (let k = 0; k <= n; k++) {
    const dk = numericDerivative(f, 0, k, h);
    hooks.onDerivative?.(k, dk);
    sum += (dk / factorial(k)) * power;
    power *= x;
  }
  hooks.onDone?.(sum);
  return sum;
}
