// 递归卡塔兰数 · 实现
export interface CatalanHooks {
  onRecurse?: (depth: number, n: number) => void;
  onBase?: (depth: number) => void;
  onReturn?: (depth: number, n: number, value: number) => void;
}
export interface CatalanResult {
  result: number;
  depth: number;
  calls: number;
}
export function recCatalanRec(n: number, hooks: CatalanHooks = {}): CatalanResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k <= 1) {
      hooks.onBase?.(depth);
      return 1;
    }
    let sum = 0;
    for (let i = 0; i < k; i++) sum += go(i, depth + 1) * go(k - 1 - i, depth + 1);
    hooks.onReturn?.(depth, k, sum);
    return sum;
  };
  const result = go(n, 0);
  return { result, depth: maxDepth, calls };
}
