// =============================================================================
// k 逆序对数组数（LeetCode 629 K Inverse Pairs Array）· 纯算法实现
// dp[n][k] = 1..n 排列中恰有 k 个逆序对的数目。
//   dp[n][k] = Σ_{t=0..min(n-1,k)} dp[n-1][k-t]
// 用前缀和优化到 O(nk)。
// =============================================================================

export interface KInverseHooks {
  onCell?: (n: number, k: number, val: number) => void;
  onResult?: (total: number) => void;
}

export function kInversePairs(
  n: number,
  k: number,
  mod = 1_000_000_007,
  hooks: KInverseHooks = {},
): number {
  if (k < 0 || n <= 0) {
    hooks.onResult?.(k === 0 ? 1 : 0);
    return k === 0 ? 1 : 0;
  }
  // dp[k]
  let dp: number[] = new Array<number>(k + 1).fill(0);
  dp[0] = 1;
  hooks.onCell?.(1, 0, 1);
  for (let m = 2; m <= n; m++) {
    const ndp: number[] = new Array<number>(k + 1).fill(0);
    // 前缀和优化
    let window = 0;
    for (let j = 0; j <= k; j++) {
      window = (window + dp[j]!) % mod;
      if (j >= m) window = (window - dp[j - m]! + mod) % mod;
      ndp[j] = window;
      hooks.onCell?.(m, j, window);
    }
    dp = ndp;
  }
  const ans = dp[k]!;
  hooks.onResult?.(ans);
  return ans;
}
