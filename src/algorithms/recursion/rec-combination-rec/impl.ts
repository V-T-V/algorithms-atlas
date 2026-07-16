// 递归二项式系数 · 实现
// C(n,k) = C(n−1,k−1) + C(n−1,k)（帕斯卡递推）
// 基线：C(n,0) = C(n,n) = 1；C(n,k) = 0 if k > n.
export interface CombHooks {
  onRecurse?: (depth: number, n: number, k: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface CombResult {
  result: number;
  depth: number;
  calls: number;
}
export function recCombinationRec(n: number, k: number, hooks: CombHooks = {}): CombResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (b === 0 || b === a) {
      hooks.onBase?.(depth, 1);
      return 1;
    }
    if (b > a || b < 0) {
      hooks.onBase?.(depth, 0);
      return 0;
    }
    const v = go(a - 1, b - 1, depth + 1) + go(a - 1, b, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, k, 0);
  return { result, depth: maxDepth, calls };
}
