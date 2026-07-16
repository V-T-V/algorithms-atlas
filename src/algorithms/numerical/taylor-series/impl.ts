// =============================================================================
// 泰勒级数展开（Taylor Series）· 纯算法实现
// 输入：在展开点 a 处的各阶导数值 [f(a), f'(a), f''(a), ...]
// =============================================================================

export interface TaylorHooks {
  /** 累加第 k 项后给出当前部分和与该项贡献。 */
  onTerm?: (k: number, termContribution: number, partialSum: number) => void;
  /** 完成。 */
  onDone?: (result: number) => void;
}

/** 阶乘（迭代）。 */
function factorial(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

/**
 * 用泰勒级数在 a 处展开求 f(x)。
 * @param derivatives 在 a 处的各阶导数值，derivatives[k] = f⁽ᵏ⁾(a)
 * @param x 求值点
 * @param a 展开点
 */
export function taylorSeries(
  derivatives: readonly number[],
  x: number,
  a: number,
  hooks: TaylorHooks = {},
): number {
  if (derivatives.length === 0) throw new RangeError('导数列表不能为空');
  let sum = 0;
  const dx = x - a;
  let power = 1; // (x-a)^0
  for (let k = 0; k < derivatives.length; k++) {
    const term = (derivatives[k]! / factorial(k)) * power;
    sum += term;
    hooks.onTerm?.(k, term, sum);
    power *= dx;
  }
  hooks.onDone?.(sum);
  return sum;
}

/** 在 a=0 处展开（麦克劳林级数）。 */
export function maclaurinSeries(
  derivatives: readonly number[],
  x: number,
  hooks: TaylorHooks = {},
): number {
  return taylorSeries(derivatives, x, 0, hooks);
}
