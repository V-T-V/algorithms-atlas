// =============================================================================
// 阶乘（Factorial）· 纯算法实现
// n! = n × (n-1) × ... × 2 × 1，特别地 0! = 1。
// 经典递归入门：每次把规模 n 化为 n × (n-1)!，直至基线 0! = 1。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每次递归与返回。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface FactorialHooks {
  /** 进入 factorial(n) 递归（给出当前 n）。 */
  onRecurse?: (n: number, depth: number) => void;
  /** 基线情形命中（n=0 返回 1）。 */
  onBase?: (n: number) => void;
  /** 从某层返回（给出该层 n 与该层返回值）。 */
  onReturn?: (n: number, result: number, depth: number) => void;
}

/**
 * 递归阶乘。n! = n × (n-1)!，0! = 1。
 *
 * @param n 非负整数
 * @param hooks 可选事件钩子
 * @param depth 内部用：当前递归深度
 * @returns n!
 */
export function factorial(n: number, hooks: FactorialHooks = {}, depth: number = 0): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`factorial 要求非负整数，收到 ${n}`);
  }
  hooks.onRecurse?.(n, depth);
  if (n === 0) {
    hooks.onBase?.(n);
    hooks.onReturn?.(n, 1, depth);
    return 1;
  }
  const sub = factorial(n - 1, hooks, depth + 1);
  const v = n * sub;
  hooks.onReturn?.(n, v, depth);
  return v;
}

/**
 * 迭代版阶乘（对比用）。0! = 1。
 * 时间 O(n)，空间 O(1)。
 */
export function factorialIterative(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`factorialIterative 要求非负整数，收到 ${n}`);
  }
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
