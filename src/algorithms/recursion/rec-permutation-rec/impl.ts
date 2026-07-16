// 递归排列数 · 实现
export interface PermHooks {
  onRecurse?: (depth: number, n: number, k: number) => void;
  onBase?: (depth: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface PermResult {
  result: number;
  depth: number;
  calls: number;
}
export function recPermutationRec(n: number, k: number, hooks: PermHooks = {}): PermResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (b === 0) {
      hooks.onBase?.(depth);
      return 1;
    }
    const v = a * go(a - 1, b - 1, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, k, 0);
  return { result, depth: maxDepth, calls };
}
