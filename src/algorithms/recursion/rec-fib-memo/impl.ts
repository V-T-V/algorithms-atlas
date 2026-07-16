// 记忆化斐波那契 · 实现
export interface FibMemoHooks {
  onRecurse?: (depth: number, n: number) => void;
  onCache?: (n: number, value: number) => void;
  onReturn?: (depth: number, n: number, value: number) => void;
}
export interface FibMemoResult {
  result: number;
  depth: number;
  calls: number;
}
export function recFibMemo(n: number, hooks: FibMemoHooks = {}): FibMemoResult {
  const memo = new Map<number, number>();
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k <= 1) return k;
    const cached = memo.get(k);
    if (cached !== undefined) {
      hooks.onCache?.(k, cached);
      return cached;
    }
    const v = go(k - 1, depth + 1) + go(k - 2, depth + 1);
    memo.set(k, v);
    hooks.onReturn?.(depth, k, v);
    return v;
  };
  const result = go(n, 0);
  return { result, depth: maxDepth, calls };
}
