// =============================================================================
// 整数拆分（最大积）· 纯算法实现
// =============================================================================
export interface SplitHooks {
  onNum?: (i: number, best: number) => void;
  onTry?: (i: number, j: number, val: number) => void;
  onDone?: (max: number) => void;
}

export function integerBreak(n: number, hooks: SplitHooks = {}): number {
  if (n <= 3) {
    hooks.onDone?.(n - 1);
    return n - 1;
  }
  const dp = new Array<number>(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 2;
  dp[3] = 3;
  for (let i = 4; i <= n; i++) {
    let best = 0;
    for (let j = 1; j <= i >> 1; j++) {
      const v = j * (i - j);
      const v2 = j * dp[i - j]!;
      const cand = Math.max(v, v2);
      if (cand > best) best = cand;
      hooks.onTry?.(i, j, cand);
    }
    dp[i] = best;
    hooks.onNum?.(i, best);
  }
  hooks.onDone?.(dp[n]!);
  return dp[n]!;
}
