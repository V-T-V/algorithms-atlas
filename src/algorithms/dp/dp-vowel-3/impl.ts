// =============================================================================
// 元音字符串计数 · 纯算法实现
// =============================================================================
export interface VowelHooks {
  onLen?: (k: number, counts: number[]) => void;
  onDone?: (total: number) => void;
}

export function countVowelStrings(n: number, hooks: VowelHooks = {}): number {
  let dp = [1, 1, 1, 1, 1];
  for (let k = 2; k <= n; k++) {
    const next = [0, 0, 0, 0, 0];
    let run = 0;
    for (let v = 0; v < 5; v++) {
      run += dp[v]!;
      next[v] = run;
    }
    dp = next;
    hooks.onLen?.(k, next);
  }
  const ans = dp.reduce((a, b) => a + b, 0);
  hooks.onDone?.(ans);
  return ans;
}
