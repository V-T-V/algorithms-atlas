// 递归数字求和 · 实现
export interface DigitsHooks {
  onRecurse?: (depth: number, n: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface DigitsResult {
  result: number;
  depth: number;
  calls: number;
}
export function recDigitsRec(n: number, hooks: DigitsHooks = {}): DigitsResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k < 10) {
      hooks.onBase?.(depth, k);
      return k;
    }
    const v = (k % 10) + go(Math.floor(k / 10), depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(Math.abs(Math.floor(n)), 0);
  return { result, depth: maxDepth, calls };
}
