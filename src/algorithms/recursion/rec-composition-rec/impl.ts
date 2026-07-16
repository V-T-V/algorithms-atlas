// 递归组合（有序整数划分）· 实现
// 把 n 写成 k 个正整数之和的方法数（顺序不同算不同方法）。
// 递推：comp(n,k) = comp(n-1, k-1) + comp(n-k, k)
//   - 第一项：含 1 的组合数（去掉一个 1，剩 n-1 分成 k-1 份，仍有序）
//   - 第二项：不含 1 的组合数（每份至少 2，先给每份减 1，剩 n-k 分成 k 份）
// 基线：comp(n,0) = (n==0 ? 1 : 0); comp(n,k) = 0 if k<=0 or n<k.
export interface CompHooks {
  onRecurse?: (depth: number, n: number, k: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface CompResult {
  result: number;
  depth: number;
  calls: number;
}
export function recCompositionRec(n: number, k: number, hooks: CompHooks = {}): CompResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (b === 0) {
      const v = a === 0 ? 1 : 0;
      hooks.onBase?.(depth, v);
      return v;
    }
    if (b < 0 || a < b) {
      hooks.onBase?.(depth, 0);
      return 0;
    }
    const v = go(a - 1, b - 1, depth + 1) + go(a - b, b, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, k, 0);
  return { result, depth: maxDepth, calls };
}
