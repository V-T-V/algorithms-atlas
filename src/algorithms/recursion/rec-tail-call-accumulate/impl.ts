// 尾递归累加器模式 · 纯算法实现
export interface TailCallHooks {
  onRecurse?: (n: number, acc: number) => void;
  onResult?: (result: number) => void;
}

export function factorialTail(n: number, hooks: TailCallHooks = {}): number {
  if (n < 0) throw new Error('n 不能为负');
  const helper = (k: number, acc: number): number => {
    if (k <= 1) return acc;
    hooks.onRecurse?.(k, acc);
    return helper(k - 1, acc * k); // 尾调用
  };
  const r = helper(n, 1);
  hooks.onResult?.(r);
  return r;
}

/** 尾递归版 list 长度（用累加器）。 */
export function lengthTail<T>(arr: readonly T[]): number {
  const helper = (i: number, acc: number): number => {
    if (i >= arr.length) return acc;
    return helper(i + 1, acc + 1);
  };
  return helper(0, 0);
}
