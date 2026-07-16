// 递归斐波那契 · 实现
export interface FibHooks {
  onRecurse?: (depth: number, n: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, n: number, value: number) => void;
}
export interface FibResult {
  result: number;
  depth: number;
  calls: number;
}
export function recFibRec(n: number, hooks: FibHooks = {}): FibResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k <= 1) {
      hooks.onBase?.(depth, k);
      return k;
    }
    const v = go(k - 1, depth + 1) + go(k - 2, depth + 1);
    hooks.onReturn?.(depth, k, v);
    return v;
  };
  const result = go(n, 0);
  return { result, depth: maxDepth, calls };
}
