// 尾递归阶乘 · 实现

export interface FactHooks {
  onCall?: (n: number, acc: number, depth: number) => void;
}

/** 尾递归阶乘（带累加器）。 */
export function factorialTail(n: number, acc = 1n, depth = 0, hooks: FactHooks = {}): bigint {
  hooks.onCall?.(n, Number(acc), depth);
  if (n <= 1) return acc;
  return factorialTail(n - 1, acc * BigInt(n), depth + 1, hooks);
}

/** 朴素递归阶乘（非尾递归，对照用）。 */
export function factorialNaive(n: number): bigint {
  if (n <= 1) return 1n;
  return BigInt(n) * factorialNaive(n - 1);
}

/** 迭代版（等价于 TCO 后的尾递归）。 */
export function factorialIter(n: number): bigint {
  let r = 1n;
  for (let i = 2; i <= n; i++) r *= BigInt(i);
  return r;
}
