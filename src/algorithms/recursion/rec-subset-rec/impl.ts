// 递归子集计数 · 实现（决策树视角：第 n 个元素 选 / 不选）
export interface SubsetHooks {
  onRecurse?: (depth: number, n: number, k: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface SubsetResult {
  result: number;
  depth: number;
  calls: number;
}
export function recSubsetRec(n: number, k: number, hooks: SubsetHooks = {}): SubsetResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (b === 0) {
      hooks.onBase?.(depth, 1);
      return 1;
    }
    if (a < b) {
      hooks.onBase?.(depth, 0);
      return 0;
    }
    // 选第 a 个 + 不选第 a 个
    const v = go(a - 1, b - 1, depth + 1) + go(a - 1, b, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, k, 0);
  return { result, depth: maxDepth, calls };
}
