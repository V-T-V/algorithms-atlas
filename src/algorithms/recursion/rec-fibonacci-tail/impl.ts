// 尾递归斐波那契 · 实现

export interface FibHooks {
  onCall?: (n: number, a: bigint, b: bigint, depth: number) => void;
}

/** 尾递归斐波那契：a, b 为累加器。 */
export function fibonacciTail(n: number, a = 0n, b = 1n, depth = 0, hooks: FibHooks = {}): bigint {
  hooks.onCall?.(n, a, b, depth);
  if (n <= 0) return a;
  return fibonacciTail(n - 1, b, a + b, depth + 1, hooks);
}

/** 朴素递归（指数级，对照用）。 */
export function fibonacciNaive(n: number): bigint {
  if (n <= 0) return 0n;
  if (n === 1) return 1n;
  return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}

/** 迭代版（等价 TCO 后）。 */
export function fibonacciIter(n: number): bigint {
  let a = 0n;
  let b = 1n;
  for (let i = 0; i < n; i++) {
    const t = a + b;
    a = b;
    b = t;
  }
  return a;
}
